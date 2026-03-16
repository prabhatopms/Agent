"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Standard BPMN node shapes for the ProcessCanvas
// Ported from uipath-studio/components/canvas/BpmnCanvas.tsx and adapted to
// use agent-builder design tokens.
// ─────────────────────────────────────────────────────────────────────────────

import { NodeProps, Handle, Position } from "reactflow";
import { User, Settings } from "lucide-react";

const T = {
  border: "#CFD8DD",
  selected: "#0067DF",
  font: "'Noto Sans', system-ui, sans-serif",
  muted: "#526069",
  foreground: "#273139",
} as const;

// ─── Start Event ──────────────────────────────────────────────────────────────
export function StartEventNode({ selected }: NodeProps) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "#22C55E",
        border: selected ? `2px solid ${T.selected}` : "2px solid #16A34A",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <Handle type="source" position={Position.Right} style={{ background: T.border }} />
    </div>
  );
}

// ─── End Event ────────────────────────────────────────────────────────────────
export function EndEventNode({ data, selected }: NodeProps) {
  const isRed = data.variant === "red";
  const bg = isRed ? "#EF4444" : "#22C55E";
  const borderColor = isRed ? "#DC2626" : "#16A34A";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: bg,
          border: selected ? `3px solid ${T.selected}` : `3px solid ${borderColor}`,
          cursor: "pointer",
        }}
      >
        <Handle type="target" position={Position.Left} style={{ background: T.border }} />
      </div>
      {data.label && (
        <span style={{ fontFamily: T.font, fontSize: 11, color: T.muted, whiteSpace: "nowrap" }}>
          {data.label}
        </span>
      )}
    </div>
  );
}

// ─── Service Task ─────────────────────────────────────────────────────────────
export function ServiceTaskNode({ data, selected }: NodeProps) {
  return (
    <div
      style={{
        width: 140,
        height: 60,
        background: "#FFFFFF",
        border: selected ? `2px solid ${T.selected}` : `1.5px solid ${T.border}`,
        borderRadius: 6,
        boxShadow: "0 1px 4px #0000001A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 10px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: T.border }} />
      <Settings style={{ width: 12, height: 12, color: T.muted, marginBottom: 2 }} />
      <span
        style={{
          fontFamily: T.font,
          fontSize: 12,
          fontWeight: 600,
          color: T.foreground,
          textAlign: "center",
          lineHeight: "15px",
        }}
      >
        {data.label}
      </span>
      <Handle type="source" position={Position.Right} style={{ background: T.border }} />
    </div>
  );
}

// ─── User Task ────────────────────────────────────────────────────────────────
export function UserTaskNode({ data, selected }: NodeProps) {
  return (
    <div
      style={{
        width: 140,
        height: 60,
        background: "#FFFFFF",
        border: selected ? `2px solid ${T.selected}` : `1.5px solid ${T.border}`,
        borderRadius: 6,
        boxShadow: "0 1px 4px #0000001A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 10px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: T.border }} />
      <User style={{ width: 12, height: 12, color: T.muted, marginBottom: 2 }} />
      <span
        style={{
          fontFamily: T.font,
          fontSize: 12,
          fontWeight: 600,
          color: T.foreground,
          textAlign: "center",
          lineHeight: "15px",
        }}
      >
        {data.label}
      </span>
      <Handle type="source" position={Position.Right} style={{ background: T.border }} />
    </div>
  );
}

// ─── Exclusive Gateway ────────────────────────────────────────────────────────
export function GatewayNode({ data, selected }: NodeProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div
        style={{
          width: 48,
          height: 48,
          background: "#FEF3C7",
          border: selected ? `2px solid ${T.selected}` : "2px solid #F59E0B",
          transform: "rotate(45deg)",
          cursor: "pointer",
          boxShadow: "0 1px 4px #0000001A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ transform: "rotate(-45deg)", fontSize: 14, color: "#92400E", fontWeight: 700 }}>✕</span>
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: T.border, transform: "rotate(-45deg) translateY(50%)" }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={{ background: T.border, transform: "rotate(-45deg) translateX(-50%)" }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{ background: T.border, transform: "rotate(-45deg) translateY(-50%)" }}
        />
      </div>
      {data.label && (
        <span style={{ fontFamily: T.font, fontSize: 11, color: T.muted, whiteSpace: "nowrap" }}>
          {data.label}
        </span>
      )}
    </div>
  );
}
