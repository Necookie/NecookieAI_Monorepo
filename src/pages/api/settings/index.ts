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

export const GET: APIRoute = async () => {
  try {
    const allSettings = await db.select().from(settings);
    const settingsObj = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return new Response(JSON.stringify(settingsObj), {
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (body.key !== undefined && body.value !== undefined) {
      const { key, value } = body;
      await db
        .insert(settings)
        .values({ key, value: String(value) })
        .onConflictDoUpdate({ target: settings.key, set: { value: String(value) } });
    } else {
      for (const [key, val] of Object.entries(body)) {
        await db
          .insert(settings)
          .values({ key, value: String(val) })
          .onConflictDoUpdate({ target: settings.key, set: { value: String(val) } });
      }
    }

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
