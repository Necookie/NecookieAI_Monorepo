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

import React, { useState } from "react";
import { X, Sliders, Palette, Lock, ChevronDown, CheckCircle2, Eye, EyeOff, LogOut } from "lucide-react";
import { useAppStore } from "../lib/context";
import { getTranslations } from "../lib/i18n";
import type { Locale } from "../lib/i18n";
import { useClerk } from "@clerk/clerk-react";

import type { ThemeMode } from "../lib/store";

// ─── Language options ────────────────────────────────────────────────────────

const LANGUAGE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "English (US)" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ja", label: "日本語" },
];

import { Section } from "./ui/Section";
import { SettingRow } from "./ui/SettingRow";
import { Toggle } from "./ui/Toggle";
import { SelectField } from "./ui/SelectField";

// ─── Main SettingsPanel ─────────────────────────────────────────────────────

export default function SettingsPanel() {
  const setShowSettings = useAppStore(s => s.setShowSettings);
  const language = useAppStore(s => s.language);
  const setLanguage = useAppStore(s => s.setLanguage);
  const theme = useAppStore(s => s.theme);
  const setTheme = useAppStore(s => s.setTheme);
  const t = getTranslations(language).settings;
  const { signOut } = useClerk();

  // General — local state, applied on Save
  const [defaultModel, setDefaultModel] = useState("pro");
  const [pendingLanguage, setPendingLanguage] = useState<Locale>(language);

  // Appearance
  const [compactMode, setCompactMode] = useState(false);

  // Security
  const [apiKey, setApiKey] = useState("sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<"active" | "idle">("active");

  function handleSave() {
    setLanguage(pendingLanguage); // ← apply language change globally
    setShowSettings(false);
  }

  function handleCancel() {
    setPendingLanguage(language); // reset pending selection
    setShowSettings(false);
  }

  return (
    /* Backdrop */
    <div
      id="settings-backdrop"
      className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
    >
      {/* Panel */}
      <div
        id="settings-panel"
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-950 rounded-xl shadow-2xl shadow-slate-300/40 dark:shadow-slate-950/40 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        style={{ animation: "settingsFadeIn 0.18s ease-out" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-950 dark:text-slate-200 tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs text-slate-950 dark:text-slate-400 mt-0.5">{t.subtitle}</p>
          </div>
          <button
            id="settings-close-btn"
            onClick={handleCancel}
            className="flex items-center justify-center w-8 h-8 rounded-[6px] text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-4 flex-shrink-0"
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* ── General ── */}
          <Section icon={<Sliders size={15} />} title={t.general}>
            <SettingRow label={t.defaultModel} description={t.defaultModelDesc}>
              <SelectField
                id="settings-default-model"
                value={defaultModel}
                onChange={setDefaultModel}
                options={[
                  { value: "pro", label: "Necookie Pro (Recommended)" },
                  { value: "flash", label: "Necookie Flash (Fast)" },
                  { value: "legacy", label: "Necookie Legacy v1" },
                ]}
              />
            </SettingRow>

            <hr className="border-slate-200" />

            <SettingRow label={t.outputLanguage} description={t.outputLanguageDesc}>
              <SelectField
                id="settings-output-language"
                value={pendingLanguage}
                onChange={(v) => setPendingLanguage(v as Locale)}
                options={LANGUAGE_OPTIONS}
              />
            </SettingRow>
          </Section>

          {/* ── Appearance ── */}
          <Section icon={<Palette size={15} />} title={t.appearance}>
            <SettingRow label={t.interfaceTheme} description={t.interfaceThemeDesc}>
              <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[6px] p-0.5 gap-0.5">
                {(["light", "dark", "system"] as ThemeMode[]).map((mode) => {
                  const labels: Record<ThemeMode, string> = {
                    light: t.light,
                    dark: t.dark,
                    system: t.system,
                  };
                  return (
                    <button
                      key={mode}
                      id={`settings-theme-${mode}`}
                      onClick={() => setTheme(mode)}
                      className={[
                        "px-3 py-1.5 rounded-[4px] text-xs font-medium transition-colors",
                        theme === mode
                          ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50"
                          : "text-slate-950 hover:text-slate-950 hover:bg-slate-50 dark:hover:text-slate-300 dark:hover:bg-slate-700",
                      ].join(" ")}
                    >
                      {labels[mode]}
                    </button>
                  );
                })}
              </div>
            </SettingRow>

            <hr className="border-slate-200 dark:border-slate-700" />

            <SettingRow label={t.compactMode} description={t.compactModeDesc}>
              <Toggle
                id="settings-compact-mode"
                checked={compactMode}
                onChange={setCompactMode}
              />
            </SettingRow>
          </Section>

          {/* ── Security ── */}
          <Section icon={<Lock size={15} />} title={t.security}>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-950 dark:text-slate-300 mb-0.5 uppercase tracking-wide font-mono">
                  {t.apiKeyConfig}
                </p>
                <p className="text-sm text-slate-950 dark:text-slate-400 leading-snug">{t.apiKeyDesc}</p>
              </div>
              <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={14} className="text-slate-400" />
                  </span>
                  <input
                    id="settings-api-key-input"
                    type={apiKeyVisible ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setApiKeyStatus("idle");
                    }}
                    placeholder="sk-..."
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-950 dark:text-slate-200 font-mono text-sm rounded-[6px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 pr-10 py-2.5 transition-colors"
                  />
                  <button
                    id="settings-api-key-visibility"
                    type="button"
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-950"
                    aria-label={apiKeyVisible ? "Hide API key" : "Show API key"}
                  >
                    {apiKeyVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button
                  id="settings-api-key-update"
                  onClick={() => setApiKeyStatus("active")}
                  className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 rounded-[6px] text-xs font-semibold transition-colors flex-shrink-0"
                >
                  {t.update}
                </button>
              </div>

              {apiKeyStatus === "active" && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />
                  <span className="text-xs text-blue-600 font-medium">{t.keyActive}</span>
                </div>
              )}
            </div>
          </Section>

          {/* ── Account ── */}
          <Section icon={<LogOut size={15} />} title="Account">
            <SettingRow
              label="Session Management"
              description="Disconnect from this workspace. You will need to authenticate again to access your chats and settings."
            >
              <button
                id="settings-logout-btn"
                onClick={() => {
                  signOut();
                  setShowSettings(false);
                }}
                className="px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-900/70 rounded-[6px] text-xs font-semibold font-mono tracking-wider uppercase transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </SettingRow>
          </Section>
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end px-6 py-4 border-t border-slate-200 dark:border-slate-800 gap-2 flex-shrink-0 bg-white dark:bg-slate-950">
          <button
            id="settings-cancel-btn"
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-slate-950 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[6px] font-medium transition-colors"
          >
            {t.cancel}
          </button>
          <button
            id="settings-save-btn"
            onClick={handleSave}
            className="px-5 py-2 bg-slate-800 dark:bg-blue-600 text-white hover:bg-slate-700 dark:hover:bg-blue-500 rounded-[6px] text-sm font-semibold transition-colors shadow-sm"
          >
            {t.saveChanges}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes settingsFadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
