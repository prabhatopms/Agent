"use client";

import {
  FolderTree,
  Bot,
  Database,
  Search,
  Settings,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { icon: FolderTree, label: "Explorer", active: true },
  { icon: Bot, label: "Agents" },
  { icon: Database, label: "Assets & Connections" },
  { icon: Search, label: "Search" },
];

export function LeftIconRail() {
  return (
    <div className="w-12 shrink-0 flex flex-col items-center py-2 gap-1 border-r border-border bg-background">
      {/* App icon at top */}
      <div className="w-8 h-8 flex items-center justify-center mb-2">
        <LayoutGrid className="w-4 h-4 text-red-500" />
      </div>

      {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-md transition-colors",
                active
                  ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      ))}

      <div className="flex-1" />

      <Tooltip>
        <TooltipTrigger asChild>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Settings</TooltipContent>
      </Tooltip>
    </div>
  );
}
