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

import React, { memo, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RefreshCw } from "lucide-react";
import type { Message } from "../lib/store";

interface Props {
  message: Message;
  onRegenerate?: (id: string) => void;
}

// ─── Typing indicator ────────────────────────────────────────────────────────

const TypingIndicator = () => (
  <span className="inline-flex items-center gap-1 ml-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </span>
);

// ─── Pretty language display names ──────────────────────────────────────────

const LANG_DISPLAY: Record<string, string> = {
  typescript: "TypeScript", javascript: "JavaScript",
  tsx: "TSX", jsx: "JSX", python: "Python", rust: "Rust",
  go: "Go", java: "Java", css: "CSS", html: "HTML",
  json: "JSON", bash: "Bash", shell: "Shell", sql: "SQL",
  yaml: "YAML", markdown: "Markdown", text: "Plain Text", c: "C", cpp: "C++",
};

const LANG_EXT: Record<string, string> = {
  typescript: "ts", javascript: "js", tsx: "tsx", jsx: "jsx",
  python: "py", rust: "rs", go: "go", java: "java", css: "css",
  html: "html", json: "json", bash: "sh", shell: "sh", sql: "sql",
  yaml: "yaml", markdown: "md", c: "c", cpp: "cpp",
};

// ─── Code block ──────────────────────────────────────────────────────────────

function CodeBlock({
  language,
  children,
  className,
  ...props
}: {
  language: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const [copied, setCopied] = useState(false);

  const rawCode = String(children).replace(/\n$/, "");
  const label = (LANG_DISPLAY[language.toLowerCase()] ?? language) || "Code";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(rawCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [rawCode]);

  const handleDownload = useCallback(() => {
    const ext = LANG_EXT[language.toLowerCase()] ?? "txt";
    const blob = new Blob([rawCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rawCode, language]);

  return (
    <div
      className="relative my-5 rounded-[10px] overflow-hidden shadow-xl"
      style={{ background: "#18181b" }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background: "#18181b",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Language label */}
        <span
          className="text-sm font-bold select-none tracking-tight"
          style={{ color: "#e4e4e7" }}
        >
          {label}
        </span>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Download */}
          <ActionButton onClick={handleDownload} title="Download file">
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="8 12 12 16 16 12" />
              <line x1="12" y1="8" x2="12" y2="16" />
            </svg>
          </ActionButton>

          {/* Copy */}
          <ActionButton
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy code"}
            active={copied}
          >
            {copied ? (
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </ActionButton>
        </div>
      </div>

      {/* ── Code body ── */}
      <div className="overflow-x-auto px-6 py-5">
        <code
          className={className}
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: "13.5px",
            lineHeight: "1.8",
            color: "#d4d4d8",
            display: "block",
            whiteSpace: "pre",
          }}
          {...props}
        >
          {children}
        </code>
      </div>
    </div>
  );
}

// ─── Icon button helper ───────────────────────────────────────────────────────

function ActionButton({
  onClick,
  title,
  active,
  children,
}: {
  onClick: () => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-150"
      style={{
        color: active ? "#2dd4bf" : hovered ? "#ffffff" : "#71717a",
        background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
      }}
    >
      {children}
    </button>
  );
}

// ─── ChatMessage ─────────────────────────────────────────────────────────────

const ChatMessage = memo(function ChatMessage({ message, onRegenerate }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex flex-col items-end mb-8">
        <span className="text-[11px] font-medium tracking-widest text-slate-400 uppercase font-mono mb-2">
          User
        </span>
        <div
          className="max-w-[85%] px-5 py-3 rounded-[6px] bg-[#eff4ff] dark:bg-[#2f2f2f] text-[#0b1c30] dark:text-slate-100 text-[15px] leading-relaxed border border-[#e5eeff] dark:border-transparent"
          style={{ wordBreak: "break-word" }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start mb-8 group">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
              fill="white"
            />
          </svg>
        </div>
        <span className="text-[11px] font-medium tracking-widest text-teal-600 dark:text-teal-400 uppercase font-mono">
          AI
        </span>
      </div>

      {/* Bubble */}
      <div className="w-full flex">
        <div className="w-[2px] bg-teal-500 rounded-full mr-4 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="prose-chat text-slate-700 dark:text-slate-200">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = inline || (!match && !className?.includes("language-"));
                  const lang = match ? match[1] : "";

                  if (isInline) {
                    return <code className={className} {...props}>{children}</code>;
                  }

                  return (
                    <CodeBlock language={lang} className={className} {...props}>
                      {children}
                    </CodeBlock>
                  );
                },
              }}
            >
              {message.content || ""}
            </ReactMarkdown>
            {message.streaming && !message.content && <TypingIndicator />}
            {message.streaming && message.content && (
              <span className="inline-block w-0.5 h-4 bg-teal-500 ml-0.5 animate-pulse align-middle" />
            )}
          </div>

          {/* Action Bar */}
          {!message.streaming && onRegenerate && (
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onRegenerate(message.id)}
                className="flex items-center justify-center w-7 h-7 rounded-[6px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2f2f2f] transition-colors"
                title="Regenerate response"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
