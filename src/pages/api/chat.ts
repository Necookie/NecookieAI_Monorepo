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

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

/**
 * POST /api/chat
 *
 * Secure server-side proxy to the Necookie AI endpoint.
 * Keeps CF-Access credentials off the client entirely.
 *
 * Request body (JSON):
 *   { messages: Array<{role, content}>, stream?: boolean }
 *
 * Response:
 *   - If stream=true  → application/x-ndjson, one JSON chunk per line
 *   - If stream=false → application/json, Ollama-compatible response
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const { userId } = locals.auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const endpoint = env.NECOOKIE_ENDPOINT;
  const clientId = env.MODEL_ACCESS_CLIENT_ID;
  const clientSecret = env.MODEL_ACCESS_CLIENT_SECRET;
  const model = env.NECOOKIE_MODEL;

  if (!endpoint || !clientId || !clientSecret || !model) {
    return new Response(
      JSON.stringify({ error: "Server misconfigured: missing env vars." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { messages?: unknown; stream?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (
    !Array.isArray(body.messages) ||
    body.messages.length === 0 ||
    body.messages.length > 100 ||
    !body.messages.every(
      (message) =>
        message &&
        typeof message === "object" &&
        ["user", "assistant", "system"].includes(message.role) &&
        typeof message.content === "string" &&
        message.content.length <= 20000
    )
  ) {
    return new Response(JSON.stringify({ error: "Invalid messages." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const useStream = body.stream !== false; // default true

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "CF-Access-Client-Id": clientId,
        "CF-Access-Client-Secret": clientSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: body.messages,
        stream: useStream,
      }),
    });

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({ error: `Model request failed (${upstream.status}).` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    if (useStream) {
      // Pass the upstream NDJSON stream directly to the client
      return new Response(upstream.body, {
        status: 200,
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no",
        },
      });
    } else {
      // Non-streaming: forward full JSON response
      const data = await upstream.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("Model request failed", err);
    return new Response(JSON.stringify({ error: "Model request failed." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};
