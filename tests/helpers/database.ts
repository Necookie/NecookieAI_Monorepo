import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../../src/lib/db/schema.ts';

export const client = createClient({ url: 'file::memory:' });
export const db = drizzle(client, { schema });

await client.executeMultiple(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE settings (user_id TEXT PRIMARY KEY, language TEXT NOT NULL, model TEXT NOT NULL);
  CREATE TABLE chats (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL,
    created_at TEXT NOT NULL, folder TEXT, pinned INTEGER DEFAULT 0
  );
  CREATE TABLE messages (
    id TEXT PRIMARY KEY, chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL, content TEXT NOT NULL, timestamp TEXT NOT NULL
  );
`);
