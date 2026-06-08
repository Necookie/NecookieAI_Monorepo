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
  
  const t = getTranslations(language);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = React.useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  // Force scroll to bottom when a new message is added
  const prevMessagesLength = useRef(activeChat?.messages?.length ?? 0);
  useEffect(() => {
    const currentLen = activeChat?.messages?.length ?? 0;
    if (currentLen > prevMessagesLength.current) {
      setAutoScroll(true);
    }
    prevMessagesLength.current = currentLen;
  }, [activeChat?.messages?.length]);

  // Auto-scroll to bottom on new messages if autoScroll is enabled
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages, autoScroll]);

  const hasMessages = (activeChat?.messages?.length ?? 0) > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-transparent">
      {/* Message area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
        id="chat-scroll-area"
      >
        {hasMessages ? (
          <div className="max-w-[760px] mx-auto px-6 py-6">
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
          <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-[6px] text-sm text-red-700 dark:text-red-400">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{error}</span>
            <button
              id="dismiss-error-btn"
              onClick={clearError}
              className="flex-shrink-0 text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-300 transition-colors"
              aria-label="Dismiss error"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-slate-200 dark:border-transparent bg-white dark:bg-slate-950">
        <div className="max-w-[760px] mx-auto px-6 py-3">
          <ChatInput onSend={sendMessage} isStreaming={isStreaming} placeholder={t.chat.placeholder} />
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-950 mt-2">
            Necookie AI can make mistakes. Verify important info.
          </p>
        </div>
      </div>
    </div>
  );
}
