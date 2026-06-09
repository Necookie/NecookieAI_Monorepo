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

import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { de } from "./locales/de";
import { ja } from "./locales/ja";

// ─── Supported locale codes ─────────────────────────────────────────────────
export type Locale = "en" | "es" | "fr" | "de" | "ja";

// ─── Translation shape ───────────────────────────────────────────────────────
export interface Translations {
  // Sidebar
  sidebar: {
    history: string;
    lastSevenDays: string;
    newChat: string;
    searchChat: string;
    recent: string;
    settings: string;
    help: string;
  };
  // Header
  header: {
    model: string;
    selectModel: string;
  };
  // Welcome screen
  welcome: {
    greeting: string;
  };
  // Chat input
  chat: {
    placeholder: string;
  };
  // Settings panel
  settings: {
    title: string;
    subtitle: string;
    // General section
    general: string;
    defaultModel: string;
    defaultModelDesc: string;
    outputLanguage: string;
    outputLanguageDesc: string;
    // Appearance section
    appearance: string;
    interfaceTheme: string;
    interfaceThemeDesc: string;
    light: string;
    dark: string;
    system: string;
    compactMode: string;
    compactModeDesc: string;
    // Security section
    security: string;
    apiKeyConfig: string;
    apiKeyDesc: string;
    update: string;
    keyActive: string;
    // Footer
    saveChanges: string;
    cancel: string;
  };
  // Help panel
  help: {
    title: string;
    subtitle: string;
    // Documentation
    documentation: string;
    gettingStarted: string;
    gettingStartedDesc: string;
    apiReference: string;
    apiReferenceDesc: string;
    bestPractices: string;
    bestPracticesDesc: string;
    // Keyboard shortcuts
    keyboardShortcuts: string;
    shortcutNewChat: string;
    shortcutSearchChats: string;
    shortcutFocusInput: string;
    shortcutToggleSidebar: string;
    shortcutSettings: string;
    shortcutClearConversation: string;
    // Support
    support: string;
    reportIssue: string;
    joinCommunity: string;
    close: string;
  };
}

// ─── Translations map ────────────────────────────────────────────────────────
const translations: Record<Locale, Translations> = {
  en,
  es,
  fr,
  de,
  ja,
};

// ─── Hook helper ─────────────────────────────────────────────────────────────
export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.en;
}

export default translations;
