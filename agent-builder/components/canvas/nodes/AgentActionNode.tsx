"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AgentActionNode — BPMN Service Task configured to invoke an agent.
// Styled as a lilac/white split card (mirrors AgentNode) to make it visually
// distinct from plain Service Tasks. Double-clicking navigates to the agent's
// Definition canvas via the explorer file browser.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { useSolutionStore } from "@/state/solutionStore";

const T = {
  border: "#CFD8DD",
  selected: "#0067DF",
  lilac: "#E8E4F7",
  purple: "#6D28D9",
  font: "'Noto Sans', system-ui, sans-serif",
  muted: "#526069",
  foreground: "#273139",
} as const;

// Robot SVG (matches AgentNode)
function RobotIcon({ size = 20, color = T.purple }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="8" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke={color} strokeWidth="1.5" />
      <circle cx="9" cy="14" r="1.5" fill={color} />
      <circle cx="15" cy="14" r="1.5" fill={color} />
      <path d="M9 18h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 3v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AgentActionNode({ data, selected }: NodeProps) {
  const [hovered, setHovered] = useState(false);

  const setCanvasMode = useSolutionStore((s) => s.setCanvasMode);
  const setSelectedExplorerNode = useSolutionStore((s) => s.setSelectedExplorerNode);
  const selectCanvasNode = useSolutionStore((s) => s.selectCanvasNode);

  const handleDoubleClick = () => {
    // Navigate to the agent's Definition canvas
    setCanvasMode("agent");
    setSelectedExplorerNode("sol-agent-def");
    selectCanvasNode("node-agent-1");
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={handleDoubleClick}
      style={{
        width: 220,
        background: "#FFFFFF",
        border: selected ? `2px solid ${T.selected}` : `1.5px solid ${T.border}`,
        borderRadius: 8,
        boxShadow: hovered
          ? "0 4px 12px #0000001F"
          : "0 1px 4px #0000001A",
        cursor: "pointer",
        overflow: "hidden",
        transition: "box-shadow 0.15s",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: T.border }} />

      <div style={{ display: "flex", height: 72 }}>
        {/* Left: lilac panel with robot icon */}
        <div
          style={{
            width: 60,
            background: T.lilac,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <RobotIcon size={24} color={T.purple} />
        </div>

        {/* Right: agent name + label */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 10px",
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontFamily: T.font,
              fontSize: 13,
              fontWeight: 600,
              color: T.foreground,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {data.agentName ?? "Customer Support Agent"}
          </span>
          <span
            style={{
              fontFamily: T.font,
              fontSize: 11,
              color: T.muted,
              marginTop: 2,
            }}
          >
            Agent Action
          </span>
        </div>
      </div>

      {/* Hover hint */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: "center",
            background: "rgba(255,255,255,0.92)",
            fontFamily: T.font,
            fontSize: 10,
            color: T.muted,
            padding: "2px 0 3px",
            borderTop: `1px solid ${T.border}`,
            pointerEvents: "none",
          }}
        >
          Double-click to open agent
        </div>
      )}

      <Handle type="source" position={Position.Right} style={{ background: T.border }} />
    </div>
  );
}
