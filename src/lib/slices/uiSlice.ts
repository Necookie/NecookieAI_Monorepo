import type { StateCreator } from "zustand";
import type { ThemeMode } from "../store";
import type { AppStore } from "../context";

export interface UISlice {
  theme: ThemeMode;
  sidebarOpen: boolean;
  showSettings: boolean;
  showHelp: boolean;
  currentView: "chat" | "folders";

  setTheme: (t: ThemeMode) => void;
  setSidebarOpen: (v: boolean) => void;
  setShowSettings: (v: boolean) => void;
  setShowHelp: (v: boolean) => void;
  setCurrentView: (view: "chat" | "folders") => void;
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
});
