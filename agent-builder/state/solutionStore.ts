"use client";
// ─────────────────────────────────────────────────────────────────────────────
// Solution Store — Zustand store with full mock state
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Edge, Node } from "reactflow";
import { MOCK_SOLUTION, MOCK_AGENT_TRACE, MOCK_DEBUG_TRACE, MOCK_RUN_LOGS } from "@/lib/mockData";
import { setByPath } from "@/lib/path";

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type ItemStatus = "active" | "draft" | "error" | "running";

export interface TraceNode {
  id: string;
  label: string;
  type: "run" | "step";
  status: "pending" | "running" | "success" | "failure";
  model?: string;
  durationSeconds?: number;
  children?: TraceNode[];
  explanation?: string;
  inputs?: Record<string, string>;
  outputs?: Record<string, string>;
  errors?: Record<string, string>;
}

export interface RunLog {
  time: string;
  message: string;
}

export interface HistoryRun {
  id: string;
  label: string;
  status: "success" | "failure";
  time: string;
  trace: TraceNode;
}

export interface SchemaField {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface AgentSchema {
  input: SchemaField[];
  output: SchemaField[];
}

export interface Agent {
  id: string;
  name: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  schema: AgentSchema;
  tools: string[];
  contextRefs: string[];
  temperature?: number;
  maxTokens?: number;
  maxRetries?: number;
}

export interface Process {
  id: string;
  name: string;
  status: ItemStatus;
}

export interface Asset {
  id: string;
  name: string;
}

export type ExplorerNodeType = "folder" | "item";
export type ExplorerSection =
  | "solution"
  | "resources"
  | "processes"
  | "agents"
  | "assets"
  | "connections"
  | "context"
  | "memory"
  | "queues"
  | "storage";

export interface ExplorerNode {
  id: string;
  type: ExplorerNodeType;
  label: string;
  section: ExplorerSection;
  parentId: string | null;
  expanded: boolean;
  children: string[]; // ids of direct children
  itemType?: string;
  status?: ItemStatus;
  agentId?: string;
}

export interface CanvasGraph {
  nodes: Node[];
  edges: Edge[];
}

// ─── Data Manager Types ───────────────────────────────────────────────────────

export type VariableType =
  | "String"
  | "Int32"
  | "Boolean"
  | "DateTime"
  | "Double"
  | "Object"
  | "Array";

export type ArgumentDirection = "In" | "Out" | "InOut";

export interface ProcessVariable {
  id: string;
  name: string;
  type: VariableType;
  defaultValue?: string;
}

export interface ProcessArgument {
  id: string;
  name: string;
  type: VariableType;
  direction: ArgumentDirection;
  defaultValue?: string;
}

export interface EntityVariable {
  id: string;
  name: string;
  entityType: string; // references a Data Fabric entity schema
}

export interface Solution {
  id: string;
  name: string;
  tenant: string;
  agents: Agent[];
  processes: Process[];
  assets: Asset[];
  canvasGraph: CanvasGraph;
  explorerTree: ExplorerNode[];
}

// ─── App State ────────────────────────────────────────────────────────────────

export type AppStatus = "loading" | "ready" | "error";

export interface RenameDialog {
  open: boolean;
  nodeId: string;
  currentLabel: string;
}

export interface MoveDialog {
  open: boolean;
  nodeId: string;
  currentSection: ExplorerSection;
}

export interface SolutionState {
  // App lifecycle
  appStatus: AppStatus;
  appError: string | null;

  // Solution data
  solution: Solution;

  // Selection
  selectedNodeId: string | null; // canvas node id
  selectedAgentId: string | null;
  selectedCanvasNodeType: string | null; // e.g. "agentNode" | "contextNode"

  // Inspector dirty state
  dirtyAgentPatch: Partial<Agent> | null; // local edits not yet applied
  isDirty: boolean;

  // Dialogs
  renameDialog: RenameDialog;
  moveDialog: MoveDialog;

  // Validation errors per fieldId
  validationErrors: Record<string, string>;

  // Explorer collapsed sections
  collapsedSections: Set<ExplorerSection>;

  // Explorer active item (driven by canvas tab)
  selectedExplorerNodeId: string | null;

  // Canvas mode — "agent" = agent definition canvas, "process" = agentic process BPMN canvas
  canvasMode: "agent" | "process";

  // Data Manager — process-level variables, arguments, entity variables
  processVariables: ProcessVariable[];
  processArguments: ProcessArgument[];
  entityVariables: EntityVariable[];

  // Execution trail
  trailPanelOpen: boolean;
  agentTrace: TraceNode | null;
  trailSelectedNodeId: string | null;
  trailActiveTab: "results" | "metadata" | "feedback";

  // Debug mode
  isDebugMode: boolean;
  isRunning: boolean;
  runStatus: "running" | "failed" | "success" | null;
  runLogs: RunLog[];
  trailSection: "execution-trail" | "history" | "evaluations";
  traceHistory: HistoryRun[];
  historyBadgeCount: number;

  // ── Actions ─────────────────────────────────────────────────────────────────

  // Lifecycle
  simulateLoad: () => Promise<void>;
  simulateError: () => void;
  resetError: () => void;

  // Selection
  selectCanvasNode: (nodeId: string | null) => void;

  // Inspector edits
  patchAgentField: (fieldId: string, valuePath: string, value: unknown) => void;
  applyAgentChanges: () => void;
  resetAgentChanges: () => void;

  // Explorer: folders
  toggleSection: (section: ExplorerSection) => void;
  toggleNodeExpanded: (nodeId: string) => void;
  addFolder: (section: ExplorerSection, label: string) => void;
  renameNode: (nodeId: string, newLabel: string) => void;
  deleteNode: (nodeId: string) => void;
  openRenameDialog: (nodeId: string) => void;
  closeRenameDialog: () => void;
  openMoveDialog: (nodeId: string) => void;
  closeMoveDialog: () => void;

  // Canvas
  updateCanvasNodes: (nodes: Node[]) => void;
  updateCanvasEdges: (edges: Edge[]) => void;
  addChildNode: (agentNodeId: string, portType: string) => void;
  deleteCanvasNode: (nodeId: string) => void;
  configureContextNode: (nodeId: string, contextType: "entity" | "index", selectedItems: string[], label: string) => void;
  updateContextNodeLabel: (nodeId: string, label: string) => void;

  // Explorer highlight
  setSelectedExplorerNode: (id: string | null) => void;

  // Canvas mode
  setCanvasMode: (mode: "agent" | "process") => void;

  // Data Manager actions
  addProcessVariable: (v: Omit<ProcessVariable, "id">) => void;
  updateProcessVariable: (id: string, patch: Partial<Omit<ProcessVariable, "id">>) => void;
  deleteProcessVariable: (id: string) => void;
  addProcessArgument: (a: Omit<ProcessArgument, "id">) => void;
  updateProcessArgument: (id: string, patch: Partial<Omit<ProcessArgument, "id">>) => void;
  deleteProcessArgument: (id: string) => void;
  addEntityVariable: (ev: Omit<EntityVariable, "id">) => void;
  deleteEntityVariable: (id: string) => void;

  // Execution trail
  runEvaluation: () => void;
  selectTrailNode: (id: string) => void;
  setTrailTab: (tab: "results" | "metadata" | "feedback") => void;
  closeTrailPanel: () => void;

  // Debug simulation
  startDebug: () => void;
  stopDebug: () => void;
  exitDebugMode: () => void;
  setTrailSection: (section: "execution-trail" | "history" | "evaluations") => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSolutionStore = create<SolutionState>()(
  immer((set, get) => ({
    appStatus: "loading",
    appError: null,
    solution: MOCK_SOLUTION,
    selectedNodeId: "node-agent-1",
    selectedAgentId: "agent-1",
    selectedCanvasNodeType: "agentNode",
    dirtyAgentPatch: null,
    isDirty: false,
    validationErrors: {},
    collapsedSections: new Set(),
    selectedExplorerNodeId: "sol-agent-def",
    renameDialog: { open: false, nodeId: "", currentLabel: "" },
    moveDialog: { open: false, nodeId: "", currentSection: "agents" },
    trailPanelOpen: false,
    agentTrace: null,
    trailSelectedNodeId: null,
    trailActiveTab: "results",
    isDebugMode: false,
    isRunning: false,
    runStatus: null,
    runLogs: [],
    trailSection: "execution-trail",
    traceHistory: [],
    historyBadgeCount: 0,
    canvasMode: "agent",
    processVariables: [
      { id: "pv-1", name: "applicationDate", type: "DateTime" },
      { id: "pv-2", name: "email",           type: "String" },
      { id: "pv-3", name: "errorFirstName",  type: "String" },
      { id: "pv-4", name: "errorLastName",   type: "String" },
    ],
    processArguments: [],
    entityVariables: [
      { id: "ev-1", name: "CustomerDataSet1", entityType: "CustomerData" },
      { id: "ev-2", name: "CustomerDataSet2", entityType: "CustomerData" },
    ],

    // ── Lifecycle ──────────────────────────────────────────────────────────────

    simulateLoad: async () => {
      set((s) => { s.appStatus = "loading"; });
      await new Promise((r) => setTimeout(r, 900));
      set((s) => { s.appStatus = "ready"; });
    },

    simulateError: () => {
      set((s) => {
        s.appStatus = "error";
        s.appError = "Failed to load solution: Network timeout (simulated).";
      });
    },

    resetError: () => {
      set((s) => {
        s.appStatus = "loading";
        s.appError = null;
      });
      get().simulateLoad();
    },

    // ── Selection ──────────────────────────────────────────────────────────────

    selectCanvasNode: (nodeId) => {
      const state = get();
      // Reset any dirty state when switching nodes
      if (state.isDirty && nodeId !== state.selectedNodeId) {
        set((s) => {
          s.dirtyAgentPatch = null;
          s.isDirty = false;
          s.validationErrors = {};
        });
      }
      set((s) => {
        s.selectedNodeId = nodeId;
        if (nodeId) {
          const canvasNode = s.solution.canvasGraph.nodes.find((n) => n.id === nodeId);
          s.selectedAgentId = canvasNode?.data?.agentId ?? null;
          s.selectedCanvasNodeType = canvasNode?.type ?? null;
        } else {
          s.selectedAgentId = null;
          s.selectedCanvasNodeType = null;
        }
      });
    },

    // ── Inspector ─────────────────────────────────────────────────────────────

    patchAgentField: (fieldId, valuePath, value) => {
      set((s) => {
        const current = s.dirtyAgentPatch ?? {};
        s.dirtyAgentPatch = setByPath(
          current as Record<string, unknown>,
          valuePath,
          value
        ) as Partial<Agent>;
        s.isDirty = true;

        // Clear validation error for this field
        if (s.validationErrors[fieldId]) {
          delete s.validationErrors[fieldId];
        }
      });
    },

    applyAgentChanges: () => {
      const { selectedAgentId, dirtyAgentPatch, solution } = get();
      if (!selectedAgentId || !dirtyAgentPatch) return;

      // Validate before applying
      const errors: Record<string, string> = {};
      if ("name" in dirtyAgentPatch && !dirtyAgentPatch.name?.trim()) {
        errors["name"] = "Agent name is required.";
      }
      if ("model" in dirtyAgentPatch && !dirtyAgentPatch.model) {
        errors["model"] = "A model must be selected.";
      }

      if (Object.keys(errors).length > 0) {
        set((s) => { s.validationErrors = errors; });
        return;
      }

      set((s) => {
        const idx = s.solution.agents.findIndex((a) => a.id === selectedAgentId);
        if (idx !== -1) {
          s.solution.agents[idx] = { ...s.solution.agents[idx], ...dirtyAgentPatch };
          // Sync canvas node label if name changed
          if (dirtyAgentPatch.name) {
            const canvasNode = s.solution.canvasGraph.nodes.find(
              (n) => n.data?.agentId === selectedAgentId
            );
            if (canvasNode) canvasNode.data = { ...canvasNode.data, label: dirtyAgentPatch.name };
          }
        }
        s.dirtyAgentPatch = null;
        s.isDirty = false;
        s.validationErrors = {};
      });
    },

    resetAgentChanges: () => {
      set((s) => {
        s.dirtyAgentPatch = null;
        s.isDirty = false;
        s.validationErrors = {};
      });
    },

    // ── Explorer ──────────────────────────────────────────────────────────────

    toggleSection: (section) => {
      set((s) => {
        if (s.collapsedSections.has(section)) {
          s.collapsedSections.delete(section);
        } else {
          s.collapsedSections.add(section);
        }
      });
    },

    toggleNodeExpanded: (nodeId) => {
      set((s) => {
        const node = s.solution.explorerTree.find((n) => n.id === nodeId);
        if (node) node.expanded = !node.expanded;
      });
    },

    addFolder: (section, label) => {
      const id = `folder-${section}-${Date.now()}`;
      set((s) => {
        s.solution.explorerTree.push({
          id,
          type: "folder",
          label,
          section,
          parentId: null,
          expanded: true,
          children: [],
        });
      });
    },

    renameNode: (nodeId, newLabel) => {
      set((s) => {
        const node = s.solution.explorerTree.find((n) => n.id === nodeId);
        if (node) node.label = newLabel;
        s.renameDialog = { open: false, nodeId: "", currentLabel: "" };
      });
    },

    deleteNode: (nodeId) => {
      set((s) => {
        const node = s.solution.explorerTree.find((n) => n.id === nodeId);
        if (!node) return;

        // Remove from parent's children
        if (node.parentId) {
          const parent = s.solution.explorerTree.find((n) => n.id === node.parentId);
          if (parent) parent.children = parent.children.filter((id) => id !== nodeId);
        }

        // Recursively collect ids to delete
        const toDelete = new Set<string>();
        const collect = (id: string) => {
          toDelete.add(id);
          const n = s.solution.explorerTree.find((x) => x.id === id);
          n?.children.forEach(collect);
        };
        collect(nodeId);

        s.solution.explorerTree = s.solution.explorerTree.filter(
          (n) => !toDelete.has(n.id)
        );
      });
    },

    openRenameDialog: (nodeId) => {
      const node = get().solution.explorerTree.find((n) => n.id === nodeId);
      if (!node) return;
      set((s) => {
        s.renameDialog = { open: true, nodeId, currentLabel: node.label };
      });
    },

    closeRenameDialog: () => {
      set((s) => {
        s.renameDialog = { open: false, nodeId: "", currentLabel: "" };
      });
    },

    openMoveDialog: (nodeId) => {
      const node = get().solution.explorerTree.find((n) => n.id === nodeId);
      if (!node) return;
      set((s) => {
        s.moveDialog = { open: true, nodeId, currentSection: node.section };
      });
    },

    closeMoveDialog: () => {
      set((s) => {
        s.moveDialog = { open: false, nodeId: "", currentSection: "agents" };
      });
    },

    // ── Canvas ────────────────────────────────────────────────────────────────

    updateCanvasNodes: (nodes) => {
      set((s) => { s.solution.canvasGraph.nodes = nodes; });
    },

    updateCanvasEdges: (edges) => {
      set((s) => { s.solution.canvasGraph.edges = edges; });
    },

    addChildNode: (agentNodeId, portType) => {
      const state = get();
      const agentNode = state.solution.canvasGraph.nodes.find((n) => n.id === agentNodeId);
      if (!agentNode) return;

      const portPcts: Record<string, number> = {
        escalations: 0.21,
        context: 0.50,
        tools: 0.78,
      };
      const pct = portPcts[portType] ?? 0.5;
      const portCenterX = agentNode.position.x + pct * 288;

      // Offset each additional node for the same port so they don't stack
      const existing = state.solution.canvasGraph.edges.filter(
        (e) => e.source === agentNodeId && e.sourceHandle === portType
      ).length;

      const nodeId = `node-${portType}-${Date.now()}`;
      const newNode: Node = {
        id: nodeId,
        type: "contextNode",
        position: {
          x: portCenterX - 48 + existing * 120,
          y: agentNode.position.y + 96 + 108 + 16, // card + arm + gap
        },
        data: { label: "New context", portType },
        draggable: true,
      };

      const newEdge: Edge = {
        id: `edge-${agentNodeId}-${nodeId}`,
        source: agentNodeId,
        sourceHandle: portType,
        target: nodeId,
        type: "smoothstep",
        style: { stroke: "#A4B1B8", strokeWidth: 1.5, strokeDasharray: "5 4" },
      };

      set((s) => {
        s.solution.canvasGraph.nodes.push(newNode);
        s.solution.canvasGraph.edges.push(newEdge);
        // Auto-select the new node so inspector opens
        s.selectedNodeId = nodeId;
        s.selectedCanvasNodeType = "contextNode";
        s.selectedAgentId = null;
      });
    },

    deleteCanvasNode: (nodeId) => {
      set((s) => {
        s.solution.canvasGraph.nodes = s.solution.canvasGraph.nodes.filter(
          (n) => n.id !== nodeId
        );
        s.solution.canvasGraph.edges = s.solution.canvasGraph.edges.filter(
          (e) => e.source !== nodeId && e.target !== nodeId
        );
        if (s.selectedNodeId === nodeId) {
          s.selectedNodeId = null;
          s.selectedAgentId = null;
          s.selectedCanvasNodeType = null;
        }
      });
    },

    configureContextNode: (nodeId, contextType, selectedItems, label) => {
      set((s) => {
        const node = s.solution.canvasGraph.nodes.find((n) => n.id === nodeId);
        if (node) {
          node.data = { ...node.data, configured: true, contextType, selectedItems, label };
        }
      });
    },

    updateContextNodeLabel: (nodeId, label) => {
      set((s) => {
        const node = s.solution.canvasGraph.nodes.find((n) => n.id === nodeId);
        if (node) node.data = { ...node.data, label };
      });
    },

    setSelectedExplorerNode: (id) => {
      set((s) => { s.selectedExplorerNodeId = id; });
    },

    setCanvasMode: (mode) => {
      set((s) => { s.canvasMode = mode; });
    },

    // ── Data Manager ───────────────────────────────────────────────────────────

    addProcessVariable: (v) => {
      set((s) => {
        s.processVariables.push({ id: `pv-${Date.now()}`, ...v });
      });
    },
    updateProcessVariable: (id, patch) => {
      set((s) => {
        const i = s.processVariables.findIndex((v) => v.id === id);
        if (i !== -1) Object.assign(s.processVariables[i], patch);
      });
    },
    deleteProcessVariable: (id) => {
      set((s) => {
        s.processVariables = s.processVariables.filter((v) => v.id !== id);
      });
    },
    addProcessArgument: (a) => {
      set((s) => {
        s.processArguments.push({ id: `pa-${Date.now()}`, ...a });
      });
    },
    updateProcessArgument: (id, patch) => {
      set((s) => {
        const i = s.processArguments.findIndex((a) => a.id === id);
        if (i !== -1) Object.assign(s.processArguments[i], patch);
      });
    },
    deleteProcessArgument: (id) => {
      set((s) => {
        s.processArguments = s.processArguments.filter((a) => a.id !== id);
      });
    },
    addEntityVariable: (ev) => {
      set((s) => {
        s.entityVariables.push({ id: `ev-${Date.now()}`, ...ev });
      });
    },
    deleteEntityVariable: (id) => {
      set((s) => {
        s.entityVariables = s.entityVariables.filter((ev) => ev.id !== id);
      });
    },

    // ── Execution trail ────────────────────────────────────────────────────────

    runEvaluation: () => {
      // Build a "running" snapshot from mock — deep spread so Immer gets plain objects
      const runningTrace: TraceNode = {
        ...MOCK_AGENT_TRACE,
        status: "running",
        durationSeconds: undefined,
        children: MOCK_AGENT_TRACE.children?.map((c) => ({
          ...c,
          status: "pending" as const,
          durationSeconds: undefined,
        })),
      };
      set((s) => {
        s.trailPanelOpen = true;
        s.agentTrace = runningTrace;
        s.trailSelectedNodeId = "run-1";
        s.trailActiveTab = "results";
      });
      // Simulate completion after 1.5 s
      setTimeout(() => {
        set((s) => {
          if (!s.agentTrace) return;
          s.agentTrace.status = "success";
          s.agentTrace.durationSeconds = 14.12;
          if (s.agentTrace.children) {
            MOCK_AGENT_TRACE.children?.forEach((orig, i) => {
              if (s.agentTrace!.children![i]) {
                s.agentTrace!.children![i].status = "success";
                s.agentTrace!.children![i].durationSeconds = orig.durationSeconds;
              }
            });
          }
        });
      }, 1500);
    },

    selectTrailNode: (id) => {
      set((s) => { s.trailSelectedNodeId = id; });
    },

    setTrailTab: (tab) => {
      set((s) => { s.trailActiveTab = tab; });
    },

    closeTrailPanel: () => {
      set((s) => {
        s.trailPanelOpen = false;
        s.agentTrace = null;
        s.trailSelectedNodeId = null;
      });
    },

    startDebug: () => {
      set((s) => {
        s.isDebugMode = true;
        s.isRunning = true;
        s.runStatus = "running";
        s.trailPanelOpen = true;
        s.agentTrace = null;
        s.trailSection = "execution-trail";
        s.runLogs = [];
        s.trailSelectedNodeId = null;
      });
      // Stream logs at 400ms intervals
      MOCK_RUN_LOGS.forEach((log, i) => {
        setTimeout(() => {
          set((s) => { s.runLogs.push({ ...log }); });
        }, (i + 1) * 400);
      });
      // Fail after 2.5s
      setTimeout(() => {
        const runId = `run-${Date.now()}`;
        const trace: TraceNode = {
          ...MOCK_DEBUG_TRACE,
          children: MOCK_DEBUG_TRACE.children?.map((c) => ({ ...c })),
        };
        set((s) => {
          s.isRunning = false;
          s.runStatus = "failed";
          s.agentTrace = trace;
          s.trailSelectedNodeId = trace.id;
          s.traceHistory.unshift({
            id: runId,
            label: trace.label,
            status: "failure",
            time: new Date().toLocaleTimeString(),
            trace: { ...trace, children: trace.children?.map((c) => ({ ...c })) },
          });
          s.historyBadgeCount = s.traceHistory.length;
        });
      }, 2500);
    },

    stopDebug: () => {
      set((s) => {
        s.isRunning = false;
        s.runStatus = null;
      });
    },

    exitDebugMode: () => {
      set((s) => {
        s.isDebugMode = false;
        s.isRunning = false;
        s.runStatus = null;
        s.trailPanelOpen = false;
        s.agentTrace = null;
        s.runLogs = [];
        s.trailSelectedNodeId = null;
        s.trailSection = "execution-trail";
      });
    },

    setTrailSection: (section) => {
      set((s) => { s.trailSection = section; });
    },
  }))
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectSelectedAgent = (state: SolutionState): Agent | null => {
  if (!state.selectedAgentId) return null;
  const base = state.solution.agents.find((a) => a.id === state.selectedAgentId) ?? null;
  if (!base) return null;
  // Merge dirty patch on top for live preview
  if (state.dirtyAgentPatch) {
    return { ...base, ...state.dirtyAgentPatch } as Agent;
  }
  return base;
};

export const selectExplorerBySection = (
  tree: ExplorerNode[],
  section: ExplorerSection
): ExplorerNode[] => tree.filter((n) => n.section === section);
