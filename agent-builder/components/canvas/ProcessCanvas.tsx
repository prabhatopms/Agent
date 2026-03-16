"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ProcessCanvas — Agentic Process BPMN designer view.
// ─────────────────────────────────────────────────────────────────────────────

import ReactFlow, {
  Background,
  Controls,
  BackgroundVariant,
  Node,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { ZoomIn, ZoomOut, Maximize2, Undo2, Redo2, Download, Upload } from "lucide-react";
import { StartEventNode, EndEventNode, ServiceTaskNode, UserTaskNode, GatewayNode } from "./nodes/BpmnNodes";
import { AgentActionNode } from "./nodes/AgentActionNode";
import { useSolutionStore } from "@/state/solutionStore";

const NODE_TYPES: NodeTypes = {
  startEvent: StartEventNode,
  endEvent: EndEventNode,
  serviceTask: ServiceTaskNode,
  userTask: UserTaskNode,
  gateway: GatewayNode,
  agentAction: AgentActionNode,
};

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function ProcessToolbar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleExport = () => {
    alert(`<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <process id="CustomerSupport" isExecutable="true">
    <startEvent id="start" />
    <serviceTask id="classify" name="Classify Intent" />
    <exclusiveGateway id="gateway" name="Intent?" />
    <serviceTask id="fetch-order" name="Fetch Order Details" />
    <serviceTask id="agent-action" name="Customer Support Agent" />
    <serviceTask id="create-ticket" name="Create Ticket" />
    <endEvent id="end-resolved" name="Resolved" />
    <endEvent id="end-escalated" name="Escalated" />
  </process>
</definitions>`);
  };

  const handleImport = () => {
    const xml = prompt("Paste BPMN XML:");
    if (xml) alert("Import successful (simulated)");
  };

  const btnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    border: "none",
    background: "none",
    borderRadius: 4,
    cursor: "pointer",
    color: "#526069",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "#FFFFFF",
        border: "1px solid #CFD8DD",
        borderRadius: 6,
        padding: "4px 6px",
        boxShadow: "0 1px 4px #0000001A",
      }}
    >
      <button style={btnStyle} title="Undo"><Undo2 size={13} /></button>
      <button style={btnStyle} title="Redo"><Redo2 size={13} /></button>
      <div style={{ width: 1, height: 16, background: "#CFD8DD", margin: "0 4px" }} />
      <button style={btnStyle} title="Fit View" onClick={() => fitView({ padding: 0.25 })}><Maximize2 size={13} /></button>
      <button style={btnStyle} title="Zoom In" onClick={() => zoomIn()}><ZoomIn size={13} /></button>
      <button style={btnStyle} title="Zoom Out" onClick={() => zoomOut()}><ZoomOut size={13} /></button>
      <div style={{ width: 1, height: 16, background: "#CFD8DD", margin: "0 4px" }} />
      <button
        onClick={handleExport}
        style={{ ...btnStyle, width: "auto", gap: 4, padding: "0 6px", fontSize: 12, fontFamily: "'Noto Sans', system-ui, sans-serif", color: "#526069" }}
      >
        <Download size={12} /> Export XML
      </button>
      <button
        onClick={handleImport}
        style={{ ...btnStyle, width: "auto", gap: 4, padding: "0 6px", fontSize: 12, fontFamily: "'Noto Sans', system-ui, sans-serif", color: "#526069" }}
      >
        <Upload size={12} /> Import XML
      </button>
    </div>
  );
}

// ─── Inner canvas (needs ReactFlowProvider context) ────────────────────────────
function ProcessCanvasInner() {
  const storeNodes = useSolutionStore((s) => s.processCanvasNodes);
  const storeEdges = useSolutionStore((s) => s.processCanvasEdges);
  const updateProcessCanvasNodes = useSolutionStore((s) => s.updateProcessCanvasNodes);
  const updateProcessCanvasEdges = useSolutionStore((s) => s.updateProcessCanvasEdges);
  const selectProcessNode = useSolutionStore((s) => s.selectProcessNode);

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, , onEdgesChange] = useEdgesState(storeEdges);

  const handleNodesChange = (changes: Parameters<typeof onNodesChange>[0]) => {
    onNodesChange(changes);
    setNodes((nds) => {
      updateProcessCanvasNodes(nds);
      return nds;
    });
  };

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    selectProcessNode(node.id, node.type ?? "");
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#F4F5F7" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        proOptions={{ hideAttribution: true }}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#CFD8DD" />
        <Controls
          showInteractive={false}
          style={{
            background: "#FFFFFF",
            border: "1px solid #CFD8DD",
            borderRadius: 6,
            boxShadow: "0 1px 4px #0000001A",
          }}
        />
        <ProcessToolbar />
      </ReactFlow>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function ProcessCanvas() {
  return (
    <ReactFlowProvider>
      <ProcessCanvasInner />
    </ReactFlowProvider>
  );
}
