"use client";

import {
  FolderTree,
  Database,
  Search,
  Settings,
  LayoutGrid,
  TableProperties,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSolutionStore } from "@/state/solutionStore";

const NAV_ITEMS = [
  { id: "explorer"    as const, icon: FolderTree,      label: "Explorer" },
  { id: "datamanager" as const, icon: TableProperties,  label: "Data Manager" },
  { id: "search"      as const, icon: Search,           label: "Search" },
  { id: "assets"      as const, icon: Database,         label: "Assets & Connections" },
];

export function LeftIconRail() {
  const leftPanelView  = useSolutionStore((s) => s.leftPanelView);
  const setLeftPanelView = useSolutionStore((s) => s.setLeftPanelView);

  return (
    <div className="w-12 shrink-0 flex flex-col items-center py-2 gap-1 border-r border-border bg-background">
      {/* App icon */}
      <div className="w-8 h-8 flex items-center justify-center mb-2">
        <LayoutGrid className="w-4 h-4 text-red-500" />
      </div>

      {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
        const isActive = id === leftPanelView;
        const isClickable = id === "explorer" || id === "datamanager";
        return (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => isClickable && setLeftPanelView(id as "explorer" | "datamanager")}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-md transition-colors",
                  isActive
                    ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        );
      })}

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
