"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Trash2, MoreHorizontal } from "lucide-react";
import { useSolutionStore } from "@/state/solutionStore";

interface ContextNodeData {
  label: string;
}

// Document/list icon representing structured context data
function ContextIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="7" y="5" width="22" height="26" rx="2" stroke="#273139" strokeWidth="1.5" />
      <line x1="12" y1="13" x2="24" y2="13" stroke="#273139" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="18" x2="24" y2="18" stroke="#273139" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="23" x2="20" y2="23" stroke="#273139" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export const ContextNode = memo(function ContextNode({
  data,
  selected,
  id,
}: NodeProps<ContextNodeData>) {
  const { selectCanvasNode } = useSolutionStore();

  const borderColor = selected ? "#0067DF" : "#CFD8DD";
  const bg = selected ? "#FFFFFF" : "#FFFFFF";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
      className="group/ctx"
      onClick={() => selectCanvasNode(id)}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      {/* Hover action bar above card */}
      <div
        className="opacity-0 group-hover/ctx:opacity-100"
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 4,
          background: "#FFFFFF",
          border: "1px solid #CFD8DD",
          borderRadius: 6,
          padding: "4px 6px",
          boxShadow: "0 1px 4px #0000001A",
          transition: "opacity 0.15s",
        }}
      >
        <button
          style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            borderRadius: 4,
          }}
          onClick={(e) => e.stopPropagation()}
          title="Delete"
        >
          <Trash2 style={{ width: 14, height: 14, color: "#526069" }} />
        </button>
        <button
          style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            borderRadius: 4,
          }}
          onClick={(e) => e.stopPropagation()}
          title="More"
        >
          <MoreHorizontal style={{ width: 14, height: 14, color: "#526069" }} />
        </button>
      </div>

      {/* Square card */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 8,
          border: `${selected ? 2 : 1}px solid ${borderColor}`,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: selected
            ? "0 0 0 2px #0067DF33, 0 2px 8px #0000001A"
            : "0 1px 4px #0000001A",
        }}
      >
        <ContextIcon />
      </div>

      {/* Label */}
      <div
        style={{
          marginTop: 6,
          fontFamily: "'Noto Sans', system-ui, sans-serif",
          fontSize: 13,
          color: "#526069",
          lineHeight: "20px",
          whiteSpace: "nowrap",
        }}
      >
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
});
