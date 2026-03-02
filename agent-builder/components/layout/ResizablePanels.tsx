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
import { RightIconRail } from "./RightIconRail";

export function ResizablePanels() {
  return (
    /*
     * 3-column grid:
     *   col 1 — LeftIconRail   (48px fixed)
     *   col 2 — resizable panes (1fr)
     *   col 3 — RightIconRail  (48px fixed)
     */
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr 48px",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <LeftIconRail />

      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={20} minSize={14} maxSize={30}>
          <ExplorerPanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={53} minSize={28}>
          <AgentCanvas />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={27} minSize={18} maxSize={50}>
          <InspectorPanel />
        </ResizablePanel>
      </ResizablePanelGroup>

      <RightIconRail />
    </div>
  );
}
