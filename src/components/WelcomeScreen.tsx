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
import { Pencil, Code2, FileText, Lightbulb } from "lucide-react";
import { SUGGESTION_PROMPTS } from "../lib/store";
import { useAppStore } from "../lib/context";
import { getTranslations } from "../lib/i18n";
import { motion, useReducedMotion } from "motion/react";

const iconMap = {
  Pencil,
  Code2,
  FileText,
  Lightbulb,
} as const;

type IconKey = keyof typeof iconMap;

export default function WelcomeScreen() {
  const sendMessage = useAppStore(s => s.sendMessage);
  const language = useAppStore(s => s.language);
  const t = getTranslations(language).welcome;
  const reduceMotion = useReducedMotion();

  // min-h-full (not h-full): when the content is taller than the space, as on phones,
  // the column grows and scrolls instead of centring and clipping its top.
  return (
    <div
      className="flex flex-col items-center justify-center min-h-full px-5 py-10 short:py-6 select-none"
      style={{ background: "transparent" }}
    >
      <span className="mb-6 short:mb-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-lg font-semibold text-foreground" aria-hidden="true">N</span>
      {/* Greeting */}
      <h2
        className="mb-2"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 5vw, 36px)",
          fontWeight: 600,
          letterSpacing: "-0.5px",
          lineHeight: 1.15,
          color: "var(--color-ink)",
          textAlign: "center",
        }}
      >
        {t.greeting}
      </h2>
      <p
        className="mb-10 short:mb-6 text-center"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "16px",
          color: "var(--color-muted)",
          fontWeight: 400,
          lineHeight: 1.55,
        }}
      >
        What can I help you with today?
      </p>

      {/* Suggestion cards — feature-card spec */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 w-full max-w-[560px]">
        {SUGGESTION_PROMPTS.map((s, i) => {
          const Icon = iconMap[s.icon as IconKey];
          return (
            <motion.button
              key={s.title}
              id={`suggestion-${i}`}
              onClick={() => sendMessage(s.prompt + " ")}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={[
                "group text-left transition-all duration-200",
                i === SUGGESTION_PROMPTS.length - 1 && SUGGESTION_PROMPTS.length % 2 !== 0
                  ? "min-[400px]:col-span-2"
                  : "",
              ].join(" ")}
              style={{
                padding: "var(--space-lg)",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-canvas)",
                border: "1px solid var(--color-hairline-soft)",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--color-primary)";
                el.style.background = "var(--color-surface-soft)";
                el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--color-hairline-soft)";
                el.style.background = "var(--color-canvas)";
                el.style.boxShadow = "none";
              }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="flex items-center justify-center w-6 h-6"
                  style={{
                    borderRadius: "var(--radius-xs)",
                    background: "var(--color-primary)",
                  }}
                >
                  <Icon size={13} style={{ color: "var(--color-on-primary)" }} />
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--color-ink)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {s.title}
                </span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-muted)",
                  lineHeight: 1.5,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {s.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
