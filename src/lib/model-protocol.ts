/*
 * Copyright 2026 Dheyn Michael Orlanda
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Shared helpers for talking to the Ollama-compatible model gateway.
 * Kept free of runtime-specific imports so they run in the Worker, the
 * browser, and under `node --test`.
 */

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

/** Limits enforced by the model gateway on the Acer inference host. */
export const GATEWAY_REQUEST_LIMITS = Object.freeze({
  maxMessages: 32,
  // The gateway rejects bodies over 65536 bytes; leave headroom for the envelope.
  maxBytes: 60000,
});

/** Generation options requested for Necookie AI replies. */
export const GENERATION_OPTIONS = Object.freeze({
  num_ctx: 4096,
  num_predict: 1024,
});

const encoder = new TextEncoder();
const byteLength = (value: unknown) => encoder.encode(JSON.stringify(value)).length;

/**
 * Keep the most recent turns that fit the gateway's message-count and byte
 * limits. The newest turn is always kept. Leading assistant turns are dropped
 * so the history sent upstream starts with a user turn.
 */
export function fitHistory(
  messages: ChatTurn[],
  limits: { maxMessages: number; maxBytes: number } = GATEWAY_REQUEST_LIMITS,
): ChatTurn[] {
  if (messages.length === 0) return [];
  const kept: ChatTurn[] = [];
  // Envelope estimate: model name, stream flag, options and JSON punctuation.
  let bytes = 256;
  for (let i = messages.length - 1; i >= 0; i--) {
    const size = byteLength(messages[i]) + 1;
    if (kept.length > 0 && (kept.length >= limits.maxMessages || bytes + size > limits.maxBytes)) break;
    kept.unshift(messages[i]);
    bytes += size;
  }
  while (kept.length > 1 && kept[0].role === "assistant") kept.shift();
  return kept;
}

/** Thrown when the model stream ends before Ollama reports `done: true`. */
export class IncompleteResponseError extends Error {
  constructor(message = "The response was cut off before it finished. Try regenerating it.") {
    super(message);
    this.name = "IncompleteResponseError";
  }
}

/**
 * Read an Ollama NDJSON chat stream, calling `onDelta` for each content
 * fragment. Resolves once a `done: true` line arrives; throws
 * IncompleteResponseError if the stream ends without one, or an Error when
 * the stream carries an `error` line.
 */
export async function readChatStream(
  body: ReadableStream<Uint8Array>,
  onDelta: (delta: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const handle = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    let chunk: { message?: { content?: unknown }; done?: unknown; error?: unknown };
    try {
      chunk = JSON.parse(trimmed);
    } catch {
      return false; // malformed line — skip
    }
    if (chunk?.error !== undefined) {
      throw new Error(typeof chunk.error === "string" ? `Model error: ${chunk.error}` : "Model error.");
    }
    const delta = chunk?.message?.content;
    if (typeof delta === "string" && delta) onDelta(delta);
    return chunk?.done === true;
  };

  try {
    while (true) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      let result: ReadableStreamReadResult<Uint8Array>;
      try {
        result = await reader.read();
      } catch (err) {
        if (signal?.aborted || (err as Error)?.name === "AbortError") throw err;
        throw new IncompleteResponseError();
      }
      if (result.done) break;
      buffer += decoder.decode(result.value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) if (handle(line)) return;
    }
    buffer += decoder.decode();
    if (handle(buffer)) return;
    throw new IncompleteResponseError();
  } finally {
    reader.cancel().catch(() => {});
  }
}

/** Map a gateway/upstream HTTP status to a message suitable for the UI. */
export function upstreamErrorMessage(status: number): string {
  if (status === 429 || status === 503) return "Necookie AI is busy right now. Please try again in a moment.";
  if (status === 504) return "Necookie AI took too long to respond. Please try again.";
  if (status === 400) return "This conversation is too long for the model. Start a new chat and try again.";
  return `Model request failed (${status}).`;
}
