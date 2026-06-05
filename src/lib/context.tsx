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

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { Chat, Message, Model } from "./store";
import { uid, deriveTitle, AVAILABLE_MODELS } from "./store";
import type { Locale } from "./i18n";

/* ─── Context shape ─── */
interface AppCtx {
  chats: Chat[];
  activeId: string | null;
  activeChat: Chat | null;
  model: Model;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  showHelp: boolean;
  setShowHelp: (v: boolean) => void;
  language: Locale;
  setLanguage: (l: Locale) => void;
  setModel: (m: Model) => void;
  newChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  isStreaming: boolean;
  error: string | null;
  clearError: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

/* ─── Ollama NDJSON streaming helper ───────────────────────────────────────
 * The Necookie AI endpoint returns newline-delimited JSON (Ollama format).
 * Each line: { message: { role, content }, done: boolean }
 * We accumulate the `content` delta from each chunk and yield it.
 * ──────────────────────────────────────────────────────────────────────── */
async function streamNecookieAI(
  messages: Array<{ role: string; content: string }>,
  onChunk: (delta: string) => void,
  signal: AbortSignal
): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, stream: true }),
    signal,
  });

  if (!res.ok) {
    let errMsg = `API error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.error) errMsg = errJson.error;
    } catch {}
    throw new Error(errMsg);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body from server.");

  const decoder = new TextDecoder();
  let buffer = "";

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (signal.aborted) break;

    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Ollama sends one JSON object per line
    const lines = buffer.split("\n");
    // Keep the last partial line in the buffer
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const chunk = JSON.parse(trimmed);
        const delta: string = chunk?.message?.content ?? "";
        if (delta) onChunk(delta);
        if (chunk?.done) return; // final chunk
      } catch {
        // malformed line — skip
      }
    }
  }
}

/* ─── Provider ─── */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [model, setModel] = useState<Model>(AVAILABLE_MODELS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [language, setLanguage] = useState<Locale>("en");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Keep a ref mirror of chats so we can read the latest state synchronously
  const chatsRef = useRef(chats);
  chatsRef.current = chats;

  const activeChat = chats.find((c) => c.id === activeId) ?? null;

  const clearError = useCallback(() => setError(null), []);

  const newChat = useCallback(() => {
    const id = uid();
    const chat: Chat = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats((prev) => [chat, ...prev]);
    setActiveId(id);
  }, []);

  const selectChat = useCallback((id: string) => setActiveId(id), []);

  const deleteChat = useCallback(
    (id: string) => {
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) setActiveId(null);
    },
    [activeId]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      setError(null);

      // Abort any prior stream
      abortRef.current?.abort();
      const abort = new AbortController();
      abortRef.current = abort;

      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      // Resolve (or create) the target chat
      let targetId = activeId;

      setChats((prev) => {
        // If we have an active chat, append to it
        if (targetId) {
          return prev.map((c) => {
            if (c.id !== targetId) return c;
            const isFirst = c.messages.length === 0;
            return {
              ...c,
              title: isFirst ? deriveTitle(content) : c.title,
              messages: [...c.messages, userMsg],
            };
          });
        }
        // No active chat — create a new one inline
        const newId = uid();
        targetId = newId;
        const newC: Chat = {
          id: newId,
          title: deriveTitle(content),
          messages: [userMsg],
          createdAt: new Date().toISOString(),
        };
        return [newC, ...prev];
      });

      if (!activeId && targetId) setActiveId(targetId);

      // Add empty assistant placeholder
      const assistantId = uid();
      setChats((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: assistantId,
                    role: "assistant" as const,
                    content: "",
                    timestamp: new Date().toISOString(),
                    streaming: true,
                  },
                ],
              }
            : c
        )
      );

      setIsStreaming(true);

      // Build the full message history synchronously from the ref.
      // We include userMsg explicitly since the prior setChats may not
      // have flushed yet (React batches state updates).
      const chatSnapshot = chatsRef.current.find((c) => c.id === targetId);
      const priorMsgs = (chatSnapshot?.messages ?? [])
        .filter((m) => m.id !== assistantId && m.content)
        .map((m) => ({ role: m.role, content: m.content }));
      // Guarantee the user message we just added is included
      const hasUserMsg = priorMsgs.some((m) => m.content === userMsg.content && m.role === "user");
      const historySnapshot = hasUserMsg
        ? priorMsgs
        : [...priorMsgs, { role: userMsg.role, content: userMsg.content }];

      try {
        await streamNecookieAI(
          historySnapshot,
          (delta) => {
            setChats((prev) =>
              prev.map((c) =>
                c.id === targetId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantId
                          ? { ...m, content: m.content + delta }
                          : m
                      ),
                    }
                  : c
              )
            );
          },
          abort.signal
        );
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // User stopped — that's fine
        } else {
          const message =
            err instanceof Error ? err.message : "Unknown error from AI.";
          setError(message);
          // Remove the empty placeholder on hard error
          setChats((prev) =>
            prev.map((c) =>
              c.id === targetId
                ? {
                    ...c,
                    messages: c.messages.filter((m) => m.id !== assistantId),
                  }
                : c
            )
          );
        }
      } finally {
        // Mark stream complete
        setChats((prev) =>
          prev.map((c) =>
            c.id === targetId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantId ? { ...m, streaming: false } : m
                  ),
                }
              : c
          )
        );
        setIsStreaming(false);
      }
    },
    [activeId, isStreaming]
  );

  return (
    <Ctx.Provider
      value={{
        chats,
        activeId,
        activeChat,
        model,
        sidebarOpen,
        setSidebarOpen,
        showSettings,
        setShowSettings,
        showHelp,
        setShowHelp,
        language,
        setLanguage,
        setModel,
        newChat,
        selectChat,
        deleteChat,
        sendMessage,
        isStreaming,
        error,
        clearError,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
