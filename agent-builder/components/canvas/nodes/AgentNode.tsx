"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { AlertTriangle, Plus } from "lucide-react";
import { useSolutionStore } from "@/state/solutionStore";

interface AgentNodeData {
  label: string;
  agentId: string;
  status: "active" | "draft" | "error" | "running";
  hasWarning?: boolean;
  healthPct?: number;
  escalationCount?: number;
  contextCount?: number;
  toolCount?: number;
}

const CONNECTORS = [
  { label: "Escalations", pct: 21 },
  { label: "Context", pct: 50 },
  { label: "Tools", pct: 78 },
];

export const AgentNode = memo(function AgentNode({
  data,
  selected,
  id,
}: NodeProps<AgentNodeData>) {
  const { selectCanvasNode } = useSolutionStore();

  const borderColor = selected ? "#0067DF" : "#CFD8DD";
  const shadow = selected
    ? "0 0 0 2px #0067DF33, 0 2px 8px #0000001A"
    : "0 1px 4px #0000001A";

  return (
    <div
      style={{ width: 288, cursor: "pointer" }}
      className="group/node"
      onClick={() => selectCanvasNode(id)}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0 }}
      />

      {/* ── Card ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          height: 96,
          borderRadius: 8,
          border: `1px solid ${borderColor}`,
          boxShadow: shadow,
          background: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Left: icon panel */}
        <div
          style={{
            width: 72,
            background: "#EDE9FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* Bot SVG icon matching Figma */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="12" width="24" height="14" rx="4" stroke="#273139" strokeWidth="1.5" />
            <circle cx="12" cy="19" r="2" fill="#273139" />
            <circle cx="20" cy="19" r="2" fill="#273139" />
            <path d="M12 23h8" stroke="#273139" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 12V8" stroke="#273139" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="7" r="2" stroke="#273139" strokeWidth="1.5" />
            <path d="M4 18h-2M30 18h-2" stroke="#273139" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Right: content */}
        <div
          style={{
            flex: 1,
            padding: "12px 12px 12px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            minWidth: 0,
          }}
        >
          {/* Warning triangle — top-right */}
          {data.hasWarning && (
            <div style={{ position: "absolute", top: 10, right: 10 }}>
              <AlertTriangle style={{ width: 16, height: 16, color: "#FFB40E" }} />
            </div>
          )}

          <div
            style={{
              fontFamily: "'Noto Sans', system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              color: "#182027",
              marginBottom: 2,
              paddingRight: 20,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.label}
          </div>

          <div
            style={{
              fontFamily: "'Noto Sans', system-ui, sans-serif",
              fontSize: 13,
              color: "#526069",
              lineHeight: "20px",
              marginBottom: 4,
            }}
          >
            Agent
          </div>

          {/* Health % */}
          {data.healthPct !== undefined && (
            <div
              style={{
                fontFamily: "'Noto Sans', system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#E5173B",
                lineHeight: "16px",
              }}
            >
              {data.healthPct}%
            </div>
          )}
        </div>
      </div>

      {/* ── Connectors below card ─────────────────────────────────── */}
      <div style={{ position: "relative", height: 96 }}>
        {CONNECTORS.map((c) => (
          <div
            key={c.label}
            style={{
              position: "absolute",
              top: 0,
              left: `${c.pct}%`,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Vertical line */}
            <div style={{ width: 1, height: 96, background: "#CFD8DD" }} />
            {/* Label */}
            <span
              style={{
                position: "absolute",
                top: 12,
                fontFamily: "'Noto Sans', system-ui, sans-serif",
                fontSize: 11,
                color: "#526069",
                whiteSpace: "nowrap",
              }}
            >
              {c.label}
            </span>
            {/* Circle button */}
            <button
              style={{
                position: "absolute",
                top: 52,
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1px solid #CFD8DD",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={(e) => e.stopPropagation()}
              title={`Add ${c.label}`}
            >
              <Plus style={{ width: 14, height: 14, color: "#526069" }} />
            </button>
          </div>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0 }}
      />
    </div>
  );
});
