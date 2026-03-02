"use client";

import {
  Bug,
  ClipboardCheck,
  Globe,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
  LayoutGrid,
  Undo2,
  Redo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSolutionStore } from "@/state/solutionStore";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { isDirty, appStatus } = useSolutionStore();

  return (
    <header className="h-10 flex items-center px-3 gap-2 border-b border-border bg-background shrink-0 z-10">
      {/* Logo + App name */}
      <div className="flex items-center gap-1.5 shrink-0">
        <LayoutGrid className="w-4 h-4 text-red-500" />
        <span className="text-[13px] font-semibold text-foreground">Studio</span>
      </div>

      <Separator orientation="vertical" className="h-4 mx-1" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-0.5 text-[12px] text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer transition-colors">
          Solution
        </span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium flex items-center gap-1">
          New Agent
          {isDirty && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"
              title="Unsaved changes"
            />
          )}
        </span>
      </nav>

      <Separator orientation="vertical" className="h-4 mx-1" />

      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Undo2 className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Redo2 className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex-1" />

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-[12px] gap-1.5"
              disabled={appStatus !== "ready"}
            >
              <Bug className="w-3.5 h-3.5" />
              Debug
            </Button>
          </TooltipTrigger>
          <TooltipContent>Run in debug mode</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-[12px] gap-1.5"
              disabled={appStatus !== "ready"}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              Evaluate
            </Button>
          </TooltipTrigger>
          <TooltipContent>Run evaluation suite</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className={cn(
                "h-7 px-3 text-[12px] gap-1.5 font-medium",
                "bg-violet-600 hover:bg-violet-700 text-white"
              )}
              disabled={appStatus !== "ready"}
            >
              <Globe className="w-3.5 h-3.5" />
              Publish
            </Button>
          </TooltipTrigger>
          <TooltipContent>Publish to production</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-4 mx-1" />

      {/* Utility icons */}
      <div className="flex items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Bell className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <HelpCircle className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Help &amp; docs</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Settings className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>

        {/* Avatar */}
        <div className="w-6 h-6 rounded-full bg-violet-200 dark:bg-violet-800 flex items-center justify-center ml-1 cursor-pointer">
          <span className="text-[10px] font-bold text-violet-700 dark:text-violet-200">PK</span>
        </div>
      </div>
    </header>
  );
}
