"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  BackgroundVariant,
  NodeTypes,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSolutionStore } from "@/state/solutionStore";
import { AgentNode } from "./nodes/AgentNode";
import { CanvasEmptyState } from "./CanvasEmptyState";
import { CanvasToolbar } from "./CanvasToolbar";
import { cn } from "@/lib/utils";

const NODE_TYPES: NodeTypes = {
  agentNode: AgentNode,
};

function CanvasInner() {
  const {
    solution,
    selectedNodeId,
    selectCanvasNode,
    updateCanvasNodes,
  } = useSolutionStore();

  const [activeTab, setActiveTab] = useState<"canvas" | "form">("canvas");

  const { nodes, edges } = solution.canvasGraph;

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      selectCanvasNode(node.id);
    },
    [selectCanvasNode]
  );

  const onPaneClick = useCallback(() => {
    selectCanvasNode(null);
  }, [selectCanvasNode]);

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Form / Canvas tab bar */}
      <div className="shrink-0 flex items-end border-b border-border px-4 gap-0 bg-background">
        {(["form", "canvas"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-[12px] font-medium capitalize border-b-2 transition-colors",
              activeTab === tab
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "form" ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-[13px]">
          Form view is not available in this prototype.
        </div>
      ) : (
        <div className="flex-1 relative">
          {nodes.length === 0 ? (
            <CanvasEmptyState />
          ) : (
            <>
              <CanvasToolbar />
              <ReactFlow
                nodes={nodes.map((n) => ({
                  ...n,
                  selected: n.id === selectedNodeId,
                }))}
                edges={edges}
                nodeTypes={NODE_TYPES}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onNodesChange={(changes) => {
                  const updated = nodes.map((n) => {
                    const change = changes.find(
                      (c) => c.type === "position" && c.id === n.id
                    );
                    if (change && change.type === "position" && change.position) {
                      return { ...n, position: change.position };
                    }
                    return n;
                  });
                  updateCanvasNodes(updated);
                }}
                onEdgesChange={() => {}}
                fitView
                fitViewOptions={{ padding: 0.4 }}
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{
                  type: "smoothstep",
                  style: { strokeWidth: 1.5, stroke: "hsl(var(--border))" },
                }}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={20}
                  size={1}
                  color="hsl(var(--muted-foreground) / 0.15)"
                />
                <Controls
                  className="!bg-background !border-border !shadow-sm"
                  showInteractive={false}
                />
              </ReactFlow>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function AgentCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
