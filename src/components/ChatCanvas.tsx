import React, { useRef, useEffect, useCallback } from "react";
import { useApp } from "../lib/context";
import ChatMessage from "./ChatMessage";
import WelcomeScreen from "./WelcomeScreen";
import ChatInput from "./ChatInput";

export default function ChatCanvas() {
  const { activeChat, sendMessage, isStreaming } = useApp();
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages]);

  const hasMessages = (activeChat?.messages?.length ?? 0) > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50">
      {/* Message area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        id="chat-scroll-area"
      >
        {hasMessages ? (
          <div className="max-w-[760px] mx-auto px-6 py-6">
            {activeChat!.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        ) : (
          <WelcomeScreen />
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white">
        <div className="max-w-[760px] mx-auto px-6 py-3">
          <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
          <p className="text-center text-[11px] text-slate-400 mt-2">
            Necookie AI can make mistakes. Verify important info.
          </p>
        </div>
      </div>
    </div>
  );
}
