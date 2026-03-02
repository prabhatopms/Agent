"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MousePointerClick,
  RotateCcw,
  Save,
  AlertCircle,
  Info,
} from "lucide-react";
import { useSolutionStore, selectSelectedAgent } from "@/state/solutionStore";
import { INSPECTOR_SECTIONS } from "@/config/inspectorSections";
import { SectionRenderer } from "./SectionRenderer";
import { NewContextPanel } from "./NewContextPanel";
import { cn } from "@/lib/utils";

export function InspectorPanel() {
  const {
    selectedAgentId,
    selectedCanvasNodeType,
    isDirty,
    validationErrors,
    applyAgentChanges,
    resetAgentChanges,
  } = useSolutionStore();

  const agent = useSolutionStore(selectSelectedAgent);
  const hasErrors = Object.keys(validationErrors).length > 0;

  if (selectedCanvasNodeType === "contextNode") {
    return <NewContextPanel />;
  }

  if (!selectedAgentId || !agent) {
    return <EmptyInspector />;
  }

  return (
    <div className="h-full flex flex-col border-l border-border bg-background">
      {/* Inspector header */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-foreground">New Agent</h2>
          {isDirty && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[11px] gap-1 text-muted-foreground"
                onClick={resetAgentChanges}
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </Button>
              <Button
                size="sm"
                className={cn(
                  "h-6 px-2.5 text-[11px] gap-1",
                  hasErrors
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-violet-600 hover:bg-violet-700 text-white"
                )}
                onClick={applyAgentChanges}
              >
                <Save className="w-3 h-3" />
                Apply
              </Button>
            </div>
          )}
        </div>
        {hasErrors && isDirty && (
          <p className="flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 mt-1.5">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {Object.keys(validationErrors).length} validation error
            {Object.keys(validationErrors).length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Sections */}
      <ScrollArea className="flex-1">
        <div className="pb-10">
          {INSPECTOR_SECTIONS.sort((a, b) => a.order - b.order).map(
            (section, idx) => (
              <div key={section.id}>
                {idx > 0 && <Separator className="mx-0" />}
                <SectionRenderer section={section} agent={agent} />
              </div>
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function EmptyInspector() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 border-l border-border text-center px-6">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <MousePointerClick className="w-5 h-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[13px] font-semibold text-foreground mb-1">
          No node selected
        </p>
        <p className="text-[12px] text-muted-foreground">
          Click an agent node on the canvas to configure its properties.
        </p>
      </div>
    </div>
  );
}
