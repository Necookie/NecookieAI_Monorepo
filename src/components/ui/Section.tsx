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
    <section className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center gap-2">
        <span className="text-slate-400 flex-shrink-0">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-300">{title}</h3>
      </div>
      <div className="p-5 space-y-5">{children}</div>
    </section>
  );
}
