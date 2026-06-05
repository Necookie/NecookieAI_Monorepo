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
} from "lucide-react";
import { useApp } from "../lib/context";
import { getTranslations } from "../lib/i18n";
import { UserButton, useUser } from "@clerk/clerk-react";

export default function Sidebar() {
  const { chats, activeId, sidebarOpen, setSidebarOpen, newChat, selectChat, deleteChat, setShowSettings, setShowHelp, language } = useApp();
  const t = getTranslations(language).sidebar;
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={[
        "flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex-shrink-0",
        sidebarOpen ? "w-[240px]" : "w-[52px]",
      ].join(" ")}
    >
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        {sidebarOpen && (
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase leading-none">
              {t.history}
            </p>
            <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
              {t.lastSevenDays}
            </p>
          </div>
        )}
        <button
          id="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={[
            "flex items-center justify-center w-8 h-8 rounded-[6px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors",
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

      {/* ─── New Chat ─── */}
      <div className="px-2 py-1">
        <button
          id="new-chat-btn"
          onClick={newChat}
          className={[
            "flex items-center gap-2 w-full rounded-[6px] text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium",
            sidebarOpen ? "px-3 py-2" : "p-2 justify-center",
          ].join(" ")}
        >
          <Plus size={15} className="flex-shrink-0 text-slate-500" />
          {sidebarOpen && <span>{t.newChat}</span>}
        </button>
      </div>

      {/* ─── Search ─── */}
      {sidebarOpen && (
        <div className="px-2 py-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-slate-50 border border-slate-200">
            <Search size={13} className="text-slate-400 flex-shrink-0" />
            <input
              id="chat-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchChat}
              className="flex-1 bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none min-w-0"
            />
          </div>
        </div>
      )}

      {/* ─── Chat List ─── */}
      <nav className="flex-1 overflow-y-auto py-1 px-2 mt-1">
        {sidebarOpen && (
          <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase px-3 py-1.5 mb-0.5">
            {t.recent}
          </p>
        )}
        <ul className="space-y-0.5">
          {filtered.map((chat) => {
            const isActive = chat.id === activeId;
            const isHovered = hoveredId === chat.id;
            return (
              <li key={chat.id}>
                {/* Wrapper div — valid HTML, no nested buttons */}
                <div
                  className="relative flex items-center"
                  onMouseEnter={() => setHoveredId(chat.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Main select area */}
                  <button
                    id={`chat-item-${chat.id}`}
                    onClick={() => selectChat(chat.id)}
                    className={[
                      "flex items-center gap-2 w-full rounded-[6px] text-sm transition-colors",
                      sidebarOpen ? "px-3 py-2" : "p-2 justify-center",
                      isActive
                        ? "bg-teal-50 text-teal-700 font-medium"
                        : "text-slate-600 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    <MessageSquare
                      size={14}
                      className={[
                        "flex-shrink-0",
                        isActive ? "text-teal-500" : "text-slate-400",
                      ].join(" ")}
                    />
                    {sidebarOpen && (
                      <span className="truncate flex-1 text-left pr-5">
                        {chat.title}
                      </span>
                    )}
                  </button>

                  {/* Delete button — sibling, not child */}
                  {sidebarOpen && isHovered && !isActive && (
                    <button
                      id={`delete-chat-${chat.id}`}
                      onClick={() => deleteChat(chat.id)}
                      className="absolute right-2 flex items-center justify-center w-5 h-5 rounded hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors z-10"
                      aria-label={`Delete ${chat.title}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ─── Footer ─── */}
      <div className="border-t border-slate-100 px-2 py-2 space-y-0.5">
        {[
          { icon: <Settings size={14} />, label: t.settings, id: "settings-btn", onClick: () => setShowSettings(true) },
          { icon: <HelpCircle size={14} />, label: t.help, id: "help-btn", onClick: () => setShowHelp(true) },
        ].map(({ icon, label, id, onClick }) => (
          <button
            key={id}
            id={id}
            onClick={onClick}
            className={[
              "flex items-center gap-2 w-full rounded-[6px] text-slate-500 hover:bg-slate-100 hover:text-slate-700 text-sm transition-colors",
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
              "flex items-center gap-2.5 border-t border-slate-100 mt-2 pt-2.5 px-1.5",
              sidebarOpen ? "justify-start" : "justify-center",
            ].join(" ")}
          >
            <UserButton afterSignOutUrl="/" />
            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-slate-700 truncate leading-tight">
                  {user.fullName || user.username || user.primaryEmailAddress?.emailAddress}
                </span>
                <span className="text-[9px] text-slate-400 truncate leading-none mt-0.5">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
