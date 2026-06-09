import type { StateCreator } from "zustand";
import type { Chat } from "../store";
import type { AppStore } from "../context";

export interface ChatSlice {
  chats: Chat[];
  activeId: string | null;

  activeChat: () => Chat | null;
  newChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  updateChatFolder: (chatId: string, folder: string | null) => Promise<void>;
  togglePinChat: (chatId: string) => Promise<void>;
}

export const createChatSlice: StateCreator<AppStore, [], [], ChatSlice> = (set, get) => ({
  chats: [],
  activeId: null,

  activeChat: () => {
    const { chats, activeId } = get();
    return chats.find((c) => c.id === activeId) ?? null;
  },

  newChat: () => {
    set({ activeId: null, currentView: "chat" });
  },

  selectChat: async (id) => {
    set({ activeId: id, currentView: "chat" });
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

  updateChatFolder: async (chatId, folder) => {
    // Optimistic UI update
    set((state) => ({
      chats: state.chats.map((c) => (c.id === chatId ? { ...c, folder } : c)),
    }));

    try {
      await fetch("/api/chats/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: chatId, folder }),
      });
    } catch (err) {
      console.error("Failed to update folder", err);
    }
  },

  togglePinChat: async (chatId) => {
    const chat = get().chats.find(c => c.id === chatId);
    if (!chat) return;
    const newPinned = !chat.pinned;
    
    set((state) => ({
      chats: state.chats.map((c) => (c.id === chatId ? { ...c, pinned: newPinned } : c)),
    }));

    try {
      await fetch("/api/chats/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: chatId, pinned: newPinned }),
      });
    } catch (err) {
      console.error("Failed to update pin status", err);
    }
  },
});
