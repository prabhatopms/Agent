// ─────────────────────────────────────────────────────────────────────────────
// Mock Data — Customer Support Agentic AI seed state
// ─────────────────────────────────────────────────────────────────────────────

import type { Solution, Agent, CanvasGraph, ExplorerNode, TraceNode, RunLog } from "@/state/solutionStore";
import { Edge, Node } from "reactflow";

// ─── Explorer Tree ────────────────────────────────────────────────────────────

export const MOCK_EXPLORER_TREE: ExplorerNode[] = [
  // ── Solution tree ───────────────────────────────────────────────────────────
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
    label: "Customer Support Agent",
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
    label: "CustomerSupport.bpmn",
    section: "solution",
    parentId: "sol-process-folder",
    expanded: false,
    children: [],
    itemType: "bpmn",
  },

  // ── Resources ───────────────────────────────────────────────────────────────
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
    children: ["res-entities-order", "res-entities-lineitem", "res-entities-customer"],
    itemType: "entities",
  },
  {
    id: "res-entities-order",
    type: "item",
    label: "Order",
    section: "resources",
    parentId: "res-entities",
    expanded: false,
    children: [],
    itemType: "entity",
  },
  {
    id: "res-entities-lineitem",
    type: "item",
    label: "Order Line Item",
    section: "resources",
    parentId: "res-entities",
    expanded: false,
    children: [],
    itemType: "entity",
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
    name: "Customer Support Agent",
    model: "gpt-4o-2024-11-20",
    systemPrompt:
      "# Customer Support Agent\n\n**Role**\nYou are an intelligent customer support agent for an e-commerce platform. You automatically handle customer complaints and requests related to delayed or incorrect orders — including cancellations, refunds, expedited shipping, and escalations.\n\n**Workflow**\n1. Parse {{emailContent}} to understand customer intent and extract key data (orderId, issue type, urgency)\n2. Query the {{Order}} entity to retrieve order status, shipment details, payment status, and delivery dates\n3. Query the {{OrderLineItem}} entity to inspect individual line items — shipped vs. pending\n4. Reason about the situation: Is the order fully shipped? Partially shipped? Is the delivery date already passed?\n5. Take the appropriate action:\n   - **Cancel**: If items are cancellable, trigger the RPA cancellation and notify the customer\n   - **Expedite**: If delivery is delayed, flag for priority shipping\n   - **Inform**: If already shipped and cannot be cancelled, send a polite explanation\n   - **Escalate**: If order value > $1,000 or situation is ambiguous, route to a human agent\n\n**Constraints**\n1. Never cancel an order that has already been fully shipped\n2. For partial shipments: cancel only unshipped line items and issue a proportional refund\n3. Always send a confirmation email to the customer after taking action\n4. Escalate to a human agent if order value > $1,000 or situation is ambiguous\n5. Always respond in structured JSON\n\n**Output**\nReturn {{expectedOutput}} with: action, reasoning, affectedItems, refundAmount, customerMessage.",
    userPrompt:
      "# Customer Support Request\n\nProcess the following customer {{emailContent}} for customer {{customerId}}.\n\nUse the {{Order}} and {{OrderLineItem}} context to retrieve order details and take the appropriate action.\n\nReturn a structured response matching {{expectedOutput}}.",
    schema: {
      input: [
        {
          name: "emailContent",
          type: "string",
          description: "Raw email or support ticket text from the customer",
          required: true,
        },
        {
          name: "customerId",
          type: "string",
          description: "Unique customer identifier",
          required: true,
        },
        {
          name: "orderId",
          type: "string",
          description: "Order ID extracted from the email, if present",
          required: false,
        },
      ],
      output: [
        {
          name: "action",
          type: "string",
          description: "Action taken: cancel | expedite | escalate | inform",
          required: true,
        },
        {
          name: "reasoning",
          type: "string",
          description: "Agent's reasoning and decision explanation",
          required: true,
        },
        {
          name: "customerMessage",
          type: "string",
          description: "Email response to send back to the customer",
          required: true,
        },
        {
          name: "refundAmount",
          type: "number",
          description: "Refund amount in USD, if a cancellation or refund was issued",
          required: false,
        },
      ],
    },
    tools: ["email-reader", "order-lookup", "rpa-connector", "email-sender"],
    contextRefs: ["res-entities-order", "res-entities-lineitem"],
    temperature: 0.3,
    maxTokens: 2048,
    maxRetries: 3,
  },
  {
    id: "agent-2",
    name: "Order Validation Agent",
    model: "claude-haiku-4-5",
    systemPrompt:
      "You are an order validation agent. Validate order data against business rules before processing.",
    userPrompt: "Validate the following order: {{inputData}}",
    schema: {
      input: [
        { name: "inputData", type: "object", description: "Order data to validate", required: true },
      ],
      output: [
        { name: "valid", type: "boolean", description: "Whether the order is valid", required: true },
        { name: "errors", type: "array", description: "Validation errors if any", required: false },
      ],
    },
    tools: [],
    contextRefs: [],
    temperature: 0.1,
    maxTokens: 1024,
    maxRetries: 2,
  },
];

// ─── Canvas Graph ─────────────────────────────────────────────────────────────

export const MOCK_CANVAS_NODES: Node[] = [
  {
    id: "node-agent-1",
    type: "agentNode",
    position: { x: 180, y: 60 },
    data: {
      label: "Customer Support Agent",
      agentId: "agent-1",
      status: "active",
      hasWarning: false,
    },
    draggable: true,
  },
];

export const MOCK_CANVAS_EDGES: Edge[] = [];

export const MOCK_CANVAS_GRAPH: CanvasGraph = {
  nodes: MOCK_CANVAS_NODES,
  edges: MOCK_CANVAS_EDGES,
};

// ─── Execution Trace (success — triggered by Evaluate) ────────────────────────

export const MOCK_AGENT_TRACE: TraceNode = {
  id: "run-1",
  label: "Agent run",
  type: "run",
  status: "success",
  durationSeconds: 8.45,
  children: [
    {
      id: "step-read-email",
      label: "Read customer email",
      type: "step",
      status: "success",
      model: "gpt-4o-2024-11-20",
      durationSeconds: 1.12,
      explanation:
        "Parsed the incoming customer email and extracted intent: order cancellation request for Order78452 from customer CUST-1042.",
      inputs: {
        emailContent:
          "Hi, I need to cancel my order Order78452 placed last week. The delivery is taking too long and I no longer need the items. Please process ASAP.",
        customerId: "CUST-1042",
      },
      outputs: {
        intent: "cancel_order",
        orderId: "Order78452",
        urgency: "high",
      },
    },
    {
      id: "step-fetch-order",
      label: "Fetch Order context",
      type: "step",
      status: "success",
      model: "gpt-4o-2024-11-20",
      durationSeconds: 0.84,
      explanation:
        "Queried the Order entity for Order78452. The order is partially shipped — Laptop Stand has already been dispatched, USB-C Hub is still in the warehouse.",
      inputs: {
        orderId: "Order78452",
        entity: "Order",
      },
      outputs: {
        orderDate: "2025-01-15",
        shipmentStatus: "Partially Shipped",
        paymentStatus: "Paid",
        expectedDeliveryDate: "2025-01-22",
        orderTotal: "$134.00",
      },
    },
    {
      id: "step-fetch-lineitems",
      label: "Fetch Order Line Items",
      type: "step",
      status: "success",
      model: "gpt-4o-2024-11-20",
      durationSeconds: 0.67,
      explanation:
        "Queried the OrderLineItem entity for Order78452. Found 2 line items: Laptop Stand has shipped, USB-C Hub is still pending dispatch.",
      inputs: {
        orderId: "Order78452",
        entity: "OrderLineItem",
      },
      outputs: {
        item1: "Laptop Stand (Qty: 1) — Shipped",
        item2: "USB-C Hub (Qty: 2) — Pending",
      },
    },
    {
      id: "step-reason",
      label: "Reason & decide action",
      type: "step",
      status: "success",
      model: "gpt-4o-2024-11-20",
      durationSeconds: 1.94,
      explanation:
        "Order78452 is partially shipped. 'Laptop Stand' has already been dispatched and cannot be cancelled. 'USB-C Hub' (Qty: 2) is still in the warehouse and is eligible for cancellation. Decision: partial cancellation — cancel USB-C Hub and issue a proportional refund of $89.00.",
      inputs: {
        shipmentStatus: "Partially Shipped",
        shippedItems: "Laptop Stand (Qty: 1)",
        pendingItems: "USB-C Hub (Qty: 2)",
        orderTotal: "$134.00",
      },
      outputs: {
        action: "partial_cancel",
        cancellableItems: "USB-C Hub (Qty: 2)",
        refundAmount: "$89.00",
        reason: "Laptop Stand already shipped — cannot be recalled",
      },
    },
    {
      id: "step-rpa",
      label: "Trigger RPA — Cancel line items",
      type: "step",
      status: "success",
      model: "gpt-4o-2024-11-20",
      durationSeconds: 0.31,
      explanation:
        "Invoked the RPA connector to cancel USB-C Hub line items on Order78452. Cancellation processed successfully and a refund of $89.00 has been initiated.",
      inputs: {
        orderId: "Order78452",
        action: "cancel_items",
        itemsToCancel: "USB-C Hub (Qty: 2)",
        refundAmount: "$89.00",
      },
      outputs: {
        status: "cancelled",
        refundAmount: "$89.00",
        refundETA: "3–5 business days",
        confirmationId: "REF-78452-001",
      },
    },
  ],
};

// ─── Debug Trace (failure — triggered by Debug simulation) ────────────────────

export const MOCK_DEBUG_TRACE: TraceNode = {
  id: "debug-run-1",
  label: "Agent run - Customer Support Agent",
  type: "run",
  status: "failure",
  durationSeconds: 3.21,
  children: [
    {
      id: "debug-llm-1",
      label: "LLM call — Read customer email",
      type: "step",
      status: "failure",
      model: "gpt-4o-2024-11-20",
      durationSeconds: 0.797,
      errors: {
        error:
          "Insufficient funds: You've exceeded your current quota. Please check your plan and billing details at https://platform.openai.com/account/billing.",
      },
    },
  ],
};

// ─── Run Logs (streamed during debug simulation) ───────────────────────────────

export const MOCK_RUN_LOGS: RunLog[] = [
  { time: "14:22:01.103", message: "Initializing Customer Support Agent..." },
  {
    time: "14:22:01.504",
    message: "Reading incoming customer email (Order78452 cancellation request)...",
  },
  { time: "14:22:01.905", message: "Connecting to Order Management System..." },
  {
    time: "14:22:02.306",
    message: "Fetching Order and Order Line Item context for Order78452...",
  },
];

// ─── Solution ─────────────────────────────────────────────────────────────────

export const MOCK_SOLUTION: Solution = {
  id: "sol-001",
  name: "Customer Support Solution",
  tenant: "Acme Corp",
  agents: MOCK_AGENTS,
  processes: [
    { id: "proc-1", name: "Customer Support Process", status: "active" },
  ],
  assets: [
    { id: "asset-1", name: "OMS_API_KEY" },
    { id: "asset-2", name: "EMAIL_SMTP_PASSWORD" },
  ],
  canvasGraph: MOCK_CANVAS_GRAPH,
  explorerTree: MOCK_EXPLORER_TREE,
};
