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
    agentId: null,
  },
  {
    id: "definition",
    label: "Definition",
    icon: CircleDot,
    explorerNodeId: "sol-agent-def",
    agentId: "agent-1", // which agent's Definition file this tab represents
  },
] as const;

export function CanvasHeader() {
  const [active, setActive] = useState<string>("definition");
  const { setSelectedExplorerNode, setCanvasMode, setOpenAgentId } = useSolutionStore();

  const handleTabClick = (id: string, explorerNodeId: string, agentId: string | null) => {
    setActive(id);
    setSelectedExplorerNode(explorerNodeId);
    setCanvasMode(id === "bpmn" ? "process" : "agent");
    setOpenAgentId(agentId); // null when switching to process, agentId when switching to agent
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
      {TABS.map(({ id, label, icon: Icon, explorerNodeId, agentId }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => handleTabClick(id, explorerNodeId, agentId)}
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
