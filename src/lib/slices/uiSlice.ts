import type { StateCreator } from "zustand";
import type { ThemeMode } from "../store";
import type { AppStore } from "../context";

export interface UISlice {
  theme: ThemeMode;
  sidebarOpen: boolean;
  showSettings: boolean;
  showHelp: boolean;
  currentView: "chat" | "folders";
  compactMode: boolean;
  messageMarker: string;

  setTheme: (t: ThemeMode) => void;
  setSidebarOpen: (v: boolean) => void;
  setShowSettings: (v: boolean) => void;
  setShowHelp: (v: boolean) => void;
  setCurrentView: (view: "chat" | "folders") => void;
  setCompactMode: (v: boolean) => void;
  setMessageMarker: (color: string) => void;
}

export const getInitialTheme = (): ThemeMode => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("necookie-theme") as ThemeMode;
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  }
  return "light";
};

export const getInitialCompactMode = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("necookie-compact") === "true";
  }
  return false;
};

export const applyThemeClass = (theme: ThemeMode) => {
  if (typeof document === "undefined") return;
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const createUISlice: StateCreator<AppStore, [], [], UISlice> = (set) => ({
  theme: getInitialTheme(),
  sidebarOpen: true,
  showSettings: false,
  showHelp: false,
  currentView: "chat",
  compactMode: getInitialCompactMode(),
  messageMarker: (() => {
    if (typeof window === "undefined") return "#737373";
    const saved = localStorage.getItem("necookie-message-marker");
    return saved && /^#[0-9a-f]{6}$/i.test(saved) ? saved : "#737373";
  })(),

  setMessageMarker: (color) => {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
    set({ messageMarker: color });
    if (typeof window !== "undefined") {
      localStorage.setItem("necookie-message-marker", color);
    }
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
  setCurrentView: (view) => set({ currentView: view }),
  setCompactMode: (v) => {
    set({ compactMode: v });
    if (typeof window !== "undefined") {
      localStorage.setItem("necookie-compact", String(v));
    }
  },
});
