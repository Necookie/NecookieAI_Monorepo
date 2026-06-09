import React from "react";

export function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-950 dark:text-slate-300 mb-0.5 uppercase tracking-wide font-mono">
          {label}
        </p>
        {description && (
          <p className="text-sm text-slate-950 dark:text-slate-400 leading-snug">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}
