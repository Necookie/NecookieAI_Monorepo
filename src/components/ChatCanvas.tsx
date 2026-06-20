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

import React, { useRef, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { useAppStore } from "../lib/context";
import ChatMessage from "./ChatMessage";
import WelcomeScreen from "./WelcomeScreen";
import ChatInput from "./ChatInput";
import { getTranslations } from "../lib/i18n";

export default function ChatCanvas() {
  const activeChat = useAppStore(s => s.activeChat());
  const sendMessage = useAppStore(s => s.sendMessage);
  const regenerateMessage = useAppStore(s => s.regenerateMessage);
  const editAndResend = useAppStore(s => s.editAndResend);
  const isStreaming = useAppStore(s => s.isStreaming);
  const error = useAppStore(s => s.error);
  const clearError = useAppStore(s => s.clearError);
  const language = useAppStore(s => s.language);
  const compactMode = useAppStore(s => s.compactMode);

  const t = getTranslations(language);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = React.useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  const prevMessagesLength = useRef(activeChat?.messages?.length ?? 0);
  useEffect(() => {
    const currentLen = activeChat?.messages?.length ?? 0;
    if (currentLen > prevMessagesLength.current) {
      setAutoScroll(true);
    }
    prevMessagesLength.current = currentLen;
  }, [activeChat?.messages?.length]);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages, autoScroll]);

  const hasMessages = (activeChat?.messages?.length ?? 0) > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ background: "transparent" }}>
      {/* Message area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
        id="chat-scroll-area"
      >
        {hasMessages ? (
          <div className={`max-w-[760px] mx-auto ${compactMode ? "px-4 py-3" : "px-6 py-8"}`}>
            {activeChat!.messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRegenerate={regenerateMessage}
                onEditAndResend={editAndResend}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        ) : (
          <WelcomeScreen />
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex-shrink-0 mx-auto w-full max-w-[760px] px-6 py-2">
          <div
            className="flex items-start gap-2 px-3 py-2.5 text-sm"
            style={{
              borderRadius: "var(--radius-sm)",
              background: "#fdf2f2",
              border: "1px solid #f5c6c6",
              color: "var(--color-error)",
            }}
          >
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{error}</span>
            <button
              id="dismiss-error-btn"
              onClick={clearError}
              className="flex-shrink-0 transition-colors"
              style={{ color: "var(--color-error)", opacity: 0.7 }}
              aria-label="Dismiss error"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div
        className="flex-shrink-0"
        style={{ borderTop: "1px solid var(--color-hairline)", background: "var(--color-canvas)" }}
      >
        <div className={`max-w-[760px] mx-auto ${compactMode ? "px-4 py-1.5" : "px-6 py-3"}`}>
          <ChatInput onSend={sendMessage} isStreaming={isStreaming} placeholder={t.chat.placeholder} />
          <p
            className="text-center mt-1.5"
            style={{ fontSize: "11px", color: "var(--color-muted-soft)", fontFamily: "var(--font-sans)" }}
          >
            Necookie AI can make mistakes. Verify important info.
          </p>
        </div>
      </div>
    </div>
  );
}
