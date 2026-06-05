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

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
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

  // Restore chats and settings from Turso on mount
  useEffect(() => {
    // 1. Fetch chats
    fetch("/api/chats")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChats(data);
          if (data.length > 0) {
            setActiveId(data[0].id);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching chats from DB:", err);
        setError("Failed to load chat history.");
      });

    // 2. Fetch settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.language) setLanguage(data.language as Locale);
        if (data.model) {
          const found = AVAILABLE_MODELS.find((m) => m.id === data.model);
          if (found) setModel(found);
        }
      })
      .catch((err) => {
        console.error("Error fetching settings from DB:", err);
      });
  }, []);

  const newChat = useCallback(async () => {
    const id = uid();
    const chat: Chat = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chat),
      });
      setChats((prev) => [chat, ...prev]);
      setActiveId(id);
    } catch (err) {
      console.error("Failed to create chat in DB:", err);
      setError("Failed to create chat session.");
    }
  }, []);

  const selectChat = useCallback((id: string) => setActiveId(id), []);

  const deleteChat = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/chats/delete?id=${id}`, {
          method: "DELETE",
        });
        setChats((prev) => prev.filter((c) => c.id !== id));
        if (activeId === id) setActiveId(null);
      } catch (err) {
        console.error("Failed to delete chat in DB:", err);
        setError("Failed to delete chat.");
      }
    },
    [activeId]
  );

  const changeLanguage = useCallback((l: Locale) => {
    setLanguage(l);
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: l }),
    }).catch((err) => console.error("Error saving language setting:", err));
  }, []);

  const changeModel = useCallback((m: Model) => {
    setModel(m);
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: m.id }),
    }).catch((err) => console.error("Error saving model setting:", err));
  }, []);

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
      let targetChatTitle = "New Chat";

      if (!targetId) {
        // No active chat — create one inline first
        const newId = uid();
        targetId = newId;
        targetChatTitle = deriveTitle(content);
        const newC: Chat = {
          id: newId,
          title: targetChatTitle,
          messages: [userMsg],
          createdAt: new Date().toISOString(),
        };

        try {
          await fetch("/api/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newC),
          });
          setChats((prev) => [newC, ...prev]);
          setActiveId(newId);
        } catch (err) {
          console.error("Failed to initialize chat in DB:", err);
          setError("Failed to start chat session.");
          return;
        }
      } else {
        // Appending to an existing chat. Check if title needs updating (if first message)
        const currentChat = chatsRef.current.find((c) => c.id === targetId);
        if (currentChat && currentChat.messages.length === 0) {
          targetChatTitle = deriveTitle(content);
          try {
            await fetch("/api/chats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: targetId,
                title: targetChatTitle,
                createdAt: currentChat.createdAt,
              }),
            });
            setChats((prev) =>
              prev.map((c) => (c.id === targetId ? { ...c, title: targetChatTitle } : c))
            );
          } catch (err) {
            console.error("Failed to update chat title in DB:", err);
          }
        }
      }

      // Save user message to database
      try {
        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userMsg.id,
            chatId: targetId,
            role: userMsg.role,
            content: userMsg.content,
            timestamp: userMsg.timestamp,
          }),
        });

        // Update UI state for user message
        setChats((prev) =>
          prev.map((c) => {
            if (c.id !== targetId) return c;
            return {
              ...c,
              messages: [...c.messages.filter((m) => m.id !== userMsg.id), userMsg],
            };
          })
        );
      } catch (err) {
        console.error("Failed to save user message in DB:", err);
        setError("Failed to save message.");
        return;
      }

      // Add empty assistant placeholder message
      const assistantId = uid();
      const assistantMsgTimestamp = new Date().toISOString();
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
                    timestamp: assistantMsgTimestamp,
                    streaming: true,
                  },
                ],
              }
            : c
        )
      );

      setIsStreaming(true);

      // Build message history to send to LLM
      const chatSnapshot = chatsRef.current.find((c) => c.id === targetId);
      const priorMsgs = (chatSnapshot?.messages ?? [])
        .filter((m) => m.id !== assistantId && m.content)
        .map((m) => ({ role: m.role, content: m.content }));
      
      const hasUserMsg = priorMsgs.some((m) => m.content === userMsg.content && m.role === "user");
      const historySnapshot = hasUserMsg
        ? priorMsgs
        : [...priorMsgs, { role: userMsg.role, content: userMsg.content }];

      let accumulatedText = "";

      try {
        await streamNecookieAI(
          historySnapshot,
          (delta) => {
            accumulatedText += delta;
            setChats((prev) =>
              prev.map((c) =>
                c.id === targetId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantId
                          ? { ...m, content: accumulatedText }
                          : m
                      ),
                    }
                  : c
              )
            );
          },
          abort.signal
        );

        // Save assistant response to database on successful stream completion
        if (accumulatedText.trim()) {
          await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: assistantId,
              chatId: targetId,
              role: "assistant",
              content: accumulatedText,
              timestamp: assistantMsgTimestamp,
            }),
          });
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // User stopped the stream - save whatever was generated so far
          if (accumulatedText.trim()) {
            await fetch("/api/messages", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: assistantId,
                chatId: targetId,
                role: "assistant",
                content: accumulatedText,
                timestamp: assistantMsgTimestamp,
              }),
            }).catch((dbErr) => console.error("Failed to save partial AI message:", dbErr));
          }
        } else {
          const message = err instanceof Error ? err.message : "Unknown error from AI.";
          setError(message);
          // Remove assistant placeholder on error
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
        language: language,
        setLanguage: changeLanguage,
        setModel: changeModel,
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
