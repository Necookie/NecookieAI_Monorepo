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

import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = import.meta.env.TURSO_DATABASE_URL || (typeof process !== 'undefined' && process.env ? process.env.TURSO_DATABASE_URL : undefined);
const authToken = import.meta.env.TURSO_AUTH_TOKEN || (typeof process !== 'undefined' && process.env ? process.env.TURSO_AUTH_TOKEN : undefined);

if (!url || !authToken) {
  throw new Error("Missing Turso database credentials (TURSO_DATABASE_URL / TURSO_AUTH_TOKEN) in environment variables.");
}

const client = createClient({ url, authToken });
export const db = drizzle(client, { schema });
export type Db = typeof db;

