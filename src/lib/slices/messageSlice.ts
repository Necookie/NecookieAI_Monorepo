import type { StateCreator } from "zustand";
import type { Message, Chat } from "../store";
import { uid, deriveTitle } from "../store";
import type { AppStore } from "../context";

export interface MessageSlice {
  isStreaming: boolean;
  error: string | null;
  abortController: AbortController | null;

  clearError: () => void;
  sendMessage: (content: string) => Promise<void>;
  regenerateMessage: (messageId: string) => Promise<void>;
  editAndResend: (messageId: string, newContent: string) => Promise<void>;
  _fetchInitialData: () => Promise<void>;
  _fetchMessages: (chatId: string) => Promise<void>;
}

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

export const createMessageSlice: StateCreator<AppStore, [], [], MessageSlice> = (set, get) => ({
  isStreaming: false,
  error: null,
  abortController: null,

  clearError: () => set({ error: null }),

  _fetchInitialData: async () => {
    try {
      const [chatsRes, settingsRes] = await Promise.all([
        fetch("/api/chats"),
        fetch("/api/settings")
      ]);

      if (chatsRes.ok) {
        const data = await chatsRes.json();
        if (Array.isArray(data)) {
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
        if (data.language) set({ language: data.language });
        if (data.model) {
          const found = get().model; // We can't access AVAILABLE_MODELS easily without importing, so just let settingsSlice do it or import it.
          // We will update settings in context.tsx or import it here
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
        const chatRes = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: newId, title: targetChatTitle, createdAt: newC.createdAt }),
        });
        if (!chatRes.ok) throw new Error("Failed to create chat in DB");
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
      
      set(state => ({
        chats: state.chats.map(c => c.id === targetId ? {
          ...c,
          messages: [...(c.messages || []).filter(m => m.id !== userMsg.id), userMsg]
        } : c)
      }));
    }

    try {
      const msgRes = await fetch("/api/messages", {
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
      if (!msgRes.ok) throw new Error("Failed to save message to DB");
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
});
