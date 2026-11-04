import React from "react";
import { ChevronDown } from "lucide-react";

export function SelectField({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative w-full sm:w-56">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-950 dark:text-neutral-200 font-mono text-sm py-2 pl-3 pr-9 rounded-[6px] focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
      />
    </div>
  );
}
