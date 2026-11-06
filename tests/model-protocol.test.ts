import { test } from "node:test";
import assert from "node:assert/strict";
import {
  fitHistory,
  GATEWAY_REQUEST_LIMITS,
  IncompleteResponseError,
  readChatStream,
  upstreamErrorMessage,
  type ChatTurn,
} from "../src/lib/model-protocol.ts";

const encoder = new TextEncoder();

/** A stream that emits the given string chunks, then closes (or errors). */
function streamOf(chunks: string[], { error }: { error?: Error } = {}) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      if (error) controller.error(error);
      else controller.close();
    },
  });
}
const line = (content: string, done = false) =>
  JSON.stringify({ message: { role: "assistant", content }, done }) + "\n";

async function collect(chunks: string[], opts?: { error?: Error }) {
  let text = "";
  await readChatStream(streamOf(chunks, opts), (d) => (text += d));
  return text;
}

test("reads a complete stream, including lines split across chunks", async () => {
  const full = line("Hello") + line(", world") + line("", true);
  const text = await collect([full.slice(0, 7), full.slice(7, 40), full.slice(40)]);
  assert.equal(text, "Hello, world");
});

test("accepts a final done line without a trailing newline", async () => {
  const text = await collect([line("Hi"), JSON.stringify({ message: { content: "!" }, done: true })]);
  assert.equal(text, "Hi!");
});

test("a stream that ends without done:true is reported as cut off (the production bug)", async () => {
  // Reproduces the gateway closing the stream at its deadline mid-sentence.
  let text = "";
  await assert.rejects(
    readChatStream(streamOf([line("Certainly! Below is an example of"), line(" a simple C++ program that uses the two")]), (d) => (text += d)),
    IncompleteResponseError,
  );
  assert.equal(text, "Certainly! Below is an example of a simple C++ program that uses the two");
});

test("a connection reset mid-stream is reported as cut off", async () => {
  await assert.rejects(collect([line("Sorry,")], { error: new TypeError("network error") }), IncompleteResponseError);
});

test("an error line from the model surfaces as an error", async () => {
  await assert.rejects(collect([line("partial"), JSON.stringify({ error: "deadline_exceeded" }) + "\n"]), /deadline_exceeded/);
});

test("an aborted signal rejects with AbortError, not IncompleteResponseError", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(readChatStream(streamOf([line("x")]), () => {}, controller.signal), { name: "AbortError" });
});

const turns = (n: number, size = 10): ChatTurn[] =>
  Array.from({ length: n }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: `${i}:`.padEnd(size, "x") }));
const bodyBytes = (messages: ChatTurn[]) =>
  encoder.encode(JSON.stringify({ model: "necookie-ai:latest", messages, stream: true, options: { num_ctx: 4096, num_predict: 1024 } })).length;

test("fitHistory keeps short histories unchanged", () => {
  const history = turns(5);
  assert.deepEqual(fitHistory(history), history);
});

test("fitHistory keeps at most 32 messages, newest last, starting with a user turn", () => {
  const history = turns(99);
  const fitted = fitHistory(history);
  assert.ok(fitted.length <= GATEWAY_REQUEST_LIMITS.maxMessages);
  assert.equal(fitted.at(-1), history.at(-1));
  assert.equal(fitted[0].role, "user");
});

test("fitHistory keeps the request body under the gateway's 64 KB limit", () => {
  const history = turns(30, 5000); // ~150 KB of history
  const fitted = fitHistory(history);
  assert.ok(fitted.length < history.length);
  assert.ok(bodyBytes(fitted) < 65536, `body was ${bodyBytes(fitted)} bytes`);
  assert.equal(fitted.at(-1), history.at(-1));
});

test("fitHistory counts multi-byte characters by their UTF-8 size", () => {
  const history: ChatTurn[] = Array.from({ length: 8 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: "こ".repeat(6000) }));
  assert.ok(bodyBytes(fitHistory(history)) < 65536);
});

test("fitHistory always keeps the newest message", () => {
  const history: ChatTurn[] = [{ role: "user", content: "x".repeat(20000) }];
  assert.deepEqual(fitHistory(history), history);
});

test("busy and timeout statuses map to readable messages", () => {
  assert.match(upstreamErrorMessage(429), /busy/);
  assert.match(upstreamErrorMessage(503), /busy/);
  assert.match(upstreamErrorMessage(504), /too long/);
  assert.equal(upstreamErrorMessage(500), "Model request failed (500).");
});
