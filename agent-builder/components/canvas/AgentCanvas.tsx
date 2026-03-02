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
import { ContextNode } from "./nodes/ContextNode";
import { CanvasHeader } from "./CanvasHeader";

const NODE_TYPES: NodeTypes = {
  agentNode: AgentNode,
  contextNode: ContextNode,
};

function CanvasInner() {
  const { solution, selectedNodeId, selectCanvasNode, updateCanvasNodes } =
    useSolutionStore();
  const [activeTab, setActiveTab] = useState<"form" | "canvas">("canvas");
  const { nodes, edges } = solution.canvasGraph;

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => selectCanvasNode(node.id),
    [selectCanvasNode]
  );
  const onPaneClick = useCallback(() => selectCanvasNode(null), [selectCanvasNode]);

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
      <CanvasHeader />

      <div style={{ flex: 1, position: "relative", background: "#F4F5F7" }}>
        {/* Form / Canvas segmented control — top right of canvas */}
        <div style={{ position: "absolute", top: 12, right: 16, zIndex: 10 }}>
          <div style={{
            display: "flex",
            background: "#E4E8EB",
            borderRadius: 8,
            padding: 4,
            gap: 2,
          }}>
            {(["Form", "Canvas"] as const).map((tab) => {
              const isActive = activeTab === tab.toLowerCase();
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase() as "form" | "canvas")}
                  style={{
                    padding: "4px 14px",
                    height: 26,
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Noto Sans', system-ui, sans-serif",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#0067DF" : "#526069",
                    background: isActive ? "#FFFFFF" : "transparent",
                    boxShadow: isActive ? "0 1px 3px #00000014" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "form" ? (
          <div style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 13,
            color: "#526069",
          }}>
            Form view is not available in this prototype.
          </div>
        ) : (
          <ReactFlow
            nodes={nodes.map((n) => ({ ...n, selected: n.id === selectedNodeId }))}
            edges={edges}
            nodeTypes={NODE_TYPES}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onNodesChange={(changes) => {
              const updated = nodes.map((n) => {
                const c = changes.find((ch) => ch.type === "position" && ch.id === n.id);
                if (c && c.type === "position" && c.position) return { ...n, position: c.position };
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
              style: { stroke: "#A4B1B8", strokeWidth: 1.5 },
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="#CFD8DD"
            />
            <Controls
              showInteractive={false}
              style={{
                background: "#FFFFFF",
                border: "1px solid #CFD8DD",
                borderRadius: 6,
                boxShadow: "0 1px 4px #0000001A",
              }}
            />
          </ReactFlow>
        )}
      </div>
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
