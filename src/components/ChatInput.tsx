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
import { Send, Mic, Square } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  isStreaming: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, isStreaming, placeholder = "Message Necookie AI..." }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const canSend = value.trim().length > 0 && !isStreaming;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 bg-white dark:bg-[#2f2f2f] border border-slate-200 dark:border-transparent rounded-[8px] px-3 py-2.5 focus-within:border-slate-300 dark:focus-within:border-transparent focus-within:shadow-sm transition-all"
      id="chat-input-form"
    >
      {/* Mic icon */}
      <button
        type="button"
        id="mic-btn"
        className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-[6px] text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#3f3f3f] transition-colors mb-0.5"
        aria-label="Voice input"
      >
        <Mic size={15} />
      </button>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        id="chat-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 leading-relaxed bg-transparent py-0.5 max-h-[200px]"
        disabled={isStreaming}
        aria-label="Chat message input"
      />

      {/* Send / Stop button */}
      <button
        type={isStreaming ? "button" : "submit"}
        id="send-btn"
        className={[
          "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-[6px] transition-all mb-0.5",
          canSend || isStreaming
            ? "bg-slate-800 dark:bg-white text-white dark:text-black shadow-sm"
            : "bg-slate-100 dark:bg-transparent text-slate-400 dark:text-slate-500 cursor-not-allowed",
        ].join(" ")}
        disabled={!canSend && !isStreaming}
        aria-label={isStreaming ? "Stop generation" : "Send message"}
      >
        {isStreaming ? (
          <Square size={13} className="fill-current" />
        ) : (
          <Send size={13} />
        )}
      </button>
    </form>
  );
}
