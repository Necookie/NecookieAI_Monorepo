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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match && !className?.includes("language-");
                  const language = match ? match[1] : "";

                  if (isInline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div className="relative my-5 rounded-[6px] overflow-hidden bg-[#0F172A] border border-slate-700/50 shadow-sm">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/50">
                        <span className="text-[11px] font-mono text-slate-400 font-medium">
                          {language || "text"}
                        </span>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              String(children).replace(/\n$/, "")
                            )
                          }
                          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                          title="Copy code"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span className="text-[10px] font-mono uppercase tracking-wider">
                            Copy
                          </span>
                        </button>
                      </div>
                      <div className="p-4 overflow-x-auto text-[13px] text-slate-200 font-mono leading-relaxed">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </div>
                    </div>
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
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
