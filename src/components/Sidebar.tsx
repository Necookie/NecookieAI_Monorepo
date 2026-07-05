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

import React from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  HelpCircle,
  MessageSquare,
  Trash2,
  FolderPlus,
  Folder,
  Pin,
  MoreVertical,
  Zap,
} from "lucide-react";
import { useAppStore } from "../lib/context";
import { getTranslations } from "../lib/i18n";
import { UserButton, useUser } from "@clerk/clerk-react";
import FolderModal from "./FolderModal";

export default function Sidebar() {
  const chats = useAppStore(s => s.chats);
  const activeId = useAppStore(s => s.activeId);
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const setSidebarOpen = useAppStore(s => s.setSidebarOpen);
  const currentView = useAppStore(s => s.currentView);
  const setCurrentView = useAppStore(s => s.setCurrentView);
  const newChat = useAppStore(s => s.newChat);
  const selectChat = useAppStore(s => s.selectChat);
  const deleteChat = useAppStore(s => s.deleteChat);
  const setShowSettings = useAppStore(s => s.setShowSettings);
  const setShowHelp = useAppStore(s => s.setShowHelp);
  const language = useAppStore(s => s.language);
  const compactMode = useAppStore(s => s.compactMode);
  const updateChatFolder = useAppStore(s => s.updateChatFolder);
  const togglePinChat = useAppStore(s => s.togglePinChat);

  const t = getTranslations(language).sidebar;
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [folderModalChatId, setFolderModalChatId] = React.useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const existingFolders = React.useMemo(() => {
    return Array.from(new Set(chats.map((c) => c.folder).filter(Boolean))) as string[];
  }, [chats]);

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentChats = React.useMemo(() => {
    const recents = filtered.filter(chat => !chat.folder);
    recents.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
    return recents;
  }, [filtered]);

  // Common action button style
  const actionBtnStyle = (active = false): React.CSSProperties => ({
    borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    fontWeight: 500,
    color: active ? "var(--color-primary)" : "var(--color-body)",
    background: active ? "var(--color-surface-soft)" : "transparent",
    transition: "background 150ms, color 150ms",
  });

  return (
    <aside
      className={[
        "flex flex-col h-full border-r transition-all duration-300 ease-in-out flex-shrink-0 absolute z-40 md:relative md:z-10",
        sidebarOpen
          ? "w-[240px] translate-x-0"
          : "w-[240px] -translate-x-full md:translate-x-0 md:w-[52px]",
      ].join(" ")}
      style={{
        background: "var(--color-surface-soft)",
        borderColor: "var(--color-hairline)",
      }}
    >
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        {sidebarOpen && (
          <div className="min-w-0">
            <p
              className="leading-none"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "var(--color-muted-soft)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t.history}
            </p>
            <p
              className="leading-snug mt-0.5"
              style={{ fontSize: "11px", color: "var(--color-muted-soft)", fontFamily: "var(--font-sans)" }}
            >
              {t.lastSevenDays}
            </p>
          </div>
        )}
        <button
          id="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={[
            "flex items-center justify-center w-8 h-8 transition-colors",
            sidebarOpen ? "ml-auto" : "mx-auto",
          ].join(" ")}
          style={{
            borderRadius: "var(--radius-sm)",
            color: "var(--color-muted)",
          }}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </div>

      {/* ─── Actions ─── */}
      <div className="px-2 py-1 flex flex-col gap-1">
        <button
          id="new-chat-btn"
          onClick={newChat}
          className={[
            "flex items-center gap-2 w-full transition-all duration-200",
            sidebarOpen ? (compactMode ? "px-3 py-1.5" : "px-3 py-2") : "p-2 justify-center",
          ].join(" ")}
          style={actionBtnStyle()}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--color-surface-card)";
            (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--color-body)";
          }}
        >
          <Plus size={15} className="flex-shrink-0" />
          {sidebarOpen && <span>{t.newChat}</span>}
        </button>

        <button
          id="manage-folders-btn"
          onClick={() => setCurrentView("folders")}
          className={[
            "flex items-center gap-2 w-full transition-all duration-200",
            sidebarOpen ? (compactMode ? "px-3 py-1.5" : "px-3 py-2") : "p-2 justify-center",
          ].join(" ")}
          style={actionBtnStyle(currentView === "folders")}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--color-surface-card)";
            (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--color-body)";
          }}
        >
          <Folder size={15} className="flex-shrink-0" />
          {sidebarOpen && <span>Folders</span>}
        </button>

        <button
          id="antigravity-dashboard-btn"
          onClick={() => setCurrentView("dashboard")}
          className={[
            "flex items-center gap-2 w-full transition-all duration-200",
            sidebarOpen ? (compactMode ? "px-3 py-1.5" : "px-3 py-2") : "p-2 justify-center",
          ].join(" ")}
          style={actionBtnStyle(currentView === "dashboard")}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--color-surface-card)";
            (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--color-body)";
          }}
        >
          <Zap size={15} className="flex-shrink-0" />
          {sidebarOpen && <span>Antigravity Dashboard</span>}
        </button>
      </div>

      {/* ─── Search ─── */}
      {sidebarOpen && (
        <div className="px-2 py-1">
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              borderRadius: "var(--radius-md)",
              background: "var(--color-canvas)",
              border: "1px solid var(--color-hairline)",
            }}
          >
            <Search size={13} style={{ color: "var(--color-muted-soft)", flexShrink: 0 }} />
            <input
              id="chat-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchChat}
              className="flex-1 bg-transparent outline-none min-w-0"
              style={{
                fontSize: "14px",
                color: "var(--color-ink)",
                fontFamily: "var(--font-sans)",
              }}
            />
          </div>
        </div>
      )}

      {/* ─── Chat List ─── */}
      <nav className="flex-1 overflow-y-auto py-1 px-2 mt-1">
        {sidebarOpen && recentChats.length > 0 && (
          <div
            className="flex items-center gap-1.5 w-full px-3 py-1 mb-1"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--color-muted-soft)",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            Recents
          </div>
        )}
        <ul className="space-y-0.5">
          {recentChats.map((chat) => {
            const isActive = chat.id === activeId;
            const isHovered = hoveredId === chat.id;
            return (
              <li key={chat.id}>
                <div
                  className="relative flex items-center"
                  onMouseEnter={() => setHoveredId(chat.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <button
                    id={`chat-item-${chat.id}`}
                    onClick={() => selectChat(chat.id)}
                    className={[
                      "flex items-center gap-2 w-full text-sm transition-colors",
                      sidebarOpen ? (compactMode ? "px-3 py-1" : "px-3 py-2") : "p-2 justify-center",
                    ].join(" ")}
                    style={{
                      borderRadius: "var(--radius-sm)",
                      background: isActive ? "var(--color-surface-card)" : "transparent",
                      color: isActive ? "var(--color-primary-active)" : "var(--color-body)",
                      fontWeight: isActive ? 500 : 400,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    <MessageSquare
                      size={14}
                      style={{
                        flexShrink: 0,
                        color: isActive ? "var(--color-primary)" : "var(--color-muted-soft)",
                      }}
                    />
                    {sidebarOpen && (
                      <>
                        <span className="truncate flex-1 text-left">{chat.title}</span>
                        {chat.pinned && (
                          <Pin size={12} style={{ flexShrink: 0, color: "var(--color-muted-soft)" }} className="fill-current" />
                        )}
                      </>
                    )}
                  </button>

                  {sidebarOpen && (isHovered || openMenuId === chat.id) && (
                    <div
                      className={`absolute right-2 flex items-center z-10 pr-1 pl-4 h-full`}
                      style={{
                        background: isActive
                          ? "linear-gradient(to left, var(--color-surface-card) 60%, transparent)"
                          : "linear-gradient(to left, var(--color-surface-soft) 60%, transparent)",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                        }}
                        className="flex items-center justify-center w-6 h-6 transition-colors"
                        style={{
                          borderRadius: "var(--radius-xs)",
                          color: "var(--color-muted-soft)",
                        }}
                        title="Options"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {openMenuId === chat.id && (
                        <div
                          className="absolute right-0 top-8 w-48 py-1 z-50 flex flex-col"
                          style={{
                            background: "var(--color-canvas)",
                            border: "1px solid var(--color-hairline)",
                            borderRadius: "var(--radius-lg)",
                            boxShadow: "0 4px 16px rgba(20,20,19,0.10)",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => { togglePinChat(chat.id); setOpenMenuId(null); }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left transition-colors"
                            style={{ color: "var(--color-body)", fontFamily: "var(--font-sans)" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-surface-soft)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                          >
                            <Pin size={14} className={chat.pinned ? "fill-current" : ""} />
                            {chat.pinned ? "Unpin" : "Pin"}
                          </button>
                          <button
                            onClick={() => { setFolderModalChatId(chat.id); setOpenMenuId(null); }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left transition-colors"
                            style={{ color: "var(--color-body)", fontFamily: "var(--font-sans)" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-surface-soft)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                          >
                            <FolderPlus size={14} />
                            Add to folder
                          </button>
                          <button
                            onClick={() => { deleteChat(chat.id); setOpenMenuId(null); }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left transition-colors"
                            style={{ color: "var(--color-error)", fontFamily: "var(--font-sans)" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#fdf2f2"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ─── Footer ─── */}
      <div
        className="px-2 py-2 space-y-0.5"
        style={{ borderTop: "1px solid var(--color-hairline)" }}
      >
        {[
          { icon: <Settings size={14} />, label: t.settings, id: "settings-btn", onClick: () => setShowSettings(true) },
          { icon: <HelpCircle size={14} />, label: t.help, id: "help-btn", onClick: () => setShowHelp(true) },
        ].map(({ icon, label, id, onClick }) => (
          <button
            key={id}
            id={id}
            onClick={onClick}
            className={[
              "flex items-center gap-2 w-full transition-all duration-200",
              sidebarOpen ? (compactMode ? "px-3 py-1.5" : "px-3 py-2") : "p-2 justify-center",
            ].join(" ")}
            style={actionBtnStyle()}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--color-surface-card)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-body)";
            }}
          >
            <span style={{ flexShrink: 0 }}>{icon}</span>
            {sidebarOpen && <span>{label}</span>}
          </button>
        ))}

        {user && (
          <div
            className={[
              "mt-3 transition-all duration-300 ease-in-out overflow-hidden",
              sidebarOpen ? "p-3" : "p-1.5 flex justify-center",
            ].join(" ")}
            style={{
              border: "1px solid var(--color-hairline)",
              background: "var(--color-canvas)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            {sidebarOpen ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "var(--color-muted-soft)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Session Status
                  </span>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--color-success)" }}
                    title="Connected"
                  />
                </div>
                <div className="flex items-center gap-2.5 min-w-0 mt-1">
                  <div
                    className="flex-shrink-0 rounded-full p-0.5"
                    style={{
                      border: "1px solid var(--color-hairline)",
                      background: "var(--color-canvas)",
                    }}
                  >
                    <UserButton afterSignOutUrl="/" appearance={{
                      elements: { userButtonAvatarBox: "w-6 h-6" }
                    }} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className="truncate leading-tight"
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "var(--color-ink)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {user.fullName || user.username || "User"}
                    </span>
                    <span
                      className="truncate leading-none mt-1"
                      style={{
                        fontSize: "9px",
                        color: "var(--color-muted)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center justify-center p-0.5 rounded-full"
                style={{
                  background: "var(--color-canvas)",
                  border: "1px solid var(--color-hairline)",
                }}
              >
                <UserButton afterSignOutUrl="/" appearance={{
                  elements: { userButtonAvatarBox: "w-6 h-6" }
                }} />
              </div>
            )}
          </div>
        )}
      </div>

      {folderModalChatId && (
        <FolderModal
          initialFolder={chats.find((c) => c.id === folderModalChatId)?.folder || ""}
          existingFolders={existingFolders}
          onClose={() => setFolderModalChatId(null)}
          onSave={(folder) => {
            updateChatFolder(folderModalChatId, folder.trim() || null);
            setFolderModalChatId(null);
          }}
        />
      )}
    </aside>
  );
}
