import React from "react";
import { Search, Folder, Pin, MessageSquare, ChevronDown } from "lucide-react";
import { useAppStore } from "../lib/context";

export default function FoldersView() {
  const chats = useAppStore((s) => s.chats);
  const selectChat = useAppStore((s) => s.selectChat);
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const [activeTab, setActiveTab] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedFolder, setExpandedFolder] = React.useState<string | null>(null);

  const existingFolders = React.useMemo(() => {
    const folders = Array.from(new Set(chats.map((c) => c.folder).filter(Boolean))) as string[];
    return folders.filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [chats, searchQuery]);

  const tabs = ["All", "Created by you", "Shared with you"];

  return (
    <div
      className="flex-1 flex flex-col items-center justify-start p-6 sm:p-12 overflow-y-auto"
      style={{ background: "var(--color-canvas)" }}
    >
      <div className="w-full max-w-4xl flex flex-col gap-8">

        {/* Header Row */}
        <div className="flex items-center justify-between">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: 400,
              letterSpacing: "-0.5px",
              lineHeight: 1.15,
              color: "var(--color-ink)",
            }}
          >
            Folders
          </h1>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5"
              style={{
                background: "var(--color-surface-soft)",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--color-hairline)",
              }}
            >
              <Search size={14} style={{ color: "var(--color-muted-soft)" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search folders"
                className="bg-transparent outline-none w-40"
                style={{
                  fontSize: "14px",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-sans)",
                }}
              />
            </div>
            <button
              className="px-4 py-1.5 transition-all"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-on-primary)",
                fontSize: "14px",
                fontWeight: 500,
                borderRadius: "var(--radius-pill)",
                fontFamily: "var(--font-sans)",
                border: "none",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-primary-active)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--color-primary)"}
            >
              New
            </button>
          </div>
        </div>

        {/* Category Tabs — DESIGN.md category-tab spec */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3.5 py-1.5 transition-colors"
              style={{
                borderRadius: "var(--radius-md)",
                fontSize: "14px",
                fontWeight: activeTab === tab ? 500 : 400,
                fontFamily: "var(--font-sans)",
                background: activeTab === tab ? "var(--color-surface-card)" : "transparent",
                color: activeTab === tab ? "var(--color-ink)" : "var(--color-muted)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div
          className="grid grid-cols-[1fr_200px_50px] gap-4 px-4 py-2 mt-0"
          style={{
            borderBottom: "1px solid var(--color-hairline)",
            fontSize: "12px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--color-muted-soft)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <div>Name</div>
          <div>Modified</div>
          <div></div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col -mt-4">
          {existingFolders.length === 0 ? (
            <div
              className="px-4 py-12 text-center"
              style={{
                fontSize: "15px",
                color: "var(--color-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              No folders yet. Organize your chats by adding them to folders.
            </div>
          ) : (
            existingFolders.map((folder) => (
              <div
                key={folder}
                className="flex flex-col"
                style={{ borderBottom: "1px solid var(--color-hairline-soft)" }}
              >
                <div
                  onClick={() => setExpandedFolder(expandedFolder === folder ? null : folder)}
                  className="grid grid-cols-[1fr_200px_50px] items-center gap-4 px-4 py-3 transition-colors cursor-pointer group"
                  style={{ borderRadius: "var(--radius-md)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-surface-soft)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-8 h-8"
                      style={{
                        borderRadius: "var(--radius-md)",
                        background: "var(--color-surface-card)",
                        color: "var(--color-muted)",
                      }}
                    >
                      {expandedFolder === folder
                        ? <ChevronDown size={16} />
                        : <Folder size={16} />
                      }
                    </div>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "var(--color-ink)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {folder}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--color-muted)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Today
                  </div>
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 transition-colors"
                      style={{ color: "var(--color-muted-soft)" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-muted-soft)"}
                    >
                      <Pin size={14} />
                    </button>
                  </div>
                </div>
                {expandedFolder === folder && (
                  <div className="flex flex-col gap-1 pl-14 pr-4 py-2 mb-2">
                    {chats.filter(c => c.folder === folder).map(chat => (
                      <div
                        key={chat.id}
                        onClick={() => { selectChat(chat.id); setCurrentView("chat"); }}
                        className="flex items-center gap-3 px-3 py-2 transition-colors cursor-pointer"
                        style={{
                          fontSize: "14px",
                          color: "var(--color-body)",
                          borderRadius: "var(--radius-sm)",
                          fontFamily: "var(--font-sans)",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-surface-card)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                      >
                        <MessageSquare size={14} style={{ color: "var(--color-muted-soft)" }} />
                        <span>{chat.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
