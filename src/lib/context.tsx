import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { Chat, Message, Model } from "./store";
import { uid, deriveTitle, AVAILABLE_MODELS } from "./store";

/* ─── Context shape ─── */
interface AppCtx {
  chats: Chat[];
  activeId: string | null;
  activeChat: Chat | null;
  model: Model;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  setModel: (m: Model) => void;
  newChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  isStreaming: boolean;
}

const Ctx = createContext<AppCtx | null>(null);

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

/* ─── Mock streaming helper ─── */
async function mockStream(
  prompt: string,
  onChunk: (chunk: string) => void,
  signal: AbortSignal
): Promise<void> {
  const responses = [
    `Sure! Here's my response to **"${prompt.slice(0, 40)}..."**\n\nI can help you with that. Let me break it down:\n\n- **Point 1** — This is a key consideration\n- **Point 2** — Another important factor\n- **Point 3** — Finally, keep this in mind\n\nHere's a quick example:\n\n\`\`\`typescript\nfunction example(input: string): string {\n  return input.trim().toLowerCase();\n}\n\`\`\`\n\nLet me know if you'd like me to expand on any of these points!`,
    `Great question! Here's what I think about **"${prompt.slice(0, 30)}..."**:\n\n> The key insight here is that every problem has multiple valid approaches.\n\nLet me walk you through my thinking step by step.\n\n1. First, we need to understand the context\n2. Then we can explore the options\n3. Finally, we pick the best fit\n\nWould you like more details on any specific aspect?`,
  ];
  const text = responses[Math.floor(Math.random() * responses.length)];
  const words = text.split(" ");

  for (const word of words) {
    if (signal.aborted) return;
    await new Promise((r) => setTimeout(r, 18 + Math.random() * 40));
    onChunk(word + " ");
  }
}

/* ─── Provider ─── */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "demo-1",
      title: "Current Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "demo-2",
      title: "Design System Specs",
      messages: [],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "demo-3",
      title: "API Integration Plan",
      messages: [],
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "demo-4",
      title: "User Research Notes",
      messages: [],
      createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
  ]);
  const [activeId, setActiveId] = useState<string | null>("demo-1");
  const [model, setModel] = useState<Model>(AVAILABLE_MODELS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const activeChat = chats.find((c) => c.id === activeId) ?? null;

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
      if (activeId === id) {
        setActiveId(null);
      }
    },
    [activeId]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      // Abort previous stream
      abortRef.current?.abort();
      const abort = new AbortController();
      abortRef.current = abort;

      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      let targetId = activeId;

      setChats((prev) => {
        const updated = prev.map((c) => {
          if (c.id === targetId) {
            const isFirstMsg = c.messages.length === 0;
            return {
              ...c,
              title: isFirstMsg ? deriveTitle(content) : c.title,
              messages: [...c.messages, userMsg],
            };
          }
          return c;
        });
        // If no active chat, create one
        if (!targetId) {
          const newId = uid();
          targetId = newId;
          const newC: Chat = {
            id: newId,
            title: deriveTitle(content),
            messages: [userMsg],
            createdAt: new Date().toISOString(),
          };
          return [newC, ...updated];
        }
        return updated;
      });

      if (!activeId && targetId) setActiveId(targetId);

      // Placeholder assistant message
      const assistantId = uid();
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        streaming: true,
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? { ...c, messages: [...c.messages, assistantMsg] }
            : c
        )
      );

      setIsStreaming(true);

      try {
        await mockStream(
          content,
          (chunk) => {
            setChats((prev) =>
              prev.map((c) =>
                c.id === targetId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantId
                          ? { ...m, content: m.content + chunk }
                          : m
                      ),
                    }
                  : c
              )
            );
          },
          abort.signal
        );
      } finally {
        // Mark stream done
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
        setModel,
        newChat,
        selectChat,
        deleteChat,
        sendMessage,
        isStreaming,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
