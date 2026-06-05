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
      className="flex items-end gap-2 bg-white border border-slate-200 rounded-[8px] px-3 py-2.5 focus-within:border-slate-300 focus-within:shadow-sm transition-all"
      id="chat-input-form"
    >
      {/* Mic icon */}
      <button
        type="button"
        id="mic-btn"
        className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-[6px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mb-0.5"
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
        className="flex-1 resize-none outline-none text-sm text-slate-700 placeholder-slate-400 leading-relaxed bg-transparent py-0.5 max-h-[200px]"
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
            ? "bg-slate-800 hover:bg-slate-700 text-white shadow-sm"
            : "bg-slate-100 text-slate-400 cursor-not-allowed",
        ].join(" ")}
        disabled={!canSend && !isStreaming}
        aria-label={isStreaming ? "Stop generation" : "Send message"}
      >
        {isStreaming ? (
          <Square size={13} className="fill-white" />
        ) : (
          <Send size={13} />
        )}
      </button>
    </form>
  );
}
