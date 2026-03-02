"use client";

import { useSolutionStore } from "@/state/solutionStore";
import { TreeItem } from "./TreeItem";

interface SolutionTreeProps {
  searchQuery: string;
}

export function SolutionTree({ searchQuery }: SolutionTreeProps) {
  const { solution } = useSolutionStore();

  const solutionNodes = solution.explorerTree.filter(
    (n) => n.section === "solution"
  );

  // When searching, flatten and filter all nodes
  if (searchQuery.trim()) {
    const filtered = solutionNodes.filter((n) =>
      n.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length === 0) {
      return (
        <p className="px-4 py-2 text-[11px] text-muted-foreground italic">
          No results in solution.
        </p>
      );
    }
    return (
      <div className="py-1">
        {filtered.map((node) => (
          <TreeItem
            key={node.id}
            nodeId={node.id}
            allNodes={solutionNodes}
            depth={0}
          />
        ))}
      </div>
    );
  }

  // Normal tree: render root nodes (parentId === null)
  const rootNodes = solutionNodes.filter((n) => n.parentId === null);

  return (
    <div className="py-1">
      {rootNodes.map((node) => (
        <TreeItem
          key={node.id}
          nodeId={node.id}
          allNodes={solutionNodes}
          depth={0}
        />
      ))}
    </div>
  );
}
