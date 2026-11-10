import React from "react";

export function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      <div className="px-4 sm:px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center gap-2">
        <span className="text-neutral-400 flex-shrink-0">{icon}</span>
        <h3 className="text-sm font-semibold text-neutral-950 dark:text-neutral-300">{title}</h3>
      </div>
      <div className="p-4 sm:p-5 space-y-5">{children}</div>
    </section>
  );
}
