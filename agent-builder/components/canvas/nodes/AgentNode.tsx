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
}

const CONNECTORS = [
  { label: "Escalations", pct: 21, handleId: "escalations", canAdd: false },
  { label: "Context",     pct: 50, handleId: "context",     canAdd: true  },
  { label: "Tools",       pct: 78, handleId: "tools",       canAdd: false },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Agent icon (robot silhouette matching Figma)
// ─────────────────────────────────────────────────────────────────────────────
function AgentIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="5" y="16" width="30" height="18" rx="5" stroke="#273139" strokeWidth="1.5" />
      <circle cx="14" cy="25" r="2.5" fill="#273139" />
      <circle cx="26" cy="25" r="2.5" fill="#273139" />
      <path d="M15 30h10" stroke="#273139" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 16v-5" stroke="#273139" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="9" r="2.5" stroke="#273139" strokeWidth="1.5" />
      <path d="M5 25H3M37 25h-2" stroke="#273139" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AgentNode
// ─────────────────────────────────────────────────────────────────────────────
export const AgentNode = memo(function AgentNode({
  data,
  selected,
  id,
}: NodeProps<AgentNodeData>) {
  const selectCanvasNode = useSolutionStore((s) => s.selectCanvasNode);
  const addChildNode = useSolutionStore((s) => s.addChildNode);

  const borderColor = selected ? "#0067DF" : "#A4B1B8";

  return (
    <div
      style={{ width: 288, cursor: "pointer" }}
      onClick={() => selectCanvasNode(id)}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      {/* ── Wide card ────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          height: 96,
          borderRadius: 16,
          border: `2px solid ${borderColor}`,
          background: "#FFFFFF",
          overflow: "hidden",
          boxShadow: "0 2px 4px #0000000D",
        }}
      >
        {/* Left: gradient icon panel */}
        <div
          style={{
            width: 92,
            background:
              "linear-gradient(233.664deg, rgba(236,211,255,0.4) 10.959%, rgba(211,229,255,0.4) 85.569%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AgentIcon />
        </div>

        {/* Right: text content */}
        <div
          style={{
            flex: 1,
            padding: "12px 12px 12px 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            minWidth: 0,
          }}
        >
          {data.hasWarning && (
            <div style={{ position: "absolute", top: 8, right: 8 }}>
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
              fontSize: 12,
              color: "#273139",
              lineHeight: "16px",
              marginBottom: 6,
            }}
          >
            Agent
          </div>

          {/* Health chip */}
          {data.healthPct !== undefined && (
            <div
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                background: "#FFF0F1",
                borderRadius: 2,
                padding: "3px 8px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Noto Sans', system-ui, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#A6040A",
                  lineHeight: "16px",
                }}
              >
                {data.healthPct}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Port arms (Escalations / Context / Tools) ─────────────── */}
      <div style={{ position: "relative", height: 108 }}>
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
            {/* Dashed vertical arm line */}
            <div
              style={{
                width: 0,
                height: 68,
                borderLeft: "1.5px dashed #A4B1B8",
              }}
            />

            {/* Port label chip — floats near top of line */}
            <span
              style={{
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "'Noto Sans', system-ui, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#526069",
                background: "#F4F5F7",
                padding: "2px 5px",
                borderRadius: 2,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {c.label}
            </span>

            {/* "+" add button — bottom of arm */}
            <button
              disabled={!c.canAdd}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: `1.5px solid ${c.canAdd ? "#A4B1B8" : "#D8DFE3"}`,
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: c.canAdd ? "pointer" : "default",
                flexShrink: 0,
                boxShadow: c.canAdd ? "0 1px 3px #0000000D" : "none",
                marginTop: 4,
                opacity: c.canAdd ? 1 : 0.35,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (c.canAdd) addChildNode(id, c.handleId);
              }}
              title={c.canAdd ? `Add ${c.label}` : undefined}
            >
              <Plus style={{ width: 14, height: 14, color: c.canAdd ? "#526069" : "#A4B1B8" }} />
            </button>
          </div>
        ))}

        {/* Invisible source handles — one per port, at bottom of node */}
        {CONNECTORS.map((c) => (
          <Handle
            key={c.handleId}
            type="source"
            position={Position.Bottom}
            id={c.handleId}
            style={{
              left: `${c.pct}%`,
              bottom: 0,
              transform: "translateX(-50%)",
              opacity: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
});
