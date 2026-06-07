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

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Sun, Moon, Menu } from "lucide-react";
import { useAppStore } from "../lib/context";
import { AVAILABLE_MODELS } from "../lib/store";
import type { Model } from "../lib/store";
import { getTranslations } from "../lib/i18n";

export default function Header() {
  const activeChat = useAppStore(s => s.activeChat());
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const setSidebarOpen = useAppStore(s => s.setSidebarOpen);
  const model = useAppStore(s => s.model);
  const setModel = useAppStore(s => s.setModel);
  const language = useAppStore(s => s.language);
  
  const t = getTranslations(language).header;
  const theme = useAppStore(s => s.theme);
  const setTheme = useAppStore(s => s.setTheme);
  const [modelOpen, setModelOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectModel(m: Model) {
    setModel(m);
    setModelOpen(false);
  }

  return (
    <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-shrink-0 h-[52px]">
      {/* Title — min-w-0 lets flex truncate correctly */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-[6px] text-slate-950 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <Menu size={18} />
        </button>
        <h1 className="min-w-0 flex-1 text-[15px] font-semibold text-slate-950 dark:text-slate-200 tracking-tight truncate">
          {activeChat?.title ?? "Necookie AI"}
        </h1>
      </div>

      {/* Right controls — flex-shrink-0 keeps buttons always visible */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Model selector */}
        <div className="relative" ref={dropRef}>
          <button
            id="model-selector-btn"
            onClick={() => setModelOpen(!modelOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-sm text-slate-950 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <span className="font-medium">{t.model}</span>
            <ChevronDown
              size={13}
              className={`text-slate-400 dark:text-slate-950 transition-transform duration-150 ${modelOpen ? "rotate-180" : ""}`}
            />
          </button>

          {modelOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[8px] shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60 py-1 z-50">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-950 px-3 py-1.5">
                {t.selectModel}
              </p>
              {AVAILABLE_MODELS.map((m) => (
                <button
                  key={m.id}
                  id={`model-option-${m.id}`}
                  onClick={() => selectModel(m)}
                  className={[
                    "flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors",
                    m.id === model.id
                      ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                      : "text-slate-950 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "w-1.5 h-1.5 rounded-full flex-shrink-0",
                      m.id === model.id ? "bg-teal-500" : "bg-transparent",
                    ].join(" ")}
                  />
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          id="theme-toggle-btn"
          onClick={() => {
            const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
            setTheme(isDark ? "light" : "dark");
          }}
          className="flex items-center justify-center w-8 h-8 rounded-[6px] text-slate-400 dark:text-slate-950 hover:text-slate-950 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
            <Sun size={15} />
          ) : (
            <Moon size={15} />
          )}
        </button>
      </div>
    </header>
  );
}
