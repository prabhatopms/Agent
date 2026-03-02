"use client";

import { Plus, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CanvasEmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <Bot className="w-8 h-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-foreground mb-1">No steps yet</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Add agent steps to build your automation flow.
        </p>
      </div>
      <Button size="sm" variant="outline" className="gap-2 text-[12px]">
        <Plus className="w-3.5 h-3.5" />
        Add Agent Step
      </Button>
    </div>
  );
}
