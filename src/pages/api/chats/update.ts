import type { APIRoute } from "astro";
import { db } from "../../../lib/db/client";
import { chats } from "../../../lib/db/schema";
import { and, eq } from "drizzle-orm";

export const PATCH: APIRoute = async (context) => {
  try {
    const { userId } = context.locals.auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await context.request.json();
    const { id, folder, pinned } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing chat ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updateData: any = {};
    if (folder !== undefined) updateData.folder = folder || null;
    if (pinned !== undefined) updateData.pinned = pinned;

    // Securely update only if the chat belongs to the authenticated user
    await db.update(chats)
      .set(updateData)
      .where(and(eq(chats.id, id), eq(chats.userId, userId)));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
