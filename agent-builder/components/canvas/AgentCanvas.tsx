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
import { ExecutionTrailPanel } from "./ExecutionTrailPanel";

const NODE_TYPES: NodeTypes = {
  agentNode: AgentNode,
  contextNode: ContextNode,
};

function CanvasInner() {
  const nodes = useSolutionStore((s) => s.solution.canvasGraph.nodes);
  const edges = useSolutionStore((s) => s.solution.canvasGraph.edges);
  const selectedNodeId = useSolutionStore((s) => s.selectedNodeId);
  const selectCanvasNode = useSolutionStore((s) => s.selectCanvasNode);
  const updateCanvasNodes = useSolutionStore((s) => s.updateCanvasNodes);
  const trailPanelOpen = useSolutionStore((s) => s.trailPanelOpen);
  const isDebugMode = useSolutionStore((s) => s.isDebugMode);
  const isRunning = useSolutionStore((s) => s.isRunning);
  const exitDebugMode = useSolutionStore((s) => s.exitDebugMode);
  const [activeTab, setActiveTab] = useState<"form" | "canvas">("canvas");

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => selectCanvasNode(node.id),
    [selectCanvasNode]
  );
  const onPaneClick = useCallback(() => selectCanvasNode(null), [selectCanvasNode]);

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <CanvasHeader />

      <div style={{ flex: 1, minHeight: 0, position: "relative", background: "#F4F5F7" }}>
        {/* Debug mode overlays */}
        {isDebugMode && (
          <>
            {/* Score bar — top left */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#FFFFFF",
                border: "1px solid #CFD8DD",
                borderRadius: 6,
                padding: "4px 10px",
                boxShadow: "0 1px 4px #0000001A",
              }}
            >
              <span
                style={{
                  fontFamily: "'Noto Sans', system-ui, sans-serif",
                  fontSize: 12,
                  color: "#273139",
                  fontWeight: 600,
                }}
              >
                Score: NA
              </span>
              <div
                style={{
                  width: 72,
                  height: 4,
                  background: "#CFD8DD",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "0%", height: "100%", background: "#0067DF" }} />
              </div>
              <span
                style={{
                  fontFamily: "'Noto Sans', system-ui, sans-serif",
                  fontSize: 12,
                  color: "#526069",
                }}
              >
                0%
              </span>
            </div>

            {/* Back to design mode — top center, only when not actively running */}
            {!isRunning && (
              <button
                onClick={exitDebugMode}
                style={{
                  position: "absolute",
                  top: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#FFFFFF",
                  border: "1px solid #CFD8DD",
                  borderRadius: 6,
                  padding: "4px 12px",
                  cursor: "pointer",
                  boxShadow: "0 1px 4px #0000001A",
                  fontFamily: "'Noto Sans', system-ui, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#273139",
                }}
              >
                ← Back to design mode
              </button>
            )}
          </>
        )}

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
            position: "absolute",
            inset: 0,
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
            style={{ position: "absolute", inset: 0 }}
            nodes={nodes.map((n) => ({ ...n, selected: n.id === selectedNodeId }))}
            edges={edges}
            nodeTypes={NODE_TYPES}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onNodesChange={(changes) => {
              const posChanges = changes.filter(
                (ch): ch is { type: "position"; id: string; position: { x: number; y: number } } =>
                  ch.type === "position" && !!ch.position
              );
              if (posChanges.length === 0) return;
              const updated = nodes.map((n) => {
                const c = posChanges.find((ch) => ch.id === n.id);
                return c ? { ...n, position: c.position } : n;
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

      {trailPanelOpen && <ExecutionTrailPanel />}
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
