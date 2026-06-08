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

import React from "react";
import {
  X,
  BookOpen,
  Keyboard,
  Headphones,
  RocketIcon,
  Code2,
  BadgeCheck,
  BugPlay,
  MessageSquareText,
} from "lucide-react";
import { useAppStore } from "../lib/context";
import { getTranslations } from "../lib/i18n";

// ─── Shared sub-components ──────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-slate-200 mb-5">
      <span className="text-blue-500 flex-shrink-0">{icon}</span>
      {title}
    </h2>
  );
}

function DocCard({
  icon,
  title,
  description,
  href = "#",
  id,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  id: string;
}) {
  return (
    <a
      id={id}
      href={href}
      className="block p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-sm transition-all group"
      onClick={(e) => e.preventDefault()}
    >
      <span className="text-slate-400 dark:text-slate-400 group-hover:text-blue-500 mb-3 block transition-colors">
        {icon}
      </span>
      <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-950 dark:text-slate-400 leading-relaxed">{description}</p>
    </a>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-950 dark:text-slate-300 px-2 py-0.5 rounded min-w-[24px] text-center inline-block">
      {children}
    </kbd>
  );
}

function ShortcutRow({ label, keys }: { label: string; keys: string[] }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
      <span className="text-sm text-slate-950 dark:text-slate-400">{label}</span>
      <div className="flex items-center gap-1">
        {keys.map((k, i) => (
          <Kbd key={i}>{k}</Kbd>
        ))}
      </div>
    </div>
  );
}

// ─── Main HelpPanel ─────────────────────────────────────────────────────────

export default function HelpPanel() {
  const setShowHelp = useAppStore(s => s.setShowHelp);
  const language = useAppStore(s => s.language);
  const t = getTranslations(language).help;

  return (
    /* Backdrop */
    <div
      id="help-backdrop"
      className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowHelp(false);
      }}
    >
      {/* Panel */}
      <div
        id="help-panel"
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-950 rounded-xl shadow-2xl shadow-slate-300/40 dark:shadow-slate-950/40 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        style={{ animation: "helpFadeIn 0.18s ease-out" }}
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
            id="help-close-btn"
            onClick={() => setShowHelp(false)}
            className="flex items-center justify-center w-8 h-8 rounded-[6px] text-slate-400 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-4 flex-shrink-0"
            aria-label="Close help"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">

          {/* ── Documentation ── */}
          <section className="pl-4 border-l-2 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-300">
            <SectionHeader icon={<BookOpen size={16} />} title={t.documentation} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <DocCard
                id="help-doc-getting-started"
                icon={<RocketIcon size={20} />}
                title={t.gettingStarted}
                description={t.gettingStartedDesc}
              />
              <DocCard
                id="help-doc-api-reference"
                icon={<Code2 size={20} />}
                title={t.apiReference}
                description={t.apiReferenceDesc}
              />
              <DocCard
                id="help-doc-best-practices"
                icon={<BadgeCheck size={20} />}
                title={t.bestPractices}
                description={t.bestPracticesDesc}
              />
            </div>
          </section>

          {/* ── Keyboard Shortcuts ── */}
          <section className="pl-4 border-l-2 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-300">
            <SectionHeader icon={<Keyboard size={16} />} title={t.keyboardShortcuts} />
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
                <div className="p-4">
                  <ShortcutRow label={t.shortcutNewChat} keys={["⌘", "N"]} />
                  <ShortcutRow label={t.shortcutSearchChats} keys={["⌘", "K"]} />
                  <ShortcutRow label={t.shortcutFocusInput} keys={["/"]} />
                </div>
                <div className="p-4">
                  <ShortcutRow label={t.shortcutToggleSidebar} keys={["⌘", "\\"]} />
                  <ShortcutRow label={t.shortcutSettings} keys={["⌘", ","]} />
                  <ShortcutRow label={t.shortcutClearConversation} keys={["⌘", "⇧", "⌫"]} />
                </div>
              </div>
            </div>
          </section>

          {/* ── Support ── */}
          <section className="pl-4 border-l-2 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-300">
            <SectionHeader icon={<Headphones size={16} />} title={t.support} />
            <div className="flex flex-wrap gap-3">
              <button
                id="help-report-issue-btn"
                className="flex items-center gap-2 bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-100 px-5 py-2.5 rounded-[6px] text-sm font-semibold hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
              >
                <BugPlay size={16} />
                {t.reportIssue}
              </button>
              <button
                id="help-community-btn"
                className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-950 dark:text-slate-300 px-5 py-2.5 rounded-[6px] text-sm font-semibold hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
              >
                <MessageSquareText size={16} />
                {t.joinCommunity}
              </button>
            </div>
          </section>
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-shrink-0">
          <button
            id="help-close-footer-btn"
            onClick={() => setShowHelp(false)}
            className="px-4 py-2 text-sm text-slate-950 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[6px] font-medium transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes helpFadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
