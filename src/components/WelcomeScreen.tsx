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
import { useApp } from "../lib/context";
import { getTranslations } from "../lib/i18n";

const iconMap = {
  Pencil,
  Code2,
  FileText,
  Lightbulb,
} as const;

type IconKey = keyof typeof iconMap;

export default function WelcomeScreen() {
  const { sendMessage, language } = useApp();
  const t = getTranslations(language).welcome;

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[480px] px-6 select-none">
      {/* Greeting */}
      <h2 className="text-[22px] font-semibold text-slate-700 mb-6 tracking-tight">
        {t.greeting}
      </h2>

      {/* Suggestion cards */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-[540px]">
        {SUGGESTION_PROMPTS.map((s, i) => {
          const Icon = iconMap[s.icon as IconKey];
          return (
            <button
              key={i}
              id={`suggestion-${i}`}
              onClick={() => sendMessage(s.prompt + " ")}
              className={[
                "group text-left p-4 rounded-[8px] border border-slate-200 bg-white",
                "hover:border-teal-300 hover:bg-teal-50/40 hover:shadow-sm",
                "transition-all duration-150",
                // Make the last card in 4-card grid span if odd
                i === SUGGESTION_PROMPTS.length - 1 && SUGGESTION_PROMPTS.length % 2 !== 0
                  ? "col-span-2"
                  : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-[4px] bg-teal-100 group-hover:bg-teal-200 transition-colors">
                  <Icon size={13} className="text-teal-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{s.title}</span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">{s.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
