"use client";

import { cn } from "@/lib/utils";

type Status = "active" | "draft" | "error" | "running" | "warning";

const STATUS_CONFIG: Record<Status, { label: string; dot: string; text: string }> = {
  active:  { label: "Active",   dot: "bg-emerald-500",        text: "text-emerald-700 dark:text-emerald-400" },
  draft:   { label: "Draft",    dot: "bg-zinc-400",            text: "text-zinc-500" },
  error:   { label: "Error",    dot: "bg-red-500",             text: "text-red-600 dark:text-red-400" },
  running: { label: "Running",  dot: "bg-blue-500 animate-pulse", text: "text-blue-600 dark:text-blue-400" },
  warning: { label: "Warning",  dot: "bg-amber-400",           text: "text-amber-600 dark:text-amber-400" },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
  showLabel?: boolean;
}

export function StatusBadge({ status, className, showLabel = true }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", cfg.text, className)}>
      <span className={cn("inline-block w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
      {showLabel && cfg.label}
    </span>
  );
}
