import type { StateCreator } from "zustand";
import type { Model } from "../store";
import { AVAILABLE_MODELS } from "../store";
import type { Locale } from "../i18n";
import type { AppStore } from "../context";

export interface SettingsSlice {
  model: Model;
  language: Locale;

  setLanguage: (l: Locale) => void;
  setModel: (m: Model) => void;
}

export const createSettingsSlice: StateCreator<AppStore, [], [], SettingsSlice> = (set) => ({
  model: AVAILABLE_MODELS[0],
  language: "en",

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
});
