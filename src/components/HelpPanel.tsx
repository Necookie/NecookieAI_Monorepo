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

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2
      className="flex items-center gap-2 mb-5"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "18px",
        fontWeight: 400,
        letterSpacing: "-0.2px",
        color: "var(--color-ink)",
      }}
    >
      <span style={{ color: "var(--color-primary)", flexShrink: 0 }}>{icon}</span>
      {title}
    </h2>
  );
}

function DocCard({
  icon, title, description, href = "#", id,
}: {
  icon: React.ReactNode; title: string; description: string; href?: string; id: string;
}) {
  return (
    <a
      id={id}
      href={href}
      className="block p-5 transition-all group"
      style={{
        background: "var(--color-canvas)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-lg)",
        textDecoration: "none",
      }}
      onClick={(e) => e.preventDefault()}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(204,120,92,0.10)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-hairline)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <span
        className="mb-3 block transition-colors"
        style={{ color: "var(--color-muted-soft)" }}
      >
        {icon}
      </span>
      <h3
        className="mb-1"
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "var(--color-ink)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {title}
      </h3>
      <p
        className="leading-relaxed"
        style={{
          fontSize: "13px",
          color: "var(--color-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {description}
      </p>
    </a>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="inline-block min-w-[24px] text-center px-2 py-0.5"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        background: "var(--color-surface-card)",
        border: "1px solid var(--color-hairline)",
        color: "var(--color-body-strong)",
        borderRadius: "var(--radius-xs)",
      }}
    >
      {children}
    </kbd>
  );
}

function ShortcutRow({ label, keys }: { label: string; keys: string[] }) {
  return (
    <div
      className="flex items-center justify-between py-2"
      style={{ borderBottom: "1px solid var(--color-hairline-soft)" }}
    >
      <span
        style={{
          fontSize: "14px",
          color: "var(--color-body)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {label}
      </span>
      <div className="flex items-center gap-1">
        {keys.map((k, i) => <Kbd key={i}>{k}</Kbd>)}
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
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{
        background: "rgba(20,20,19,0.25)",
        backdropFilter: "blur(3px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setShowHelp(false); }}
    >
      {/* Panel */}
      <div
        id="help-panel"
        className="relative w-full max-w-2xl flex flex-col overflow-hidden"
        style={{
          maxHeight: "90vh",
          background: "var(--color-canvas)",
          border: "1px solid var(--color-hairline)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 8px 32px rgba(20,20,19,0.12)",
          animation: "helpFadeIn 0.18s ease-out",
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
            id="help-close-btn"
            onClick={() => setShowHelp(false)}
            className="flex items-center justify-center w-8 h-8 ml-4 flex-shrink-0 transition-colors"
            style={{
              borderRadius: "var(--radius-sm)",
              color: "var(--color-muted-soft)",
            }}
            aria-label="Close help"
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--color-surface-card)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-ink)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-muted-soft)";
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">

          {/* ── Documentation ── */}
          <section
            className="pl-4 transition-colors duration-300"
            style={{ borderLeft: "2px solid var(--color-hairline)" }}
          >
            <SectionHeader icon={<BookOpen size={16} />} title={t.documentation} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <DocCard id="help-doc-getting-started" icon={<RocketIcon size={20} />} title={t.gettingStarted} description={t.gettingStartedDesc} />
              <DocCard id="help-doc-api-reference" icon={<Code2 size={20} />} title={t.apiReference} description={t.apiReferenceDesc} />
              <DocCard id="help-doc-best-practices" icon={<BadgeCheck size={20} />} title={t.bestPractices} description={t.bestPracticesDesc} />
            </div>
          </section>

          {/* ── Keyboard Shortcuts ── */}
          <section
            className="pl-4 transition-colors duration-300"
            style={{ borderLeft: "2px solid var(--color-hairline)" }}
          >
            <SectionHeader icon={<Keyboard size={16} />} title={t.keyboardShortcuts} />
            <div
              className="overflow-hidden"
              style={{
                background: "var(--color-surface-soft)",
                border: "1px solid var(--color-hairline)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x"
                style={{ borderColor: "var(--color-hairline)" }}
              >
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
          <section
            className="pl-4 transition-colors duration-300"
            style={{ borderLeft: "2px solid var(--color-hairline)" }}
          >
            <SectionHeader icon={<Headphones size={16} />} title={t.support} />
            <div className="flex flex-wrap gap-3">
              <button
                id="help-report-issue-btn"
                className="flex items-center gap-2 px-5 py-2.5 transition-colors"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-on-primary)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "var(--font-sans)",
                  border: "none",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-primary-active)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--color-primary)"}
              >
                <BugPlay size={16} />
                {t.reportIssue}
              </button>
              <button
                id="help-community-btn"
                className="flex items-center gap-2 px-5 py-2.5 transition-colors"
                style={{
                  background: "var(--color-canvas)",
                  color: "var(--color-ink)",
                  border: "1px solid var(--color-hairline)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-hairline)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-ink)";
                }}
              >
                <MessageSquareText size={16} />
                {t.joinCommunity}
              </button>
            </div>
          </section>
        </div>

        {/* ── Footer ── */}
        <div
          className="flex justify-end px-6 py-3 flex-shrink-0"
          style={{
            borderTop: "1px solid var(--color-hairline)",
            background: "var(--color-canvas)",
          }}
        >
          <button
            id="help-close-footer-btn"
            onClick={() => setShowHelp(false)}
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
