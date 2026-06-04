import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../lib/store";

interface Props {
  message: Message;
}

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

const ChatMessage = memo(function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex flex-col items-end mb-8">
        <span className="text-[11px] font-medium tracking-widest text-slate-400 uppercase font-mono mb-2">
          User
        </span>
        <div
          className="max-w-[85%] px-5 py-3 rounded-[6px] bg-[#eff4ff] text-[#0b1c30] text-[15px] leading-relaxed border border-[#e5eeff]"
          style={{ wordBreak: "break-word" }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start mb-8">
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
        <span className="text-[11px] font-medium tracking-widest text-teal-600 uppercase font-mono">
          AI
        </span>
      </div>

      {/* Bubble / Text Content */}
      <div className="w-full flex">
        {/* Accent line */}
        <div className="w-[2px] bg-teal-500 rounded-full mr-4 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="prose-chat">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || ""}
            </ReactMarkdown>
            {message.streaming && !message.content && <TypingIndicator />}
            {message.streaming && message.content && (
              <span className="inline-block w-0.5 h-4 bg-teal-500 ml-0.5 animate-pulse align-middle" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
