import React from "react";
import { Search, Folder, Pin } from "lucide-react";
import { useAppStore } from "../lib/context";

export default function FoldersView() {
  const chats = useAppStore((s) => s.chats);
  const [activeTab, setActiveTab] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const existingFolders = React.useMemo(() => {
    const folders = Array.from(new Set(chats.map((c) => c.folder).filter(Boolean))) as string[];
    return folders.filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [chats, searchQuery]);

  return (
    <div className="flex-1 flex flex-col items-center justify-start bg-slate-50 dark:bg-slate-950 p-6 sm:p-12 overflow-y-auto">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-slate-100 font-display">
            Folders
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full border border-transparent dark:border-slate-800">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search folders"
                className="bg-transparent text-sm outline-none text-slate-950 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 w-40"
              />
            </div>
            <button className="px-4 py-1.5 bg-white dark:bg-slate-100 text-slate-950 text-sm font-medium rounded-full shadow-sm hover:opacity-90 transition-opacity">
              New
            </button>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="flex items-center gap-4 text-sm">
          {["All", "Created by you", "Shared with you"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "px-4 py-1.5 rounded-full transition-colors",
                activeTab === tab
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-slate-100 font-medium"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_200px_50px] gap-4 px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400 mt-4">
          <div>Name</div>
          <div>Modified</div>
          <div></div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {existingFolders.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500 text-sm italic">
              No folders created yet.
            </div>
          ) : (
            existingFolders.map((folder, idx) => (
              <div
                key={folder}
                className="grid grid-cols-[1fr_200px_50px] items-center gap-4 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                    <Folder size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-950 dark:text-slate-200">
                    {folder}
                  </span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Today
                </div>
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 transition-colors">
                    <Pin size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
}
