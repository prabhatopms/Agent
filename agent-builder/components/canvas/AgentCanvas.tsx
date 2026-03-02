"use client";

import { CanvasHeader } from "./CanvasHeader";

export function AgentCanvas() {
  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", background: "#F4F5F7" }}>
      <CanvasHeader />
      {/* Canvas body — empty for now */}
      <div style={{ flex: 1 }} />
    </div>
  );
}
