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
import { db } from "../../../lib/db/client";
import { chats, messages } from "../../../lib/db/schema";
import { and, eq } from "drizzle-orm";

export const DELETE: APIRoute = async (context) => {
  try {
    const { userId } = context.locals.auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing chat ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingChats = await db.select().from(chats).where(and(eq(chats.id, id), eq(chats.userId, userId)));
    
    if (existingChats.length === 0) {
      return new Response(JSON.stringify({ error: "Chat not found or unauthorized" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Securely delete messages first to avoid foreign key constraint errors
    await db.delete(messages).where(eq(messages.chatId, id));
    
    // Then delete the chat
    await db.delete(chats).where(eq(chats.id, id));

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
