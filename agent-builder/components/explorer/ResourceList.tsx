"use client";

import { useSolutionStore } from "@/state/solutionStore";
import { TreeItem } from "./TreeItem";

export function ResourceList() {
  const { solution } = useSolutionStore();

  const resourceNodes = solution.explorerTree.filter(
    (n) => n.section === "resources"
  );

  const rootNodes = resourceNodes.filter((n) => n.parentId === null);

  return (
    <div className="py-1">
      {rootNodes.map((node) => (
        <TreeItem
          key={node.id}
          nodeId={node.id}
          allNodes={resourceNodes}
          depth={0}
        />
      ))}
    </div>
  );
}
