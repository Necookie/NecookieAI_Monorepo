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
import { X, Sliders, Palette, Lock, CheckCircle2, Eye, EyeOff, LogOut } from "lucide-react";
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

  const [defaultModel, setDefaultModel] = useState("pro");
  const [pendingLanguage, setPendingLanguage] = useState<Locale>(language);

  const globalCompactMode = useAppStore(s => s.compactMode);
  const setGlobalCompactMode = useAppStore(s => s.setCompactMode);
  const [compactMode, setCompactMode] = useState(globalCompactMode);

  const [apiKey, setApiKey] = useState("sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<"active" | "idle">("active");

  function handleSave() {
    setLanguage(pendingLanguage);
    setGlobalCompactMode(compactMode);
    setShowSettings(false);
  }

  function handleCancel() {
    setPendingLanguage(language);
    setCompactMode(globalCompactMode);
    setShowSettings(false);
  }

  const themeLabels: Record<ThemeMode, string> = {
    light: t.light,
    dark: t.dark,
    system: t.system,
  };

  return (
    /* Backdrop */
    <div
      id="settings-backdrop"
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{
        background: "rgba(20,20,19,0.25)",
        backdropFilter: "blur(3px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleCancel(); }}
    >
      {/* Panel */}
      <div
        id="settings-panel"
        className="relative w-full max-w-2xl flex flex-col overflow-hidden"
        style={{
          maxHeight: "90vh",
          background: "var(--color-canvas)",
          border: "1px solid var(--color-hairline)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 8px 32px rgba(20,20,19,0.12)",
          animation: "settingsFadeIn 0.18s ease-out",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--color-hairline)" }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: 400,
                letterSpacing: "-0.2px",
                color: "var(--color-ink)",
              }}
            >
              {t.title}
            </h2>
            <p
              className="mt-0.5"
              style={{ fontSize: "13px", color: "var(--color-muted)", fontFamily: "var(--font-sans)" }}
            >
              {t.subtitle}
            </p>
          </div>
          <button
            id="settings-close-btn"
            onClick={handleCancel}
            className="flex items-center justify-center w-8 h-8 ml-4 flex-shrink-0 transition-colors"
            style={{
              borderRadius: "var(--radius-sm)",
              color: "var(--color-muted-soft)",
            }}
            aria-label="Close settings"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface-card)"; (e.currentTarget as HTMLElement).style.color = "var(--color-ink)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--color-muted-soft)"; }}
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

            <hr style={{ border: "none", borderTop: "1px solid var(--color-hairline)" }} />

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
              <div
                className="flex p-0.5 gap-0.5"
                style={{
                  background: "var(--color-surface-card)",
                  border: "1px solid var(--color-hairline)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {(["light", "dark", "system"] as ThemeMode[]).map((mode) => (
                  <button
                    key={mode}
                    id={`settings-theme-${mode}`}
                    onClick={() => setTheme(mode)}
                    className="px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      borderRadius: "var(--radius-xs)",
                      background: theme === mode ? "var(--color-canvas)" : "transparent",
                      color: theme === mode ? "var(--color-ink)" : "var(--color-muted)",
                      border: theme === mode ? "1px solid var(--color-hairline)" : "1px solid transparent",
                      fontFamily: "var(--font-sans)",
                      fontWeight: theme === mode ? 500 : 400,
                    }}
                  >
                    {themeLabels[mode]}
                  </button>
                ))}
              </div>
            </SettingRow>

            <hr style={{ border: "none", borderTop: "1px solid var(--color-hairline)" }} />

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
                <p
                  className="mb-0.5"
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "var(--color-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {t.apiKeyConfig}
                </p>
                <p
                  className="leading-snug"
                  style={{ fontSize: "14px", color: "var(--color-muted)", fontFamily: "var(--font-sans)" }}
                >
                  {t.apiKeyDesc}
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={14} style={{ color: "var(--color-muted-soft)" }} />
                  </span>
                  <input
                    id="settings-api-key-input"
                    type={apiKeyVisible ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => { setApiKey(e.target.value); setApiKeyStatus("idle"); }}
                    placeholder="sk-..."
                    className="block w-full pl-9 pr-10 py-2.5 transition-colors outline-none"
                    style={{
                      background: "var(--color-canvas)",
                      border: "1px solid var(--color-hairline)",
                      color: "var(--color-ink)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "14px",
                      borderRadius: "var(--radius-sm)",
                    }}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)"}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--color-hairline)"}
                  />
                  <button
                    id="settings-api-key-visibility"
                    type="button"
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    style={{ color: "var(--color-muted-soft)" }}
                    aria-label={apiKeyVisible ? "Hide API key" : "Show API key"}
                  >
                    {apiKeyVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button
                  id="settings-api-key-update"
                  onClick={() => setApiKeyStatus("active")}
                  className="px-4 py-2 flex-shrink-0 transition-colors"
                  style={{
                    background: "var(--color-ink)",
                    color: "var(--color-on-dark)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "var(--font-sans)",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-body-strong)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--color-ink)"}
                >
                  {t.update}
                </button>
              </div>

              {apiKeyStatus === "active" && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--color-success)",
                      fontWeight: 500,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {t.keyActive}
                  </span>
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
                onClick={() => { signOut(); setShowSettings(false); }}
                className="px-4 py-2 transition-colors cursor-pointer"
                style={{
                  border: "1px solid rgba(198,69,69,0.30)",
                  color: "var(--color-error)",
                  background: "transparent",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(198,69,69,0.06)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                Log Out
              </button>
            </SettingRow>
          </Section>
        </div>

        {/* ── Footer ── */}
        <div
          className="flex justify-end px-6 py-4 gap-2 flex-shrink-0"
          style={{
            borderTop: "1px solid var(--color-hairline)",
            background: "var(--color-canvas)",
          }}
        >
          <button
            id="settings-cancel-btn"
            onClick={handleCancel}
            className="px-4 py-2 transition-colors"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--color-muted)",
              background: "transparent",
              border: "1px solid var(--color-hairline)",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-sans)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--color-surface-card)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-body)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
            }}
          >
            {t.cancel}
          </button>
          <button
            id="settings-save-btn"
            onClick={handleSave}
            className="px-5 py-2 transition-colors"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              borderRadius: "var(--radius-md)",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "var(--font-sans)",
              boxShadow: "0 1px 3px rgba(204,120,92,0.25)",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-primary-active)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--color-primary)"}
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
