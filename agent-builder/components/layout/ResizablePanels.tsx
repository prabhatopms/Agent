"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ExplorerPanel } from "@/components/explorer/ExplorerPanel";
import { AgentCanvas } from "@/components/canvas/AgentCanvas";
import { InspectorPanel } from "@/components/inspector/InspectorPanel";

export function ResizablePanels() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="flex-1 overflow-hidden"
    >
      {/* Left: Explorer */}
      <ResizablePanel
        defaultSize={18}
        minSize={14}
        maxSize={28}
        className="min-w-[240px]"
      >
        <ExplorerPanel />
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Center: Canvas */}
      <ResizablePanel defaultSize={52} minSize={30}>
        <AgentCanvas />
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right: Inspector */}
      <ResizablePanel
        defaultSize={30}
        minSize={24}
        maxSize={42}
        className="min-w-[360px]"
      >
        <InspectorPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
