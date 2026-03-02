"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import {
  Bot,
  AlertTriangle,
  Plus,
  Settings,
  Link,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSolutionStore } from "@/state/solutionStore";

interface AgentNodeData {
  label: string;
  agentId: string;
  status: "active" | "draft" | "error" | "running";
  hasWarning?: boolean;
  escalationCount?: number;
  contextCount?: number;
  toolCount?: number;
}

// Connector positions match Figma (% of 288px card width): 21%, 50%, 78%
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
  const { solution, selectCanvasNode } = useSolutionStore();
  const agent = solution.agents.find((a) => a.id === data.agentId);
  const hasMissingModel = !agent?.model;

  return (
    <div
      className="relative cursor-pointer group/node"
      style={{ width: 288 }}
      onClick={() => selectCanvasNode(id)}
    >
      {/* Top connection handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-muted-foreground/30 !border-2 !border-background"
      />

      {/* ── Card ────────────────────────────────────────────────── */}
      <div
        className={cn(
          "bg-background border rounded-xl shadow-md transition-all duration-150",
          selected
            ? "border-violet-500 shadow-lg shadow-violet-500/15"
            : "border-border hover:border-violet-300 hover:shadow-lg"
        )}
      >
        <div
          className={cn(
            "flex items-start gap-2.5 px-3 pt-3 pb-3 rounded-xl",
            selected ? "bg-violet-50/60 dark:bg-violet-950/20" : "bg-transparent"
          )}
        >
          {/* Robot icon */}
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
              selected ? "bg-violet-600" : "bg-violet-100 dark:bg-violet-900/60"
            )}
          >
            <Bot
              className={cn(
                selected ? "text-white" : "text-violet-600 dark:text-violet-400"
              )}
              style={{ width: 18, height: 18 }}
            />
          </div>

          {/* Name + subtitle */}
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-foreground leading-snug truncate">
              {data.label}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Agent</div>
          </div>

          {/* Right-side indicators */}
          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
            {(data.escalationCount ?? 0) > 0 && (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white leading-none">
                  {data.escalationCount}
                </span>
              </div>
            )}
            {(data.hasWarning || hasMissingModel) && (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            {/* Hover actions */}
            <div className="opacity-0 group-hover/node:opacity-100 flex items-center gap-0.5 transition-opacity">
              <button
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted"
                onClick={(e) => e.stopPropagation()}
                title="Settings"
              >
                <Settings className="w-3 h-3 text-muted-foreground" />
              </button>
              <button
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted"
                onClick={(e) => e.stopPropagation()}
                title="Copy link"
              >
                <Link className="w-3 h-3 text-muted-foreground" />
              </button>
              <button
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted"
                onClick={(e) => e.stopPropagation()}
                title="More actions"
              >
                <MoreVertical className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Connectors below card ───────────────────────────────── */}
      {/* Each: vertical line from card bottom + label + circle add button */}
      <div className="relative" style={{ height: 96 }}>
        {CONNECTORS.map((c) => (
          <div
            key={c.label}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${c.pct}%`, transform: "translateX(-50%)" }}
          >
            {/* Vertical line */}
            <div
              className="w-px bg-border/70"
              style={{ height: 96 }}
            />
            {/* Label — floated near top of line */}
            <span
              className="absolute text-[10px] text-muted-foreground whitespace-nowrap"
              style={{ top: 14 }}
            >
              {c.label}
            </span>
            {/* Circle add button */}
            <button
              className={cn(
                "absolute w-8 h-8 rounded-full border border-border bg-background",
                "flex items-center justify-center",
                "hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors",
                "opacity-50 group-hover/node:opacity-100"
              )}
              style={{ top: 54 }}
              onClick={(e) => e.stopPropagation()}
              title={`Add ${c.label}`}
            >
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom source handle at end of connector section */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-muted-foreground/30 !border-2 !border-background"
      />
    </div>
  );
});
