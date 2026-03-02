"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ExplorerPanel } from "@/components/explorer/ExplorerPanel";
import { AgentCanvas } from "@/components/canvas/AgentCanvas";
import { InspectorPanel } from "@/components/inspector/InspectorPanel";
import { LeftIconRail } from "./LeftIconRail";

export function ResizablePanels() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Fixed 48px icon rail — not resizable */}
      <LeftIconRail />

      {/* Resizable Explorer / Canvas / Inspector */}
      <ResizablePanelGroup
        orientation="horizontal"
        className="flex-1 overflow-hidden"
      >
        {/* Left: Explorer */}
        <ResizablePanel
          defaultSize={18}
          minSize={14}
          maxSize={28}
          className="min-w-[220px]"
        >
          <ExplorerPanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Center: Canvas */}
        <ResizablePanel defaultSize={52} minSize={30}>
          <AgentCanvas />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Inspector — 500px min to match Figma */}
        <ResizablePanel
          defaultSize={27}
          minSize={22}
          maxSize={44}
          className="min-w-[500px]"
        >
          <InspectorPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
