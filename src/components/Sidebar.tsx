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
  ChevronDown,
  ChevronRight,
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
  const setCurrentView = useAppStore(s => s.setCurrentView);
  const newChat = useAppStore(s => s.newChat);
  const selectChat = useAppStore(s => s.selectChat);
  const deleteChat = useAppStore(s => s.deleteChat);
  const setShowSettings = useAppStore(s => s.setShowSettings);
  const setShowHelp = useAppStore(s => s.setShowHelp);
  const language = useAppStore(s => s.language);
  const updateChatFolder = useAppStore(s => s.updateChatFolder);
  
  const t = getTranslations(language).sidebar;
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [folderModalChatId, setFolderModalChatId] = React.useState<string | null>(null);

  const existingFolders = React.useMemo(() => {
    return Array.from(new Set(chats.map((c) => c.folder).filter(Boolean))) as string[];
  }, [chats]);

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [collapsedFolders, setCollapsedFolders] = React.useState<Record<string, boolean>>({});

  const groupedChats = React.useMemo(() => {
    const groups: Record<string, typeof chats> = { Recent: [] };
    filtered.forEach(chat => {
      if (!chat.folder) {
        groups.Recent.push(chat);
      }
    });
    return groups;
  }, [filtered]);

  const toggleFolder = (folder: string) => {
    setCollapsedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  return (
    <aside
      className={[
        "flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-transparent transition-all duration-300 ease-in-out flex-shrink-0 absolute z-40 md:relative",
        sidebarOpen 
          ? "w-[240px] translate-x-0" 
          : "w-[240px] -translate-x-full md:translate-x-0 md:w-[52px]",
      ].join(" ")}
    >
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        {sidebarOpen && (
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-950 uppercase leading-none">
              {t.history}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-950 leading-snug mt-0.5">
              {t.lastSevenDays}
            </p>
          </div>
        )}
        <button
          id="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={[
            "flex items-center justify-center w-8 h-8 rounded-[6px] text-slate-400 hover:text-slate-950 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
            sidebarOpen ? "ml-auto" : "mx-auto",
          ].join(" ")}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose size={16} />
          ) : (
            <PanelLeftOpen size={16} />
          )}
        </button>
      </div>

      {/* ─── Actions ─── */}
      <div className="px-2 py-1 flex flex-col gap-1">
        <button
          id="new-chat-btn"
          onClick={newChat}
          className={[
            "flex items-center gap-2 w-full rounded-[6px] text-slate-950 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-[0_0_12px_rgba(59,130,246,0.2)] transition-all duration-300 text-sm font-medium",
            sidebarOpen ? "px-3 py-2" : "p-2 justify-center",
          ].join(" ")}
        >
          <Plus size={15} className="flex-shrink-0 text-slate-950 dark:text-slate-400" />
          {sidebarOpen && <span>{t.newChat}</span>}
        </button>

        <button
          id="manage-folders-btn"
          onClick={() => setCurrentView("folders")}
          className={[
            "flex items-center gap-2 w-full rounded-[6px] text-slate-950 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-[0_0_12px_rgba(59,130,246,0.2)] transition-all duration-300 text-sm font-medium",
            sidebarOpen ? "px-3 py-2" : "p-2 justify-center",
          ].join(" ")}
        >
          <Folder size={15} className="flex-shrink-0 text-slate-950 dark:text-slate-400" />
          {sidebarOpen && <span>Folders</span>}
        </button>
      </div>

      {/* ─── Search ─── */}
      {sidebarOpen && (
        <div className="px-2 py-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Search size={13} className="text-slate-400 flex-shrink-0" />
            <input
              id="chat-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchChat}
              className="flex-1 bg-transparent text-sm text-slate-950 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 outline-none min-w-0"
            />
          </div>
        </div>
      )}

      {/* ─── Chat List ─── */}
      <nav className="flex-1 overflow-y-auto py-1 px-2 mt-1">
        <ul className="space-y-2">
          {Object.entries(groupedChats).map(([folderName, folderChats]) => {
            if (folderChats.length === 0) return null;
            const isCollapsed = collapsedFolders[folderName];

            return (
              <li key={folderName} className="space-y-0.5">
                {sidebarOpen && (
                  <button
                    onClick={() => toggleFolder(folderName)}
                    className="flex items-center gap-1.5 w-full text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-950 uppercase px-3 py-1 mb-0.5 hover:text-slate-950 dark:hover:text-slate-300 transition-colors"
                  >
                    {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                    {folderName !== "Recent" && <Folder size={10} className="mr-0.5" />}
                    {folderName === "Recent" ? t.recent : folderName}
                  </button>
                )}
                
                {!isCollapsed && (
                  <ul className="space-y-0.5">
                    {folderChats.map((chat) => {
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
                                "flex items-center gap-2 w-full rounded-[6px] text-sm transition-colors",
                                sidebarOpen ? "px-3 py-2" : "p-2 justify-center",
                                isActive
                                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium"
                                  : "text-slate-950 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                              ].join(" ")}
                            >
                              <MessageSquare
                                size={14}
                                className={[
                                  "flex-shrink-0",
                                  isActive ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-950",
                                ].join(" ")}
                              />
                              {sidebarOpen && (
                                <span className="truncate flex-1 text-left pr-5">
                                  {chat.title}
                                </span>
                              )}
                            </button>

                            {sidebarOpen && isHovered && !isActive && (
                              <div className="absolute right-2 flex items-center gap-0.5 z-10 bg-white dark:bg-slate-950 rounded pr-1 shadow-[0_0_8px_4px_rgba(255,255,255,1)] dark:shadow-[0_0_8px_4px_rgba(2,6,23,1)]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFolderModalChatId(chat.id);
                                  }}
                                  className="flex items-center justify-center w-5 h-5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-500 text-slate-400 dark:text-slate-950 transition-colors"
                                  title="Move to folder"
                                >
                                  <FolderPlus size={12} />
                                </button>
                                <button
                                  id={`delete-chat-${chat.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(chat.id);
                                  }}
                                  className="flex items-center justify-center w-5 h-5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 text-slate-400 dark:text-slate-950 transition-colors"
                                  title={`Delete ${chat.title}`}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ─── Footer ─── */}
      <div className="border-t border-slate-100 dark:border-slate-800 px-2 py-2 space-y-0.5">
        {[
          { icon: <Settings size={14} />, label: t.settings, id: "settings-btn", onClick: () => setShowSettings(true) },
          { icon: <HelpCircle size={14} />, label: t.help, id: "help-btn", onClick: () => setShowHelp(true) },
        ].map(({ icon, label, id, onClick }) => (
          <button
            key={id}
            id={id}
            onClick={onClick}
            className={[
              "flex items-center gap-2 w-full rounded-[6px] text-slate-950 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-[0_0_12px_rgba(59,130,246,0.2)] transition-all duration-300 text-sm",
              sidebarOpen ? "px-3 py-2" : "p-2 justify-center",
            ].join(" ")}
          >
            <span className="flex-shrink-0">{icon}</span>
            {sidebarOpen && <span>{label}</span>}
          </button>
        ))}

        {user && (
          <div
            className={[
              "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 mt-3 rounded-[8px] transition-all duration-300 ease-in-out overflow-hidden",
              sidebarOpen ? "p-3" : "p-1.5 flex justify-center"
            ].join(" ")}
          >
            {sidebarOpen ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-950">
                    Session Status
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Connected" />
                </div>
                <div className="flex items-center gap-2.5 min-w-0 mt-1">
                  <div className="flex-shrink-0 border border-slate-200 dark:border-slate-700 rounded-full p-0.5 bg-white dark:bg-slate-800">
                    <UserButton afterSignOutUrl="/" appearance={{
                      elements: {
                        userButtonAvatarBox: "w-6 h-6",
                      }
                    }} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-slate-950 dark:text-slate-200 truncate leading-tight">
                      {user.fullName || user.username || "User"}
                    </span>
                    <span className="text-[9px] text-slate-950 dark:text-slate-400 truncate leading-none mt-1">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-0.5 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                <UserButton afterSignOutUrl="/" appearance={{
                  elements: {
                    userButtonAvatarBox: "w-6 h-6",
                  }
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
