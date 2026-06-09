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

import type { UISlice } from "./slices/uiSlice";
import type { SettingsSlice } from "./slices/settingsSlice";
import type { ChatSlice } from "./slices/chatSlice";
import type { MessageSlice } from "./slices/messageSlice";

import { createUISlice, applyThemeClass } from "./slices/uiSlice";
import { createSettingsSlice } from "./slices/settingsSlice";
import { createChatSlice } from "./slices/chatSlice";
import { createMessageSlice } from "./slices/messageSlice";

export type AppStore = UISlice & SettingsSlice & ChatSlice & MessageSlice;

export const useAppStore = create<AppStore>((set, get, api) => ({
  ...createUISlice(set, get, api),
  ...createSettingsSlice(set, get, api),
  ...createChatSlice(set, get, api),
  ...createMessageSlice(set, get, api),
}));

/* ─── Provider Component ─── */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const fetchInitialData = useAppStore((s) => s._fetchInitialData);
  const theme = useAppStore((s) => s.theme);

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
