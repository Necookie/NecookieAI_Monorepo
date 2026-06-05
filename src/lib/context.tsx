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

import React, { useEffect } from "react";
import { create } from "zustand";
import type { Chat, Message, Model, ThemeMode } from "./store";
import { uid, deriveTitle, AVAILABLE_MODELS } from "./store";
import type { Locale } from "./i18n";

/* ─── Ollama NDJSON streaming helper ─── */
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

  while (true) {
    if (signal.aborted) break;

    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const chunk = JSON.parse(trimmed);
        const delta: string = chunk?.message?.content ?? "";
        if (delta) onChunk(delta);
        if (chunk?.done) return;
      } catch {
        // malformed line — skip
      }
    }
  }
}

function applyThemeClass(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

/* ─── Zustand Store ─── */
interface AppStore {
  chats: Chat[];
  activeId: string | null;
  model: Model;
  theme: ThemeMode;
  sidebarOpen: boolean;
  showSettings: boolean;
  showHelp: boolean;
  language: Locale;
  isStreaming: boolean;
  error: string | null;
  abortController: AbortController | null;

  activeChat: () => Chat | null;
  
  setTheme: (t: ThemeMode) => void;
  setSidebarOpen: (v: boolean) => void;
  setShowSettings: (v: boolean) => void;
  setShowHelp: (v: boolean) => void;
  setLanguage: (l: Locale) => void;
  setModel: (m: Model) => void;
  newChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  regenerateMessage: (messageId: string) => Promise<void>;
  editAndResend: (messageId: string, newContent: string) => Promise<void>;
  clearError: () => void;
  
  _fetchInitialData: () => Promise<void>;
  _fetchMessages: (chatId: string) => Promise<void>;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("necookie-theme") as ThemeMode;
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  }
  return "light";
};

export const useAppStore = create<AppStore>((set, get) => ({
  chats: [],
  activeId: null,
  model: AVAILABLE_MODELS[0],
  theme: getInitialTheme(),
  sidebarOpen: true,
  showSettings: false,
  showHelp: false,
  language: "en",
  isStreaming: false,
  error: null,
  abortController: null,

  activeChat: () => {
    const { chats, activeId } = get();
    return chats.find((c) => c.id === activeId) ?? null;
  },

  setTheme: (t) => {
    set({ theme: t });
    if (typeof window !== "undefined") {
      localStorage.setItem("necookie-theme", t);
      applyThemeClass(t);
    }
  },
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setShowSettings: (v) => set({ showSettings: v }),
  setShowHelp: (v) => set({ showHelp: v }),
  
  setLanguage: (l) => {
    set({ language: l });
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: l }),
    }).catch(console.error);
  },

  setModel: (m) => {
    set({ model: m });
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: m.id }),
    }).catch(console.error);
  },

  clearError: () => set({ error: null }),

  newChat: async () => {
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
        body: JSON.stringify({ id, title: chat.title, createdAt: chat.createdAt }),
      });
      set((state) => ({ chats: [chat, ...state.chats], activeId: id }));
    } catch (err) {
      console.error("Failed to create chat in DB:", err);
      set({ error: "Failed to create chat session." });
    }
  },

  selectChat: async (id) => {
    set({ activeId: id });
    await get()._fetchMessages(id);
  },

  deleteChat: async (id) => {
    try {
      await fetch(`/api/chats/delete?id=${id}`, { method: "DELETE" });
      set((state) => ({
        chats: state.chats.filter((c) => c.id !== id),
        activeId: state.activeId === id ? null : state.activeId,
      }));
    } catch (err) {
      console.error("Failed to delete chat in DB:", err);
      set({ error: "Failed to delete chat." });
    }
  },

  _fetchInitialData: async () => {
    try {
      const [chatsRes, settingsRes] = await Promise.all([
        fetch("/api/chats"),
        fetch("/api/settings")
      ]);

      if (chatsRes.ok) {
        const data = await chatsRes.json();
        if (Array.isArray(data)) {
          // Initialize with empty messages since backend now omits them
          const chatsWithEmptyMsgs = data.map(c => ({ ...c, messages: c.messages || [] }));
          set({ chats: chatsWithEmptyMsgs });
          if (data.length > 0) {
            get().selectChat(data[0].id);
          }
        }
      } else if (chatsRes.status !== 401) {
        set({ error: "Failed to load chat history." });
      }

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        if (data.language) set({ language: data.language as Locale });
        if (data.model) {
          const found = AVAILABLE_MODELS.find((m) => m.id === data.model);
          if (found) set({ model: found });
        }
      } else if (settingsRes.status !== 401) {
         // silently ignore 401 for settings as well
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
      set({ error: "Failed to load initial data." });
    }
  },

  _fetchMessages: async (chatId: string) => {
    const { chats } = get();
    const chat = chats.find(c => c.id === chatId);
    // If we already have messages loaded, no need to re-fetch unless they are empty
    // But since empty could mean a new chat, we verify if it's already populated
    // To be safe and simple, we fetch if messages.length === 0 and it's not a brand new inline chat
    // For optimal perf, we can just fetch every time we select if we want to ensure freshness,
    // or cache them. We'll cache them and only fetch if empty.
    if (chat && chat.messages && chat.messages.length > 0) return;

    try {
      const res = await fetch(`/api/chats/${chatId}/messages`);
      if (res.ok) {
        const messages = await res.json();
        set(state => ({
          chats: state.chats.map(c => c.id === chatId ? { ...c, messages } : c)
        }));
      }
    } catch (err) {
      console.error("Error fetching messages for chat", chatId, err);
    }
  },

  sendMessage: async (content) => {
    const { isStreaming, activeId, chats } = get();
    if (!content.trim() || isStreaming) return;

    set({ error: null });

    // Abort prior
    const prevAbort = get().abortController;
    prevAbort?.abort();
    const abort = new AbortController();
    set({ abortController: abort });

    const userMsg: Message = {
      id: uid(),
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    let targetId = activeId;
    let targetChatTitle = "New Chat";

    if (!targetId) {
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
          body: JSON.stringify({ id: newId, title: targetChatTitle, createdAt: newC.createdAt }),
        });
        set(state => ({ chats: [newC, ...state.chats], activeId: newId }));
      } catch (err) {
        set({ error: "Failed to start chat session." });
        return;
      }
    } else {
      const currentChat = chats.find((c) => c.id === targetId);
      if (currentChat && (!currentChat.messages || currentChat.messages.length === 0)) {
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
          set(state => ({
            chats: state.chats.map((c) => (c.id === targetId ? { ...c, title: targetChatTitle } : c))
          }));
        } catch (err) {
          console.error("Failed to update chat title in DB:", err);
        }
      }
      
      // Opt UI: add user msg immediately
      set(state => ({
        chats: state.chats.map(c => c.id === targetId ? {
          ...c,
          messages: [...(c.messages || []).filter(m => m.id !== userMsg.id), userMsg]
        } : c)
      }));
    }

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
    } catch (err) {
      set({ error: "Failed to save message." });
      return;
    }

    const assistantId = uid();
    const assistantMsgTimestamp = new Date().toISOString();
    set(state => ({
      chats: state.chats.map((c) =>
        c.id === targetId ? {
          ...c,
          messages: [
            ...(c.messages || []),
            {
              id: assistantId,
              role: "assistant" as const,
              content: "",
              timestamp: assistantMsgTimestamp,
              streaming: true,
            },
          ],
        } : c
      ),
      isStreaming: true
    }));

    const currentChatState = get().chats.find((c) => c.id === targetId);
    const priorMsgs = (currentChatState?.messages ?? [])
      .filter((m) => m.id !== assistantId && m.content)
      .map((m) => ({ role: m.role, content: m.content }));
    
    const hasUserMsg = priorMsgs.some((m) => m.content === userMsg.content && m.role === "user");
    const historySnapshot = hasUserMsg ? priorMsgs : [...priorMsgs, { role: userMsg.role, content: userMsg.content }];

    let accumulatedText = "";

    try {
      await streamNecookieAI(
        historySnapshot,
        (delta) => {
          accumulatedText += delta;
          set(state => ({
            chats: state.chats.map((c) =>
              c.id === targetId ? {
                ...c,
                messages: (c.messages || []).map((m) =>
                  m.id === assistantId ? { ...m, content: accumulatedText } : m
                ),
              } : c
            )
          }));
        },
        abort.signal
      );

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
        if (accumulatedText.trim()) {
          fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: assistantId,
              chatId: targetId,
              role: "assistant",
              content: accumulatedText,
              timestamp: assistantMsgTimestamp,
            }),
          }).catch(console.error);
        }
      } else {
        const message = err instanceof Error ? err.message : "Unknown error from AI.";
        set(state => ({
          error: message,
          chats: state.chats.map((c) =>
            c.id === targetId ? {
              ...c,
              messages: (c.messages || []).filter((m) => m.id !== assistantId),
            } : c
          )
        }));
      }
    } finally {
      set(state => ({
        isStreaming: false,
        chats: state.chats.map((c) =>
          c.id === targetId ? {
            ...c,
            messages: (c.messages || []).map((m) =>
              m.id === assistantId ? { ...m, streaming: false } : m
            ),
          } : c
        )
      }));
    }
  },

  regenerateMessage: async (messageId: string) => {
    const { isStreaming, activeId, chats } = get();
    if (isStreaming || !activeId) return;

    const chat = chats.find(c => c.id === activeId);
    if (!chat || !chat.messages) return;

    const targetIdx = chat.messages.findIndex(m => m.id === messageId);
    if (targetIdx === -1) return;

    const targetMsg = chat.messages[targetIdx];
    if (targetMsg.role !== "assistant") return; // Only regenerate AI responses

    set({ error: null });

    const prevAbort = get().abortController;
    prevAbort?.abort();
    const abort = new AbortController();
    set({ abortController: abort });

    // Truncate messages in DB
    try {
      await fetch("/api/messages/truncate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: activeId,
          timestamp: targetMsg.timestamp
        })
      });
    } catch (err) {
      set({ error: "Failed to truncate chat history." });
      return;
    }

    const historySnapshot = chat.messages
      .slice(0, targetIdx)
      .map(m => ({ role: m.role, content: m.content }));

    const assistantId = uid();
    const assistantMsgTimestamp = new Date().toISOString();

    set(state => ({
      chats: state.chats.map(c => c.id === activeId ? {
        ...c,
        messages: [
          ...c.messages!.slice(0, targetIdx),
          {
            id: assistantId,
            role: "assistant" as const,
            content: "",
            timestamp: assistantMsgTimestamp,
            streaming: true
          }
        ]
      } : c),
      isStreaming: true
    }));

    let accumulatedText = "";

    try {
      await streamNecookieAI(
        historySnapshot,
        (delta) => {
          accumulatedText += delta;
          set(state => ({
            chats: state.chats.map((c) =>
              c.id === activeId ? {
                ...c,
                messages: (c.messages || []).map((m) =>
                  m.id === assistantId ? { ...m, content: accumulatedText } : m
                ),
              } : c
            )
          }));
        },
        abort.signal
      );

      if (accumulatedText.trim()) {
        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: assistantId,
            chatId: activeId,
            role: "assistant",
            content: accumulatedText,
            timestamp: assistantMsgTimestamp,
          }),
        });
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        if (accumulatedText.trim()) {
          fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: assistantId,
              chatId: activeId,
              role: "assistant",
              content: accumulatedText,
              timestamp: assistantMsgTimestamp,
            }),
          }).catch(console.error);
        }
      } else {
        const message = err instanceof Error ? err.message : "Unknown error from AI.";
        set(state => ({
          error: message,
          chats: state.chats.map((c) =>
            c.id === activeId ? {
              ...c,
              messages: (c.messages || []).filter((m) => m.id !== assistantId),
            } : c
          )
        }));
      }
    } finally {
      set(state => ({
        isStreaming: false,
        chats: state.chats.map((c) =>
          c.id === activeId ? {
            ...c,
            messages: (c.messages || []).map((m) =>
              m.id === assistantId ? { ...m, streaming: false } : m
            ),
          } : c
        )
      }));
    }
  },

  editAndResend: async (messageId: string, newContent: string) => {
    const { isStreaming, activeId, chats } = get();
    if (isStreaming || !activeId) return;

    const chat = chats.find(c => c.id === activeId);
    if (!chat || !chat.messages) return;

    const targetIdx = chat.messages.findIndex(m => m.id === messageId);
    if (targetIdx === -1) return;

    const targetMsg = chat.messages[targetIdx];
    if (targetMsg.role !== "user") return; // Only edit user messages

    set({ error: null });

    const prevAbort = get().abortController;
    prevAbort?.abort();
    const abort = new AbortController();
    set({ abortController: abort });

    // Truncate messages in DB (deleting the old user message and all subsequent messages)
    try {
      await fetch("/api/messages/truncate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: activeId,
          timestamp: targetMsg.timestamp
        })
      });
    } catch (err) {
      set({ error: "Failed to truncate chat history." });
      return;
    }

    // Truncate local state to just before the edited message
    set(state => ({
      chats: state.chats.map(c => c.id === activeId ? {
        ...c,
        messages: c.messages!.slice(0, targetIdx)
      } : c)
    }));

    // Re-send the message as a fresh prompt
    await get().sendMessage(newContent);
  },
}));

/* ─── Provider Component ─── */
// We keep AppProvider to handle initial data fetching on mount.
// We export useApp which returns a proxy to useAppStore so existing code doesn't break entirely, 
// though refactoring components to use `useAppStore` directly is ideal for performance.
export function AppProvider({ children }: { children: React.ReactNode }) {
  const fetchInitialData = useAppStore(s => s._fetchInitialData);
  const theme = useAppStore(s => s.theme);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    applyThemeClass(theme);
    
    // Add listener for system theme changes if in system mode
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyThemeClass("system");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  return <>{children}</>;
}

// Backward compatibility hook:
export function useApp() {
  const store = useAppStore();
  return {
    ...store,
    activeChat: store.activeChat()
  };
}
