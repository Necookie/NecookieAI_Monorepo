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
import { settings } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async (context) => {
  try {
    const { userId } = context.locals.auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userSettings = await db.query.settings.findFirst({
      where: eq(settings.userId, userId),
    });

    // Return properties or empty object if not configured
    return new Response(JSON.stringify(userSettings || {}), {
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

export const POST: APIRoute = async (context) => {
  try {
    const { userId } = context.locals.auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await context.request.json();

    // Fetch existing settings to merge new fields
    const current = (await db.query.settings.findFirst({
      where: eq(settings.userId, userId),
    })) || { language: "en", model: "neco-ai-1.0" };

    const language = body.language !== undefined ? String(body.language) : current.language;
    const model = body.model !== undefined ? String(body.model) : current.model;

    // Upsert user preference settings
    await db
      .insert(settings)
      .values({
        userId,
        language,
        model,
      })
      .onConflictDoUpdate({
        target: settings.userId,
        set: { language, model },
      });

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
