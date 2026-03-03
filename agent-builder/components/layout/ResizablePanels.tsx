"use client";

import { useRef, useState, useCallback } from "react";
import { ExplorerPanel } from "@/components/explorer/ExplorerPanel";
import { AgentCanvas } from "@/components/canvas/AgentCanvas";
import { InspectorPanel } from "@/components/inspector/InspectorPanel";
import { LeftIconRail } from "./LeftIconRail";
import { RightIconRail } from "./RightIconRail";

// ─── Constraints ──────────────────────────────────────────────────────────────
const EXPLORER_MIN_PX = 160;
const EXPLORER_MAX_PX = 480;
const INSPECTOR_MIN_PX = 200;
const INSPECTOR_MAX_PX = 600;

// ─── DragHandle ───────────────────────────────────────────────────────────────
// Uses pointer-capture — the drag never drops even if the pointer leaves the element.
function DragHandle({ onDelta }: { onDelta: (delta: number) => void }) {
  const startX = useRef<number | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      (e.target as HTMLDivElement).setPointerCapture(e.pointerId);
      startX.current = e.clientX;
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (startX.current === null) return;
      const delta = e.clientX - startX.current;
      startX.current = e.clientX;
      onDelta(delta);
    },
    [onDelta]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      (e.target as HTMLDivElement).releasePointerCapture(e.pointerId);
      startX.current = null;
    },
    []
  );

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        width: 4,
        height: "100%",
        flexShrink: 0,
        cursor: "col-resize",
        borderLeft: "1px solid #CFD8DD",
        position: "relative",
        zIndex: 10,
      }}
    />
  );
}

// ─── ResizablePanels ──────────────────────────────────────────────────────────
export function ResizablePanels() {
  const [explorerW, setExplorerW] = useState(280);
  const [inspectorW, setInspectorW] = useState(320);

  const onLeftDelta = useCallback((delta: number) => {
    setExplorerW((w) =>
      Math.max(EXPLORER_MIN_PX, Math.min(EXPLORER_MAX_PX, w + delta))
    );
  }, []);

  const onRightDelta = useCallback((delta: number) => {
    setInspectorW((w) =>
      Math.max(INSPECTOR_MIN_PX, Math.min(INSPECTOR_MAX_PX, w - delta))
    );
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr 48px",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <LeftIconRail />

      {/* Explorer | handle | Canvas | handle | Inspector */}
      <div
        style={{
          display: "flex",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: explorerW,
            minWidth: EXPLORER_MIN_PX,
            maxWidth: EXPLORER_MAX_PX,
            flexShrink: 0,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <ExplorerPanel />
        </div>

        <DragHandle onDelta={onLeftDelta} />

        <div style={{ flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>
          <AgentCanvas />
        </div>

        <DragHandle onDelta={onRightDelta} />

        <div
          style={{
            width: inspectorW,
            minWidth: INSPECTOR_MIN_PX,
            maxWidth: INSPECTOR_MAX_PX,
            flexShrink: 0,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <InspectorPanel />
        </div>
      </div>

      <RightIconRail />
    </div>
  );
}
