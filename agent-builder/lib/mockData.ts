// ─────────────────────────────────────────────────────────────────────────────
// Mock Data — seed state for the prototype
// ─────────────────────────────────────────────────────────────────────────────

import type { Solution, Agent, CanvasGraph, ExplorerNode } from "@/state/solutionStore";
import { Edge, Node } from "reactflow";

// ─── Explorer Tree ────────────────────────────────────────────────────────────

export const MOCK_EXPLORER_TREE: ExplorerNode[] = [
  // ── Solution tree (section: "solution") ────────────────────────────────────
  {
    id: "sol-root",
    type: "folder",
    label: "Solution",
    section: "solution",
    parentId: null,
    expanded: true,
    children: ["sol-agent-1", "sol-process-folder"],
  },
  {
    id: "sol-agent-1",
    type: "folder",
    label: "New Agent",
    section: "solution",
    parentId: "sol-root",
    expanded: true,
    children: ["sol-agent-def", "sol-agent-eval", "sol-agent-evals"],
    itemType: "agent",
    status: "active",
    agentId: "agent-1",
  },
  {
    id: "sol-agent-def",
    type: "item",
    label: "Definition",
    section: "solution",
    parentId: "sol-agent-1",
    expanded: false,
    children: [],
    itemType: "definition",
  },
  {
    id: "sol-agent-eval",
    type: "item",
    label: "Evaluation",
    section: "solution",
    parentId: "sol-agent-1",
    expanded: false,
    children: [],
    itemType: "evaluation",
  },
  {
    id: "sol-agent-evals",
    type: "item",
    label: "Evaluators",
    section: "solution",
    parentId: "sol-agent-1",
    expanded: false,
    children: [],
    itemType: "evaluators",
  },
  {
    id: "sol-process-folder",
    type: "folder",
    label: "Agentic process",
    section: "solution",
    parentId: "sol-root",
    expanded: true,
    children: ["sol-bpmn-1"],
    itemType: "process",
  },
  {
    id: "sol-bpmn-1",
    type: "item",
    label: "Invoice Processing.bpmn",
    section: "solution",
    parentId: "sol-process-folder",
    expanded: false,
    children: [],
    itemType: "bpmn",
  },

  // ── Resource list (section: "resources") ───────────────────────────────────
  {
    id: "res-apps",
    type: "item",
    label: "Apps",
    section: "resources",
    parentId: null,
    expanded: false,
    children: [],
    itemType: "apps",
  },
  {
    id: "res-assets",
    type: "item",
    label: "Assets",
    section: "resources",
    parentId: null,
    expanded: false,
    children: [],
    itemType: "asset",
  },
  {
    id: "res-connections",
    type: "item",
    label: "Connections",
    section: "resources",
    parentId: null,
    expanded: false,
    children: [],
    itemType: "connection",
  },
  {
    id: "res-context",
    type: "item",
    label: "Context",
    section: "resources",
    parentId: null,
    expanded: false,
    children: [],
    itemType: "context",
  },
  {
    id: "res-memory",
    type: "item",
    label: "Memory",
    section: "resources",
    parentId: null,
    expanded: false,
    children: [],
    itemType: "memory",
  },
  {
    id: "res-entities",
    type: "folder",
    label: "Entities",
    section: "resources",
    parentId: null,
    expanded: true,
    children: ["res-entities-customer", "res-entities-orders"],
    itemType: "entities",
  },
  {
    id: "res-entities-customer",
    type: "item",
    label: "Customer",
    section: "resources",
    parentId: "res-entities",
    expanded: false,
    children: [],
    itemType: "entity",
  },
  {
    id: "res-entities-orders",
    type: "item",
    label: "Orders",
    section: "resources",
    parentId: "res-entities",
    expanded: false,
    children: [],
    itemType: "entity",
  },
  {
    id: "res-processes",
    type: "item",
    label: "Processes",
    section: "resources",
    parentId: null,
    expanded: false,
    children: [],
    itemType: "process",
  },
  {
    id: "res-queues",
    type: "item",
    label: "Queues",
    section: "resources",
    parentId: null,
    expanded: false,
    children: [],
    itemType: "queue",
  },
];

// ─── Agents ───────────────────────────────────────────────────────────────────

export const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Due Diligence Agent",
    model: "gpt-4o-2024-11-20",
    systemPrompt:
      "# defines the agent's identity, purpose, and rules\n\n**Role**\n# who or what the agent acts as\nYou are an agent that validates {{inputData}} .\n\n**Goal**\n# what the agent must achieve\nYour purpose is to achieve the {{expectedOutput}} .\n\n**Constraints**\n# rules the agent must follow\n1. Always respond in structured JSON\n2. Never include personally identifiable information\n3. Cite your sources for any factual claims\n\n**Output**\n# the format of the agent's response\nAlways return the {{expectedOutput}} .",
    userPrompt:
      "# the specific request given to the agent at runtime\nProcess the {{inputData}} and return the {{expectedOutput}} .",
    schema: {
      input: [
        {
          name: "inputData",
          type: "object",
          description: "Input data payload for processing",
          required: true,
        },
        {
          name: "expectedOutput",
          type: "object",
          description: "Output schema template",
          required: true,
        },
      ],
      output: [
        {
          name: "result",
          type: "object",
          description: "Processed result matching output schema",
          required: true,
        },
        {
          name: "confidence",
          type: "number",
          description: "Confidence score 0–1",
          required: false,
        },
      ],
    },
    tools: ["web-search", "document-reader"],
    contextRefs: ["res-context"],
    temperature: 0.7,
    maxTokens: 4096,
    maxRetries: 3,
  },
  {
    id: "agent-2",
    name: "Validation Agent",
    model: "claude-haiku-4-5",
    systemPrompt:
      "You are a data validation agent. Validate input data against defined business rules.",
    userPrompt: "Validate the following data: {{inputData}}",
    schema: {
      input: [{ name: "inputData", type: "object", description: "Data to validate", required: true }],
      output: [
        { name: "valid", type: "boolean", description: "Whether data is valid", required: true },
        { name: "errors", type: "array", description: "Validation errors", required: false },
      ],
    },
    tools: [],
    contextRefs: [],
    temperature: 0.1,
    maxTokens: 2048,
    maxRetries: 2,
  },
];

// ─── Canvas Graph ─────────────────────────────────────────────────────────────

export const MOCK_CANVAS_NODES: Node[] = [
  {
    id: "node-agent-1",
    type: "agentNode",
    position: { x: 220, y: 100 },
    data: {
      label: "Due Diligence Agent",
      agentId: "agent-1",
      status: "active",
      hasWarning: true,
      healthPct: 36,
      escalationCount: 2,
      contextCount: 1,
      toolCount: 2,
    },
    draggable: true,
  },
  {
    id: "node-context-1",
    type: "contextNode",
    position: { x: 460, y: 370 },
    data: { label: "New context" },
    draggable: true,
  },
];

export const MOCK_CANVAS_EDGES: Edge[] = [
  {
    id: "edge-tools-context",
    source: "node-agent-1",
    target: "node-context-1",
    type: "smoothstep",
    style: { stroke: "#A4B1B8", strokeWidth: 1.5, strokeDasharray: "5 4" },
    animated: false,
  },
];

export const MOCK_CANVAS_GRAPH: CanvasGraph = {
  nodes: MOCK_CANVAS_NODES,
  edges: MOCK_CANVAS_EDGES,
};

// ─── Solution ─────────────────────────────────────────────────────────────────

export const MOCK_SOLUTION: Solution = {
  id: "sol-001",
  name: "AP Invoice Processing",
  tenant: "Acme Corp",
  agents: MOCK_AGENTS,
  processes: [
    { id: "proc-1", name: "Invoice Processing", status: "active" },
  ],
  assets: [
    { id: "asset-1", name: "SMTP_PASSWORD" },
  ],
  canvasGraph: MOCK_CANVAS_GRAPH,
  explorerTree: MOCK_EXPLORER_TREE,
};
