"use client";

import { PanelRight, Terminal } from "lucide-react";
import { useSolutionStore } from "@/state/solutionStore";

const ICONS = [
  { id: "properties" as const, icon: PanelRight, title: "Properties" },
  { id: "output"     as const, icon: Terminal,   title: "Output"     },
];

export function RightIconRail() {
  const rightPanelView    = useSolutionStore((s) => s.rightPanelView);
  const setRightPanelView = useSolutionStore((s) => s.setRightPanelView);

  return (
    <div
      style={{
        width: 48,
        height: "100%",
        background: "#FFFFFF",
        borderLeft: "1px solid #CFD8DD",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 8,
        gap: 4,
        flexShrink: 0,
      }}
    >
      {ICONS.map(({ id, icon: Icon, title }) => {
        const isActive = rightPanelView === id;
        return (
          <button
            key={id}
            onClick={() => setRightPanelView(id)}
            title={title}
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isActive ? "#E9F1FA" : "none",
              border: isActive ? "1px solid #B8D4F5" : "1px solid transparent",
              cursor: "pointer",
              borderRadius: 4,
              color: isActive ? "#0067DF" : "#526069",
            }}
          >
            <Icon style={{ width: 16, height: 16 }} />
          </button>
        );
      })}
    </div>
  );
}
