"use client";

import { cn } from "@/lib/utils";

interface TokenChipProps {
  token: string;
  className?: string;
  onClick?: (token: string) => void;
}

/**
 * Renders a small pill chip representing a template variable like `{{inputData}}`.
 * Clicking it inserts the token into the active textarea (via onClick callback).
 */
export function TokenChip({ token, className, onClick }: TokenChipProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(token)}
      title={`Insert {{${token}}}`}
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono font-medium",
        "bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800",
        "text-violet-700 dark:text-violet-300",
        "hover:bg-violet-100 dark:hover:bg-violet-900 cursor-pointer",
        "transition-colors select-none",
        className
      )}
    >
      {"{{"}{token}{"}}"}
    </button>
  );
}

interface TokenChipBarProps {
  tokens: string[];
  onInsert?: (token: string) => void;
  label?: string;
}

export function TokenChipBar({ tokens, onInsert, label = "Insert:" }: TokenChipBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 py-1">
      <span className="text-[11px] text-muted-foreground font-medium mr-0.5">{label}</span>
      {tokens.map((t) => (
        <TokenChip key={t} token={t} onClick={onInsert} />
      ))}
    </div>
  );
}
