"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Square } from "lucide-react";

export const EndNode = memo(function EndNode({ selected }: NodeProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-red-400 !border-2 !border-background"
      />
      <div
        className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-red-400"
        style={{ boxShadow: selected ? "0 0 0 3px rgba(239,68,68,0.3)" : undefined }}
      >
        <Square className="w-4 h-4 text-white fill-white" />
      </div>
      <span className="text-[10px] text-muted-foreground font-medium">End</span>
    </div>
  );
});
