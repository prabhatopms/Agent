"use client";

import { useState } from "react";
import {
  ChevronRight,
  FolderPlus,
  Plus,
  GitBranch,
  Bot,
  Package,
  Plug,
  BookOpen,
  Database,
  List,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TreeItem } from "./TreeItem";
import { useSolutionStore, selectExplorerBySection } from "@/state/solutionStore";
import type { ExplorerSectionConfig } from "@/config/explorerNav";
import type { ExplorerSection as ExplorerSectionId, ExplorerNode } from "@/state/solutionStore";

// ─── Icon registry ─────────────────────────────────────────────────────────────

const ICONS: Record<string, React.ElementType> = {
  GitBranch, Bot, Package, Plug, BookOpen, Database, List, HardDrive,
};

interface ExplorerSectionProps {
  sectionConfig: ExplorerSectionConfig;
  searchQuery: string;
}

export function ExplorerSection({ sectionConfig, searchQuery }: ExplorerSectionProps) {
  const { solution, collapsedSections, toggleSection, addFolder } =
    useSolutionStore();
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [folderLabel, setFolderLabel] = useState("");

  const sectionId = sectionConfig.id as ExplorerSectionId;
  const isCollapsed = collapsedSections.has(sectionId);
  const allNodes = selectExplorerBySection(solution.explorerTree, sectionId);

  // Filter for display: top-level items for this section
  const rootNodes = allNodes.filter((n) => n.parentId === null);

  // Search filter
  const filtered = searchQuery
    ? allNodes.filter((n) =>
        n.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const displayNodes = filtered
    ? filtered
    : rootNodes;

  const Icon = ICONS[sectionConfig.iconName] ?? GitBranch;

  const handleAddFolder = () => {
    if (folderLabel.trim()) {
      addFolder(sectionId, folderLabel.trim());
      setFolderLabel("");
      setShowAddFolder(false);
    }
  };

  return (
    <div className="select-none">
      {/* Section header */}
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1 cursor-pointer group",
          "hover:bg-muted/50 transition-colors"
        )}
        onClick={() => toggleSection(sectionId)}
      >
        <ChevronRight
          className={cn(
            "w-3 h-3 text-muted-foreground transition-transform shrink-0",
            !isCollapsed && "rotate-90"
          )}
        />
        <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="text-[12px] font-medium text-foreground flex-1 leading-none py-0.5">
          {sectionConfig.label}
        </span>

        {/* Actions (shown on hover) */}
        <div
          className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {sectionConfig.canAddFolder && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => setShowAddFolder((v) => !v)}
              title="New folder"
            >
              <FolderPlus className="w-3 h-3" />
            </Button>
          )}
          {sectionConfig.canAddItem && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              title={sectionConfig.addItemLabel}
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* New folder input */}
      {showAddFolder && !isCollapsed && (
        <div className="px-4 py-1" onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus
            value={folderLabel}
            onChange={(e) => setFolderLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddFolder();
              if (e.key === "Escape") setShowAddFolder(false);
            }}
            onBlur={() => {
              if (!folderLabel.trim()) setShowAddFolder(false);
            }}
            placeholder="Folder name…"
            className={cn(
              "w-full px-2 py-0.5 text-[11px] rounded border border-border",
              "bg-background outline-none focus:ring-1 focus:ring-ring"
            )}
          />
        </div>
      )}

      {/* Tree items */}
      {!isCollapsed && (
        <div>
          {displayNodes.length === 0 ? (
            <p className="px-8 py-1.5 text-[11px] text-muted-foreground italic">
              {sectionConfig.emptyLabel}
            </p>
          ) : (
            displayNodes.map((node) => (
              <TreeItem
                key={node.id}
                nodeId={node.id}
                allNodes={allNodes}
                depth={filtered ? 0 : 0}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
