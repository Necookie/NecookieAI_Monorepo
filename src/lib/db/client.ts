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

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = import.meta.env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error("Missing Turso database credentials (TURSO_DATABASE_URL / TURSO_AUTH_TOKEN) in environment variables.");
}

const isLocalFile = url.startsWith("file:");

// Use embedded replica if the URL is a remote Turso DB.
// This requires persistent local disk storage (e.g. VPS or Docker, not Vercel/Netlify Serverless).
const clientConfig = isLocalFile
  ? { url, authToken }
  : {
      url: "file:local-replica.db",
      syncUrl: url,
      authToken,
      syncInterval: 60, // Auto sync every 60 seconds
    };

const client = createClient(clientConfig);
export const db = drizzle(client, { schema });
export type Db = typeof db;
