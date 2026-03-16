"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ProcessCanvas — Agentic Process BPMN designer view.
// Ported from uipath-studio/components/canvas/BpmnCanvas.tsx and adapted to
// use agent-builder's Zustand store (useSolutionStore) and design tokens.
// ─────────────────────────────────────────────────────────────────────────────

import ReactFlow, {
  Background,
  Controls,
  BackgroundVariant,
  Node,
  Edge,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { ZoomIn, ZoomOut, Maximize2, Undo2, Redo2, Download, Upload } from "lucide-react";
import { StartEventNode, EndEventNode, ServiceTaskNode, UserTaskNode, GatewayNode } from "./nodes/BpmnNodes";
import { AgentActionNode } from "./nodes/AgentActionNode";

const NODE_TYPES: NodeTypes = {
  startEvent: StartEventNode,
  endEvent: EndEventNode,
  serviceTask: ServiceTaskNode,
  userTask: UserTaskNode,
  gateway: GatewayNode,
  agentAction: AgentActionNode,
};

// ─── Default diagram ──────────────────────────────────────────────────────────
// Matches real UiPath agentic process pattern:
// Start → Classify Intent → Intent? gateway
//   → Order path:     Fetch Order Details → [Agent Action: Customer Support Agent] → End: Resolved
//   → Complaint path: Create Ticket → End: Escalated
const INITIAL_NODES: Node[] = [
  {
    id: "start",
    type: "startEvent",
    position: { x: 60, y: 200 },
    data: { label: "Start" },
  },
  {
    id: "classify",
    type: "serviceTask",
    position: { x: 160, y: 180 },
    data: { label: "Classify Intent" },
  },
  {
    id: "gateway",
    type: "gateway",
    position: { x: 370, y: 186 },
    data: { label: "Intent?" },
  },
  {
    id: "fetch-order",
    type: "serviceTask",
    position: { x: 490, y: 100 },
    data: { label: "Fetch Order Details" },
  },
  {
    id: "agent-action",
    type: "agentAction",
    position: { x: 700, y: 90 },
    data: { agentName: "Customer Support Agent" },
  },
  {
    id: "create-ticket",
    type: "serviceTask",
    position: { x: 490, y: 270 },
    data: { label: "Create Ticket" },
  },
  {
    id: "end-resolved",
    type: "endEvent",
    position: { x: 990, y: 113 },
    data: { label: "Resolved", variant: "green" },
  },
  {
    id: "end-escalated",
    type: "endEvent",
    position: { x: 700, y: 283 },
    data: { label: "Escalated", variant: "red" },
  },
];

const EDGE_STYLE = { stroke: "#A4B1B8", strokeWidth: 1.5 };
const LABEL_STYLE = { fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 11, fill: "#526069" };
const LABEL_BG_STYLE = { fill: "#F4F5F7" };

const INITIAL_EDGES: Edge[] = [
  { id: "e-start-classify",    source: "start",       target: "classify",      style: EDGE_STYLE },
  { id: "e-classify-gateway",  source: "classify",    target: "gateway",       style: EDGE_STYLE },
  {
    id: "e-gateway-fetch",
    source: "gateway", sourceHandle: "right",
    target: "fetch-order",
    label: "Order",
    style: EDGE_STYLE,
    labelStyle: LABEL_STYLE,
    labelBgStyle: LABEL_BG_STYLE,
  },
  {
    id: "e-gateway-ticket",
    source: "gateway", sourceHandle: "bottom",
    target: "create-ticket",
    label: "Complaint",
    style: EDGE_STYLE,
    labelStyle: LABEL_STYLE,
    labelBgStyle: LABEL_BG_STYLE,
  },
  { id: "e-fetch-agent",     source: "fetch-order",   target: "agent-action",  style: EDGE_STYLE },
  { id: "e-agent-resolved",  source: "agent-action",  target: "end-resolved",  style: EDGE_STYLE },
  { id: "e-ticket-escalated", source: "create-ticket", target: "end-escalated", style: EDGE_STYLE },
];

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
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#F4F5F7" }}>
      <ReactFlow
        nodes={INITIAL_NODES}
        edges={INITIAL_EDGES}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        proOptions={{ hideAttribution: true }}
        onNodesChange={() => {}}
        onEdgesChange={() => {}}
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
