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

/**
 * Global application state store.
 * Uses plain React state + context — no external store needed for single-island architecture.
 * Types and utilities only exported from here.
 */

export type Role = "user" | "assistant";
export type ThemeMode = "light" | "dark" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  /** ISO timestamp */
  timestamp: string;
  /** True while streaming */
  streaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  folder?: string | null;
}

export interface Model {
  id: string;
  label: string;
}

export const AVAILABLE_MODELS: Model[] = [
  { id: "neco-ai-1.0", label: "Neco AI 1.0" },
];

export const SUGGESTION_PROMPTS = [
  {
    icon: "Pencil",
    title: "Draft an email",
    description: "Write professional emails quickly",
    prompt: "Help me draft a professional email to",
  },
  {
    icon: "Code2",
    title: "Write code",
    description: "Generate or debug any code",
    prompt: "Write a function that",
  },
  {
    icon: "FileText",
    title: "Create an essay",
    description: "Outline and write complex topics",
    prompt: "Write an essay about",
  },
  {
    icon: "Lightbulb",
    title: "Brainstorm ideas",
    description: "Explore creative possibilities",
    prompt: "Give me 10 ideas for",
  },
] as const;

/** Generate a UUID-like unique ID (no crypto dependency) */
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

/** Derive a short title from the first user message */
export function deriveTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim().slice(0, 60);
  return trimmed.length < firstMessage.trim().length ? trimmed + "…" : trimmed;
}
