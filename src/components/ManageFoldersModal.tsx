import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Folder } from "lucide-react";

interface ManageFoldersModalProps {
  folders: string[];
  onClose: () => void;
}

export default function ManageFoldersModal({ folders, onClose }: ManageFoldersModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/20 dark:bg-slate-950/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[8px] p-6 m-4 shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100 mb-2 font-display">
          All Folders
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 font-sans">
          These are the folders currently in use across your chats.
        </p>

        {folders.length === 0 ? (
          <p className="text-sm text-slate-500 italic mb-6">No folders created yet.</p>
        ) : (
          <div className="flex flex-col gap-2 mb-6 max-h-60 overflow-y-auto">
            {folders.map(f => (
              <div key={f} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-[6px] border border-slate-200 dark:border-slate-800">
                <Folder size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <span className="text-sm text-slate-950 dark:text-slate-200 font-medium truncate">{f}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono text-xs uppercase tracking-wider rounded-[6px] hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
