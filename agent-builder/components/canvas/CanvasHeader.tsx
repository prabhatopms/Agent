"use client";

import { useState } from "react";
import { FileCode2, CircleDot } from "lucide-react";
import { useSolutionStore } from "@/state/solutionStore";

const TABS = [
  {
    id: "bpmn",
    label: "Invoice Processing.bpmn",
    icon: FileCode2,
    explorerNodeId: "sol-bpmn-1",
  },
  {
    id: "definition",
    label: "Definition",
    icon: CircleDot,
    explorerNodeId: "sol-agent-def",
  },
] as const;

export function CanvasHeader() {
  const [active, setActive] = useState<string>("definition");
  const { setSelectedExplorerNode, setCanvasMode } = useSolutionStore();

  const handleTabClick = (id: string, explorerNodeId: string) => {
    setActive(id);
    setSelectedExplorerNode(explorerNodeId);
    setCanvasMode(id === "bpmn" ? "process" : "agent");
  };

  return (
    <div
      style={{
        height: 36,
        background: "#ffffff",
        borderBottom: "1px solid #CFD8DD",
        display: "flex",
        alignItems: "stretch",
        flexShrink: 0,
      }}
    >
      {TABS.map(({ id, label, icon: Icon, explorerNodeId }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => handleTabClick(id, explorerNodeId)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 16px",
              height: "100%",
              background: "none",
              border: "none",
              borderBottom: isActive
                ? "2px solid #0067DF"
                : "2px solid transparent",
              cursor: "pointer",
              fontFamily: "'Noto Sans', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              lineHeight: "20px",
              color: isActive ? "#0067DF" : "#526069",
              whiteSpace: "nowrap",
              marginBottom: -1,
            }}
          >
            <Icon
              style={{
                width: 14,
                height: 14,
                color: isActive ? "#0067DF" : "#526069",
                flexShrink: 0,
              }}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
