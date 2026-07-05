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
import { RefreshCw, Pencil, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAppStore } from "../lib/context";
import type { Message } from "../lib/store";

interface Props {
  message: Message;
  onRegenerate?: (id: string) => void;
  onEditAndResend?: (id: string, newContent: string) => void;
}

// ─── Typing indicator — coral dots ────────────────────────────────────────────

const TypingIndicator = () => (
  <span className="inline-flex items-center gap-1 ml-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full animate-bounce"
        style={{ background: "var(--color-primary)", animationDelay: `${i * 0.15}s` }}
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

// ─── Code block — DESIGN.md code-window-card (surface-dark) ──────────────────

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
      className="relative my-5 overflow-hidden"
      style={{
        background: "var(--color-surface-dark)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 2px 8px rgba(20,20,19,0.14)",
      }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background: "var(--color-surface-dark)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Language label */}
        <span
          className="text-sm font-medium select-none"
          style={{ color: "var(--color-on-dark-soft)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
        >
          {label}
        </span>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Download */}
          <CodeActionButton onClick={handleDownload} title="Download file">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="8 12 12 16 16 12" />
              <line x1="12" y1="8" x2="12" y2="16" />
            </svg>
          </CodeActionButton>
          {/* Copy */}
          <CodeActionButton onClick={handleCopy} title={copied ? "Copied!" : "Copy code"} active={copied}>
            {copied ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </CodeActionButton>
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
            style: { fontFamily: '"JetBrains Mono", "Fira Code", monospace' }
          }}
        >
          {rawCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// ─── Code action button helper ───────────────────────────────────────────────

function CodeActionButton({
  onClick, title, active, children,
}: {
  onClick: () => void; title: string; active?: boolean; children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-150"
      style={{
        color: active ? "var(--color-accent-teal)" : hovered ? "var(--color-on-dark)" : "var(--color-on-dark-soft)",
        background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
      }}
    >
      {children}
    </button>
  );
}

// ─── Inline action button ─────────────────────────────────────────────────────

function MsgActionButton({
  onClick, title, children, active, activeStyle,
}: {
  onClick: () => void; title: string; children: React.ReactNode; active?: boolean; activeStyle?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-7 h-7 transition-colors"
      style={{
        borderRadius: "var(--radius-sm)",
        color: active ? undefined : "var(--color-muted-soft)",
        background: "transparent",
        ...(active ? activeStyle : {}),
      }}
      title={title}
      onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "var(--color-surface-card)"; (e.currentTarget as HTMLElement).style.color = "var(--color-body)"; } }}
      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--color-muted-soft)"; } }}
    >
      {children}
    </button>
  );
}

// ─── ChatMessage ─────────────────────────────────────────────────────────────

const ChatMessage = memo(function ChatMessage({ message, onRegenerate, onEditAndResend }: Props) {
  const compactMode = useAppStore(s => s.compactMode);
  const activeId = useAppStore(s => s.activeId);
  const rateMessage = useAppStore(s => s.rateMessage);
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
        // Detect if the current slice is inside a markdown code block (odd number of triple backticks)
        const currentSlice = message.content.slice(0, currentLen);
        const backtickCount = (currentSlice.match(/```/g) || []).length;
        const isInsideCodeBlock = backtickCount % 2 !== 0;

        let advance = 1;
        if (isInsideCodeBlock) {
          // Instantly catch up to the closing backticks or the end of the currently loaded stream chunk
          const remainingText = message.content.slice(currentLen);
          const closingIndex = remainingText.indexOf("```");
          if (closingIndex !== -1) {
            advance = closingIndex + 3;
          } else {
            advance = remainingText.length;
          }
        } else {
          const remaining = targetLen - currentLen;
          // Dynamically adjust step size to avoid queue buildup and layout stutter
          if (remaining > 80) {
            advance = Math.ceil(remaining / 4);
          } else if (remaining > 30) {
            advance = 5;
          } else if (remaining > 10) {
            advance = 2;
          } else {
            advance = 1;
          }
        }

        smoothedLengthRef.current = currentLen + advance;
        setSmoothedContent(message.content.slice(0, smoothedLengthRef.current));
      } else {
        clearInterval(interval);
      }
    }, 30);

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
        <div className={`flex flex-col items-end w-full max-w-3xl ml-auto ${compactMode ? "mb-4" : "mb-8"}`}>
          <div
            className="w-full p-3"
            style={{
              background: "var(--color-canvas)",
              border: "1px solid var(--color-hairline)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 1px 3px rgba(20,20,19,0.06)",
            }}
          >
            <textarea
              className="w-full bg-transparent outline-none resize-none min-h-[100px] mb-2"
              style={{
                fontSize: "15px",
                color: "var(--color-ink)",
                fontFamily: "var(--font-sans)",
                lineHeight: 1.6,
              }}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setIsEditing(false); setEditValue(message.content); }}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  borderRadius: "var(--radius-md)",
                  color: "var(--color-body)",
                  background: "transparent",
                  border: "1px solid var(--color-hairline)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={!editValue.trim()}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-primary)",
                  color: "var(--color-on-primary)",
                  fontFamily: "var(--font-sans)",
                  opacity: editValue.trim() ? 1 : 0.4,
                }}
              >
                Save &amp; Submit
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col items-end group w-full ${compactMode ? "mb-4" : "mb-8"}`}>
        <span
          className={`mr-2 ${compactMode ? "mb-1" : "mb-2"}`}
          style={{
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            color: "var(--color-muted-soft)",
            fontFamily: "var(--font-mono)",
          }}
        >
          You
        </span>
        <div className="flex items-end gap-3 max-w-[85%]">
          {onEditAndResend && (
            <button
              onClick={() => { setEditValue(message.content); setIsEditing(true); }}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors mb-2"
              style={{ color: "var(--color-muted-soft)" }}
              title="Edit and resend"
            >
              <Pencil size={15} />
            </button>
          )}
          <div
            className={`${compactMode ? "px-4 py-2" : "px-5 py-3"}`}
            style={{
              borderRadius: "var(--radius-lg)",
              background: "var(--color-surface-card)",
              color: "var(--color-body-strong)",
              fontSize: "15px",
              lineHeight: 1.6,
              border: "1px solid var(--color-hairline-soft)",
              wordBreak: "break-word",
              fontFamily: "var(--font-sans)",
            }}
          >
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-start group ${compactMode ? "mb-4" : "mb-8"}`}>
      {/* Label */}
      <div className={`flex items-center gap-2 ${compactMode ? "mb-1.5" : "mb-3"}`}>
        {/* Brand glyph */}
        <img
          src="/favicon.png"
          alt="Necookie AI"
          className="flex-shrink-0 w-5 h-5 object-contain rounded-full"
          style={{
            background: "var(--color-primary)",
          }}
        />
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            color: "var(--color-primary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Necookie AI
        </span>
      </div>

      {/* Bubble — editorial open layout with coral left accent */}
      <div className="w-full flex">
        <div
          className="rounded-full mr-4 flex-shrink-0"
          style={{ width: "2px", background: "var(--color-primary)", opacity: 0.4 }}
        />
        <div
          className={`flex-1 min-w-0 ${compactMode ? "p-3" : "p-4"}`}
          style={{
            background: "var(--color-canvas)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-hairline-soft)",
            boxShadow: "0 1px 3px rgba(20,20,19,0.06)",
          }}
        >
          <div className="prose-chat" style={{ color: "var(--color-body)" }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !!inline;
                  const lang = match ? match[1] : "text";

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
              <span
                className="inline-block w-0.5 h-4 ml-0.5 animate-pulse align-middle"
                style={{ background: "var(--color-primary)" }}
              />
            )}
          </div>

          {!message.streaming && (
            <div className="flex items-center gap-1 mt-2 transition-opacity">
              <MsgActionButton
                onClick={handleCopy}
                title="Copy message"
                active={isCopied}
                activeStyle={{ color: "var(--color-accent-teal)" }}
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
              </MsgActionButton>

              {onRegenerate && (
                <MsgActionButton
                  onClick={() => onRegenerate(message.id)}
                  title="Regenerate response"
                >
                  <RefreshCw size={14} />
                </MsgActionButton>
              )}

              {activeId && (
                <>
                  <div
                    className="w-px h-3 mx-1"
                    style={{ background: "var(--color-hairline)" }}
                  />
                  <MsgActionButton
                    onClick={() => rateMessage(activeId, message.id, message.rating === "like" ? null : "like")}
                    title="Like response"
                    active={message.rating === "like"}
                    activeStyle={{
                      color: "var(--color-accent-teal)",
                      background: "rgba(93,184,166,0.08)",
                    }}
                  >
                    <ThumbsUp size={14} />
                  </MsgActionButton>
                  <MsgActionButton
                    onClick={() => rateMessage(activeId, message.id, message.rating === "dislike" ? null : "dislike")}
                    title="Dislike response"
                    active={message.rating === "dislike"}
                    activeStyle={{
                      color: "var(--color-error)",
                      background: "rgba(198,69,69,0.08)",
                    }}
                  >
                    <ThumbsDown size={14} />
                  </MsgActionButton>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
