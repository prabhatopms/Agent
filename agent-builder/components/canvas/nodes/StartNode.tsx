"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Play } from "lucide-react";

export const StartNode = memo(function StartNode({ selected }: NodeProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md border-2 border-emerald-400"
        style={{ boxShadow: selected ? "0 0 0 3px rgba(16,185,129,0.3)" : undefined }}
      >
        <Play className="w-4 h-4 text-white fill-white" />
      </div>
      <span className="text-[10px] text-muted-foreground font-medium">Start</span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-emerald-400 !border-2 !border-background"
      />
    </div>
  );
});
