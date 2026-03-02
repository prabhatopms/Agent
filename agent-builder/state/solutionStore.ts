"use client";
// ─────────────────────────────────────────────────────────────────────────────
// Solution Store — Zustand store with full mock state
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Edge, Node } from "reactflow";
import { MOCK_SOLUTION } from "@/lib/mockData";
import { setByPath } from "@/lib/path";

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type ItemStatus = "active" | "draft" | "error" | "running";

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
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSolutionStore = create<SolutionState>()(
  immer((set, get) => ({
    appStatus: "loading",
    appError: null,
    solution: MOCK_SOLUTION,
    selectedNodeId: null,
    selectedAgentId: null,
    dirtyAgentPatch: null,
    isDirty: false,
    validationErrors: {},
    collapsedSections: new Set(),
    renameDialog: { open: false, nodeId: "", currentLabel: "" },
    moveDialog: { open: false, nodeId: "", currentSection: "agents" },

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
        } else {
          s.selectedAgentId = null;
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
