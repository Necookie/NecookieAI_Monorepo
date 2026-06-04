import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Sun, Moon } from "lucide-react";
import { useApp } from "../lib/context";
import { AVAILABLE_MODELS } from "../lib/store";
import type { Model } from "../lib/store";

export default function Header() {
  const { activeChat, model, setModel } = useApp();
  const [modelOpen, setModelOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
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
    <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-200 bg-white flex-shrink-0 h-[52px]">
      {/* Title — min-w-0 lets flex truncate correctly */}
      <h1 className="min-w-0 flex-1 text-[15px] font-semibold text-slate-800 tracking-tight truncate">
        {activeChat?.title ?? "Necookie AI"}
      </h1>

      {/* Right controls — flex-shrink-0 keeps buttons always visible */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Model selector */}
        <div className="relative" ref={dropRef}>
          <button
            id="model-selector-btn"
            onClick={() => setModelOpen(!modelOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-sm text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <span className="font-medium">{model.label.split(" ").slice(-2).join(" ")}</span>
            <ChevronDown
              size={13}
              className={`text-slate-400 transition-transform duration-150 ${modelOpen ? "rotate-180" : ""}`}
            />
          </button>

          {modelOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-[8px] shadow-lg shadow-slate-200/60 py-1 z-50">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                Select Model
              </p>
              {AVAILABLE_MODELS.map((m) => (
                <button
                  key={m.id}
                  id={`model-option-${m.id}`}
                  onClick={() => selectModel(m)}
                  className={[
                    "flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors",
                    m.id === model.id
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50",
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
          onClick={() => setIsDark(!isDark)}
          className="flex items-center justify-center w-8 h-8 rounded-[6px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
