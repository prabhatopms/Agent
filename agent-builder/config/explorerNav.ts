// ─────────────────────────────────────────────────────────────────────────────
// Explorer Navigation Configuration
// Defines the static section types in the left explorer panel.
// Actual tree items come from the solution store (dynamic).
// ─────────────────────────────────────────────────────────────────────────────

import type { LucideIcon } from "lucide-react";

export type ExplorerSectionId =
  | "processes"
  | "agents"
  | "assets"
  | "connections"
  | "context"
  | "memory"
  | "queues"
  | "storage";

export interface ExplorerSectionConfig {
  id: ExplorerSectionId;
  label: string;
  iconName: string; // resolved to LucideIcon at runtime
  order: number;
  canAddFolder: boolean;
  canAddItem: boolean;
  addItemLabel: string;
  emptyLabel: string;
}

export const EXPLORER_SECTIONS: ExplorerSectionConfig[] = [
  {
    id: "processes",
    label: "Processes",
    iconName: "GitBranch",
    order: 0,
    canAddFolder: true,
    canAddItem: true,
    addItemLabel: "New Process",
    emptyLabel: "No processes yet.",
  },
  {
    id: "agents",
    label: "Agents",
    iconName: "Bot",
    order: 1,
    canAddFolder: true,
    canAddItem: true,
    addItemLabel: "New Agent",
    emptyLabel: "No agents yet.",
  },
  {
    id: "assets",
    label: "Assets",
    iconName: "Package",
    order: 2,
    canAddFolder: true,
    canAddItem: true,
    addItemLabel: "New Asset",
    emptyLabel: "No assets.",
  },
  {
    id: "connections",
    label: "Connections",
    iconName: "Plug",
    order: 3,
    canAddFolder: false,
    canAddItem: true,
    addItemLabel: "New Connection",
    emptyLabel: "No connections.",
  },
  {
    id: "context",
    label: "Context",
    iconName: "BookOpen",
    order: 4,
    canAddFolder: true,
    canAddItem: true,
    addItemLabel: "New Context",
    emptyLabel: "No context sources.",
  },
  {
    id: "memory",
    label: "Memory",
    iconName: "Database",
    order: 5,
    canAddFolder: false,
    canAddItem: true,
    addItemLabel: "New Memory Store",
    emptyLabel: "No memory stores.",
  },
  {
    id: "queues",
    label: "Queues",
    iconName: "List",
    order: 6,
    canAddFolder: false,
    canAddItem: true,
    addItemLabel: "New Queue",
    emptyLabel: "No queues.",
  },
  {
    id: "storage",
    label: "Storage Buckets",
    iconName: "HardDrive",
    order: 7,
    canAddFolder: false,
    canAddItem: true,
    addItemLabel: "New Bucket",
    emptyLabel: "No buckets.",
  },
];
