import type { APIRoute } from "astro";

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
 *   - If stream=true  → text/event-stream (SSE), one JSON chunk per line
 *   - If stream=false → application/json, Ollama-compatible response
 */
export const POST: APIRoute = async ({ request }) => {
  const endpoint = import.meta.env.NECOOKIE_ENDPOINT;
  const clientId = import.meta.env.NECOOKIE_CLIENT_ID;
  const clientSecret = import.meta.env.NECOOKIE_CLIENT_SECRET;
  const model = import.meta.env.NECOOKIE_MODEL ?? "necookie-ai";

  if (!endpoint || !clientId || !clientSecret) {
    return new Response(
      JSON.stringify({ error: "Server misconfigured: missing env vars." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { messages: unknown[]; stream?: boolean };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
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
      const errText = await upstream.text();
      return new Response(
        JSON.stringify({ error: `Upstream error ${upstream.status}: ${errText}` }),
        { status: upstream.status, headers: { "Content-Type": "application/json" } }
      );
    }

    if (useStream) {
      // Pass the upstream NDJSON stream directly to the client
      return new Response(upstream.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
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
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};
