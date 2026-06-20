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
  const [focused, setFocused] = useState(false);

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
      className="flex items-end gap-2 px-3 py-2.5 transition-all"
      id="chat-input-form"
      style={{
        background: "var(--color-canvas)",
        border: focused
          ? "1px solid var(--color-primary)"
          : "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-md)",
        boxShadow: focused
          ? "0 0 0 3px rgba(204,120,92,0.12)"
          : "none",
      }}
    >
      {/* Mic icon */}
      <button
        type="button"
        id="mic-btn"
        className="flex-shrink-0 flex items-center justify-center w-7 h-7 transition-colors mb-0.5"
        style={{
          borderRadius: "var(--radius-sm)",
          color: "var(--color-muted-soft)",
        }}
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none outline-none leading-relaxed py-0.5 max-h-[200px] bg-transparent"
        style={{
          fontSize: "15px",
          color: "var(--color-ink)",
          fontFamily: "var(--font-sans)",
        }}
        disabled={isStreaming}
        aria-label="Chat message input"
      />

      {/* Send / Stop button */}
      <button
        type={isStreaming ? "button" : "submit"}
        id="send-btn"
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 transition-all mb-0.5"
        style={{
          borderRadius: "var(--radius-sm)",
          background: canSend || isStreaming ? "var(--color-primary)" : "var(--color-primary-disabled)",
          color: canSend || isStreaming ? "var(--color-on-primary)" : "var(--color-muted-soft)",
          cursor: !canSend && !isStreaming ? "not-allowed" : "pointer",
          boxShadow: canSend || isStreaming ? "0 1px 3px rgba(204,120,92,0.30)" : "none",
        }}
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
