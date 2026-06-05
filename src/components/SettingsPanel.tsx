import React, { useState } from "react";
import { X, Sliders, Palette, Lock, ChevronDown, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useApp } from "../lib/context";

// ─── Types ──────────────────────────────────────────────────────────────────

type ThemeMode = "light" | "dark" | "system";

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center gap-2">
        <span className="text-slate-400 flex-shrink-0">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="p-5 space-y-5">{children}</div>
    </section>
  );
}

// ─── Row wrapper ────────────────────────────────────────────────────────────

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-700 mb-0.5 uppercase tracking-wide font-mono">
          {label}
        </p>
        {description && (
          <p className="text-sm text-slate-500 leading-snug">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

// ─── Toggle switch ──────────────────────────────────────────────────────────

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
        checked ? "bg-teal-500" : "bg-slate-200",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

// ─── SelectField ────────────────────────────────────────────────────────────

function SelectField({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative w-full sm:w-56">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 font-mono text-sm py-2 pl-3 pr-9 rounded-[6px] focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  );
}

// ─── Main SettingsPanel ─────────────────────────────────────────────────────

export default function SettingsPanel() {
  const { setShowSettings } = useApp();

  // General
  const [defaultModel, setDefaultModel] = useState("pro");
  const [outputLanguage, setOutputLanguage] = useState("en");

  // Appearance
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [compactMode, setCompactMode] = useState(false);

  // Security
  const [apiKey, setApiKey] = useState("sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<"active" | "idle">("active");

  function handleSave() {
    // TODO: persist settings
    setShowSettings(false);
  }

  return (
    /* Backdrop */
    <div
      id="settings-backdrop"
      className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowSettings(false);
      }}
    >
      {/* Panel */}
      <div
        id="settings-panel"
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl shadow-slate-300/40 border border-slate-200 flex flex-col overflow-hidden animate-in"
        style={{ animation: "settingsFadeIn 0.18s ease-out" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-800 tracking-tight">
              Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage model configuration, interface appearance, and security credentials.
            </p>
          </div>
          <button
            id="settings-close-btn"
            onClick={() => setShowSettings(false)}
            className="flex items-center justify-center w-8 h-8 rounded-[6px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-4 flex-shrink-0"
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* ── General ── */}
          <Section icon={<Sliders size={15} />} title="General">
            <SettingRow
              label="Default Model"
              description="Select the primary model for new conversations."
            >
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

            <SettingRow
              label="Output Language"
              description="Preferred language for AI responses."
            >
              <SelectField
                id="settings-output-language"
                value={outputLanguage}
                onChange={setOutputLanguage}
                options={[
                  { value: "en", label: "English (US)" },
                  { value: "es", label: "Español" },
                  { value: "fr", label: "Français" },
                  { value: "de", label: "Deutsch" },
                  { value: "ja", label: "日本語" },
                ]}
              />
            </SettingRow>
          </Section>

          {/* ── Appearance ── */}
          <Section icon={<Palette size={15} />} title="Appearance">
            <SettingRow
              label="Interface Theme"
              description="Customize the visual appearance of the app."
            >
              <div className="flex bg-white border border-slate-200 rounded-[6px] p-0.5 gap-0.5">
                {(["light", "dark", "system"] as ThemeMode[]).map((t) => (
                  <button
                    key={t}
                    id={`settings-theme-${t}`}
                    onClick={() => setTheme(t)}
                    className={[
                      "px-3 py-1.5 rounded-[4px] text-xs font-medium transition-colors capitalize",
                      theme === t
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </SettingRow>

            <hr className="border-slate-200" />

            <SettingRow
              label="Compact Mode"
              description="Reduce spacing in chat interface for higher information density."
            >
              <Toggle
                id="settings-compact-mode"
                checked={compactMode}
                onChange={setCompactMode}
              />
            </SettingRow>
          </Section>

          {/* ── Security ── */}
          <Section icon={<Lock size={15} />} title="Security">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-0.5 uppercase tracking-wide font-mono">
                  API Key Configuration
                </p>
                <p className="text-sm text-slate-500 leading-snug">
                  Provide your custom API key to unlock extended rate limits and enterprise features.
                </p>
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
                    className="bg-white border border-slate-200 text-slate-700 font-mono text-sm rounded-[6px] focus:ring-1 focus:ring-teal-500 focus:border-teal-500 block w-full pl-9 pr-10 py-2.5 transition-colors"
                  />
                  <button
                    id="settings-api-key-visibility"
                    type="button"
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    aria-label={apiKeyVisible ? "Hide API key" : "Show API key"}
                  >
                    {apiKeyVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button
                  id="settings-api-key-update"
                  onClick={() => setApiKeyStatus("active")}
                  className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-[6px] text-xs font-semibold transition-colors flex-shrink-0"
                >
                  Update
                </button>
              </div>

              {apiKeyStatus === "active" && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-teal-500 flex-shrink-0" />
                  <span className="text-xs text-teal-600 font-medium">
                    Key is active and validated
                  </span>
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end px-6 py-4 border-t border-slate-200 gap-2 flex-shrink-0 bg-white">
          <button
            id="settings-cancel-btn"
            onClick={() => setShowSettings(false)}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-[6px] font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            id="settings-save-btn"
            onClick={handleSave}
            className="px-5 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-[6px] text-sm font-semibold transition-colors shadow-sm"
          >
            Save Changes
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
