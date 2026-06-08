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
import { RefreshCw, Pencil, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Message } from "../lib/store";

interface Props {
  message: Message;
  onRegenerate?: (id: string) => void;
  onEditAndResend?: (id: string, newContent: string) => void;
}

// ─── Typing indicator ────────────────────────────────────────────────────────

const TypingIndicator = () => (
  <span className="inline-flex items-center gap-1 ml-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
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
      <div className="text-[13.5px]">
        <SyntaxHighlighter
          language={language.toLowerCase()}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1.25rem 1.5rem",
            background: "transparent",
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            lineHeight: "1.6",
          }}
          codeTagProps={{
            style: {
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            }
          }}
        >
          {rawCode}
        </SyntaxHighlighter>
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

const ChatMessage = memo(function ChatMessage({ message, onRegenerate, onEditAndResend }: Props) {
  const isUser = message.role === "user";
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [isCopied, setIsCopied] = useState(false);

  // Smooth streaming state
  const [smoothedContent, setSmoothedContent] = useState(message.content);
  const smoothedLengthRef = React.useRef(message.content.length);

  React.useEffect(() => {
    if (isUser || !message.streaming) {
      setSmoothedContent(message.content);
      smoothedLengthRef.current = message.content.length;
      return;
    }

    if (message.content.length < smoothedLengthRef.current) {
      setSmoothedContent(message.content);
      smoothedLengthRef.current = message.content.length;
      return;
    }

    const interval = setInterval(() => {
      const targetLen = message.content.length;
      const currentLen = smoothedLengthRef.current;
      
      if (currentLen < targetLen) {
        const remaining = targetLen - currentLen;
        const advance = remaining > 15 ? Math.ceil(remaining / 3) : 1;
        smoothedLengthRef.current = currentLen + advance;
        setSmoothedContent(message.content.slice(0, smoothedLengthRef.current));
      } else {
        clearInterval(interval);
      }
    }, 30); // ~33fps update rate for smooth typewriter effect

    return () => clearInterval(interval);
  }, [message.content, message.streaming, isUser]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content).catch(() => {});
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [message.content]);

  const handleEditSubmit = useCallback(() => {
    if (editValue.trim() && editValue !== message.content) {
      onEditAndResend?.(message.id, editValue);
    }
    setIsEditing(false);
  }, [editValue, message.id, message.content, onEditAndResend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(message.content);
    }
  }, [handleEditSubmit, message.content]);

  if (isUser) {
    if (isEditing) {
      return (
        <div className="flex flex-col items-end mb-8 w-full max-w-3xl ml-auto">
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[12px] p-3 shadow-sm">
            <textarea
              className="w-full bg-transparent text-[#0b1c30] dark:text-slate-100 text-[15px] outline-none resize-none min-h-[100px] mb-2"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(message.content);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-950 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[8px] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={!editValue.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-[8px] transition-colors"
              >
                Save & Submit
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-end mb-8 group w-full">
        <span className="text-[11px] font-medium tracking-widest text-slate-400 uppercase font-mono mb-2 mr-2">
          User
        </span>
        <div className="flex items-end gap-3 max-w-[85%]">
          {onEditAndResend && (
            <button
              onClick={() => {
                setEditValue(message.content);
                setIsEditing(true);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 mb-2"
              title="Edit and resend"
            >
              <Pencil size={15} />
            </button>
          )}
          <div
            className="px-5 py-3 rounded-[12px] bg-[#eff4ff] dark:bg-[#2f2f2f] text-[#0b1c30] dark:text-slate-100 text-[15px] leading-relaxed border border-[#e5eeff] dark:border-transparent"
            style={{ wordBreak: "break-word" }}
          >
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start mb-8 group">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
              fill="white"
            />
          </svg>
        </div>
        <span className="text-[11px] font-medium tracking-widest text-blue-600 dark:text-blue-400 uppercase font-mono">
          AI
        </span>
      </div>

      {/* Bubble */}
      <div className="w-full flex">
        <div className="w-[2px] bg-blue-500 rounded-full mr-4 flex-shrink-0" />
        <div className="flex-1 min-w-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 rounded-[12px] border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="prose-chat text-slate-950 dark:text-slate-200">
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
              {smoothedContent || ""}
            </ReactMarkdown>
            {message.streaming && !smoothedContent && <TypingIndicator />}
            {message.streaming && smoothedContent && (
              <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle" />
            )}
          </div>

          {/* Action Bar */}
          {!message.streaming && (
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center w-7 h-7 rounded-[6px] text-slate-400 hover:text-slate-950 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2f2f2f] transition-colors"
                title="Copy message"
              >
                {isCopied ? <Check size={14} className="text-blue-500" /> : <Copy size={14} />}
              </button>

              {onRegenerate && (
                <button
                  onClick={() => onRegenerate(message.id)}
                  className="flex items-center justify-center w-7 h-7 rounded-[6px] text-slate-400 hover:text-slate-950 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2f2f2f] transition-colors"
                  title="Regenerate response"
                >
                  <RefreshCw size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
