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

import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/**
 * Settings Table
 * Stores key-value user preferences like language and model selections.
 */
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

/**
 * Chats Table
 * Stores chat session details.
 */
export const chats = sqliteTable("chats", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: text("created_at").notNull(),
});

export const chatsRelations = relations(chats, ({ many }) => ({
  messages: many(messages),
}));

/**
 * Messages Table
 * Stores individual user and assistant messages for each chat session.
 */
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  chatId: text("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));
