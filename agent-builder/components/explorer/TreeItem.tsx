"use client";

import {
  ChevronRight,
  Folder,
  FolderOpen,
  Bot,
  GitBranch,
  Package,
  Plug,
  BookOpen,
  Database,
  List,
  HardDrive,
  MoreHorizontal,
  Pencil,
  Trash2,
  MoveRight,
  FileText,
  ClipboardCheck,
  Users,
  LayoutGrid,
  Tag,
  AppWindow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  useSolutionStore,
  type ExplorerNode,
} from "@/state/solutionStore";

// ─── Item type icon map ────────────────────────────────────────────────────────

function ItemIcon({ itemType, section }: { itemType?: string; section: string }) {
  switch (itemType ?? section) {
    // Original types
    case "agent":      return <Bot className="w-3.5 h-3.5 shrink-0 text-violet-500" />;
    case "process":    return <GitBranch className="w-3.5 h-3.5 shrink-0 text-blue-500" />;
    case "asset":      return <Package className="w-3.5 h-3.5 shrink-0 text-amber-500" />;
    case "connection": return <Plug className="w-3.5 h-3.5 shrink-0 text-emerald-500" />;
    case "context":    return <BookOpen className="w-3.5 h-3.5 shrink-0 text-cyan-500" />;
    case "memory":     return <Database className="w-3.5 h-3.5 shrink-0 text-rose-500" />;
    case "queue":      return <List className="w-3.5 h-3.5 shrink-0 text-orange-500" />;
    case "storage":    return <HardDrive className="w-3.5 h-3.5 shrink-0 text-zinc-500" />;
    // New solution tree types
    case "definition": return <FileText className="w-3.5 h-3.5 shrink-0 text-blue-400" />;
    case "evaluation": return <ClipboardCheck className="w-3.5 h-3.5 shrink-0 text-violet-400" />;
    case "evaluators": return <Users className="w-3.5 h-3.5 shrink-0 text-slate-400" />;
    case "bpmn":       return <GitBranch className="w-3.5 h-3.5 shrink-0 text-blue-400" />;
    // Resource section types
    case "apps":       return <AppWindow className="w-3.5 h-3.5 shrink-0 text-slate-400" />;
    case "entities":   return <Tag className="w-3.5 h-3.5 shrink-0 text-indigo-400" />;
    case "entity":     return <Tag className="w-3.5 h-3.5 shrink-0 text-indigo-300" />;
    default:           return <FileText className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />;
  }
}

interface TreeItemProps {
  nodeId: string;
  allNodes: ExplorerNode[];
  depth: number;
}

export function TreeItem({ nodeId, allNodes, depth }: TreeItemProps) {
  const {
    solution,
    selectedAgentId,
    toggleNodeExpanded,
    deleteNode,
    openRenameDialog,
    openMoveDialog,
    selectCanvasNode,
  } = useSolutionStore();

  const node = allNodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const isFolder = node.type === "folder";
  const childNodes = isFolder
    ? allNodes.filter((n) => n.parentId === nodeId)
    : [];

  // Highlight if this node represents a selected agent (works for both folder and item agent types)
  const isSelected = !!node.agentId && node.agentId === selectedAgentId;

  const handleClick = () => {
    // If node has an agentId, select the agent regardless of folder/item type
    if (node.agentId) {
      const canvasNode = solution.canvasGraph.nodes.find(
        (n) => n.data?.agentId === node.agentId
      );
      if (canvasNode) selectCanvasNode(canvasNode.id);
    }
    // Always toggle folder expansion
    if (isFolder) {
      toggleNodeExpanded(nodeId);
    }
  };

  const indentPx = 8 + depth * 14;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 pr-1 py-[3px] cursor-pointer group rounded-sm mx-1",
          "hover:bg-muted/60 transition-colors",
          isSelected && "bg-blue-50 dark:bg-blue-950/50"
        )}
        style={{ paddingLeft: `${indentPx}px` }}
        onClick={handleClick}
      >
        {/* Expand arrow for folders */}
        {isFolder ? (
          <ChevronRight
            className={cn(
              "w-3 h-3 text-muted-foreground transition-transform shrink-0",
              node.expanded && "rotate-90"
            )}
          />
        ) : (
          <span className="w-3 shrink-0" />
        )}

        {/* Icon — agent folders get Bot icon, others use itemType */}
        {isFolder && node.itemType !== "agent" && node.itemType !== "process" ? (
          node.expanded ? (
            <FolderOpen className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          ) : (
            <Folder className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          )
        ) : (
          <ItemIcon itemType={node.itemType} section={node.section} />
        )}

        {/* Label */}
        <span
          className={cn(
            "text-[12px] flex-1 truncate leading-snug",
            isSelected
              ? "font-medium text-blue-700 dark:text-blue-300"
              : "text-foreground"
          )}
        >
          {node.label}
        </span>

        {/* Status badge (only for non-active) */}
        {node.status && node.status !== "active" && (
          <StatusBadge status={node.status} showLabel={false} className="shrink-0" />
        )}

        {/* Context menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 text-[12px]">
            <DropdownMenuItem
              className="gap-2 text-[12px]"
              onClick={(e) => { e.stopPropagation(); openRenameDialog(nodeId); }}
            >
              <Pencil className="w-3.5 h-3.5" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-[12px]"
              onClick={(e) => { e.stopPropagation(); openMoveDialog(nodeId); }}
            >
              <MoveRight className="w-3.5 h-3.5" /> Move to…
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-[12px] text-red-600 dark:text-red-400 focus:text-red-600"
              onClick={(e) => { e.stopPropagation(); deleteNode(nodeId); }}
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {isFolder && node.expanded && childNodes.length > 0 && (
        <div>
          {childNodes.map((child) => (
            <TreeItem
              key={child.id}
              nodeId={child.id}
              allNodes={allNodes}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
