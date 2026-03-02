"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import {
  Bot,
  AlertTriangle,
  BookOpen,
  Wrench,
  Plus,
  Settings,
  Link,
  MoreVertical,
  ArrowUpRight,
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
      className={cn(
        "relative bg-background border rounded-xl shadow-md cursor-pointer group/node",
        "transition-all duration-150",
        "min-w-[300px]",
        selected
          ? "border-violet-500 shadow-lg shadow-violet-500/15"
          : "border-border hover:border-violet-300 hover:shadow-lg"
      )}
      onClick={() => selectCanvasNode(id)}
    >
      {/* Top connection handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-muted-foreground/30 !border-2 !border-background"
      />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-start gap-2.5 px-3 pt-3 pb-2 rounded-t-[10px]",
          selected ? "bg-violet-50/60 dark:bg-violet-950/20" : "bg-transparent"
        )}
      >
        {/* Robot icon */}
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
            selected
              ? "bg-violet-600"
              : "bg-violet-100 dark:bg-violet-900/60"
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
          {/* Escalation badge */}
          {(data.escalationCount ?? 0) > 0 && (
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white leading-none">
                {data.escalationCount}
              </span>
            </div>
          )}

          {/* Warning triangle */}
          {(data.hasWarning || hasMissingModel) && (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}

          {/* Hover action buttons */}
          <div className="opacity-0 group-hover/node:opacity-100 flex items-center gap-0.5 transition-opacity">
            <button
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="Settings"
            >
              <Settings className="w-3 h-3 text-muted-foreground" />
            </button>
            <button
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="Copy link"
            >
              <Link className="w-3 h-3 text-muted-foreground" />
            </button>
            <button
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="More actions"
            >
              <MoreVertical className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Connector row ───────────────────────────────────────── */}
      <div className="border-t border-border/60 mx-1 mb-1 rounded-b-[8px] overflow-hidden">
        <div className="flex divide-x divide-border/60">
          <ConnectorCell
            label="Escalations"
            icon={<ArrowUpRight className="w-3 h-3" />}
            color="rose"
          />
          <ConnectorCell
            label="Context"
            icon={<BookOpen className="w-3 h-3" />}
            color="cyan"
          />
          <ConnectorCell
            label="Tools"
            icon={<Wrench className="w-3 h-3" />}
            color="emerald"
          />
        </div>
      </div>

      {/* Bottom connection handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-muted-foreground/30 !border-2 !border-background"
      />
    </div>
  );
});

// ─── Connector cell ───────────────────────────────────────────────────────────

const COLOR_MAP = {
  rose:    "hover:bg-rose-50    dark:hover:bg-rose-950/30    text-rose-500",
  cyan:    "hover:bg-cyan-50    dark:hover:bg-cyan-950/30    text-cyan-500",
  emerald: "hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-500",
};

function ConnectorCell({
  label,
  icon,
  color,
}: {
  label: string;
  icon: React.ReactNode;
  color: keyof typeof COLOR_MAP;
}) {
  return (
    <div
      className={cn(
        "flex-1 flex items-center justify-between px-2.5 py-2",
        "cursor-pointer group/conn transition-colors",
        COLOR_MAP[color]
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1.5">
        <span className="opacity-60">{icon}</span>
        <span className="text-[11px] font-medium text-foreground/70">{label}</span>
      </div>
      <button
        className={cn(
          "w-4 h-4 rounded-full border border-current flex items-center justify-center",
          "opacity-40 group-hover/conn:opacity-100 transition-opacity"
        )}
        title={`Add ${label}`}
      >
        <Plus className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}
