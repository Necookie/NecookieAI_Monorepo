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
    <div className="flex flex-col sm:flex-row sm:items-center has-[[data-color-picker-trigger]]:items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-neutral-950 dark:text-neutral-300 mb-0.5 uppercase tracking-wide font-mono">
          {label}
        </p>
        {description && (
          <p className="text-sm text-neutral-950 dark:text-neutral-400 leading-snug">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}
