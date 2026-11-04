import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface FolderModalProps {
  initialFolder: string;
  existingFolders: string[];
  onClose: () => void;
  onSave: (folder: string) => void;
}

export default function FolderModal({ initialFolder, existingFolders, onClose, onSave }: FolderModalProps) {
  const [folderName, setFolderName] = useState(initialFolder);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") onSave(folderName);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [folderName, onClose, onSave]);

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/20 dark:bg-neutral-950/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[8px] p-6 m-4 shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100 mb-2 font-display">
          Move to Folder
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5 font-sans">
          Enter a new or existing folder name. Leave blank to remove from folders.
        </p>

        <input
          ref={inputRef}
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Folder name..."
          className="w-full px-3 py-2 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-[6px] text-neutral-950 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 transition-colors mb-6 text-sm"
        />

        {existingFolders.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider font-sans">
              Existing Folders
            </p>
            <div className="flex flex-wrap gap-2">
              {existingFolders.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFolderName(f);
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  className="px-2 py-1 text-xs font-mono rounded-[4px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 font-mono text-xs uppercase tracking-wider rounded-[6px] hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(folderName)}
            className="px-4 py-2 border border-neutral-500 text-neutral-600 dark:text-neutral-400 font-mono text-xs uppercase tracking-wider rounded-[6px] hover:bg-neutral-500 hover:text-white dark:hover:bg-neutral-500 dark:hover:text-neutral-950 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
