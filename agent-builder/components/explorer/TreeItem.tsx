"use client";

import {
  ChevronRight,
  Folder,
  FolderOpen,
  Bot,
  GitBranch,
  Package,
  Network,
  Layers,
  Database,
  List,
  HardDrive,
  MoreHorizontal,
  Pencil,
  Trash2,
  MoveRight,
  FileCode2,
  CircleDot,
  Activity,
  Braces,
  LayoutGrid,
  Table2,
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

// Entity diamond SVG matching Figma resource list icon
function DiamondIcon({ size = 14, color = "#526069" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M7 1.5L12 7L7 12.5L2 7L7 1.5Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M7 4L9.5 7L7 10L4.5 7L7 4Z" fill={color} />
    </svg>
  );
}

function ItemIcon({ itemType, section }: { itemType?: string; section: string }) {
  switch (itemType ?? section) {
    case "agent":      return <Bot className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    case "process":    return <GitBranch className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    case "asset":      return <Package className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    case "connection": return <Network className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    case "context":    return <Layers className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    case "memory":     return <Database className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    case "queue":      return <List className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    case "storage":    return <HardDrive className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    // Solution tree types — matching Figma icons
    case "definition": return <CircleDot className="w-3.5 h-3.5 shrink-0" style={{ color: "#0067DF" }} />;
    case "evaluation": return <Activity className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    case "evaluators": return <Braces className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    case "bpmn":       return <FileCode2 className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    // Resource section types
    case "apps":       return <LayoutGrid className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    case "assets":
    case "asset-group":return <Table2 className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    case "entities":   return <DiamondIcon color="#526069" />;
    case "entity":     return <CircleDot className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
    default:           return <FileCode2 className="w-3.5 h-3.5 shrink-0" style={{ color: "#526069" }} />;
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
    selectedExplorerNodeId,
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

  // Highlight if this node represents a selected agent OR is the active explorer item
  const isSelected =
    (!!node.agentId && node.agentId === selectedAgentId) ||
    node.id === selectedExplorerNodeId;

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
          "flex items-center gap-1.5 pr-1 py-[3px] cursor-pointer group",
          "hover:bg-[#F4F5F7] transition-colors",
        )}
        style={{
          paddingLeft: `${indentPx}px`,
          background: isSelected ? "#E9F1FA" : undefined,
          borderLeft: isSelected ? "2px solid #0067DF" : "2px solid transparent",
        }}
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
          style={{
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 13,
            lineHeight: "20px",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: isSelected ? 600 : 400,
            color: isSelected ? "#0067DF" : "#273139",
          }}
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
