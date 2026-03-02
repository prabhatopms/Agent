"use client";

import {
  ChevronLeft,
  ChevronRight,
  Undo2,
  Redo2,
  Play,
  FlaskConical,
  Upload,
  X,
} from "lucide-react";
import { useSolutionStore } from "@/state/solutionStore";

const BTN: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 10px",
  height: 28,
  background: "none",
  border: "none",
  cursor: "pointer",
  borderRadius: 4,
  fontFamily: "'Noto Sans', system-ui, sans-serif",
  fontSize: 13,
  color: "#273139",
  whiteSpace: "nowrap",
};

const ICON_BTN: React.CSSProperties = {
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  cursor: "pointer",
  borderRadius: 4,
  color: "#526069",
};

export function BuildToolbar() {
  const { isDirty } = useSolutionStore();

  return (
    <div
      style={{
        height: 40,
        background: "#FFFFFF",
        borderBottom: "1px solid #CFD8DD",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 4,
        flexShrink: 0,
        zIndex: 19,
      }}
    >
      {/* Back arrow */}
      <button style={ICON_BTN} title="Back">
        <ChevronLeft style={{ width: 16, height: 16 }} />
      </button>

      {/* Breadcrumb */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          fontFamily: "'Noto Sans', system-ui, sans-serif",
          fontSize: 13,
          color: "#526069",
          flex: 1,
        }}
      >
        <span style={{ cursor: "pointer" }}>Solution</span>
        <ChevronRight style={{ width: 14, height: 14, color: "#A4B1B8" }} />
        <span
          style={{
            fontWeight: 600,
            color: "#182027",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          New Agent
          {isDirty && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#FFB40E",
                display: "inline-block",
              }}
            />
          )}
        </span>
      </nav>

      {/* Right: Undo/Redo + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <button style={ICON_BTN} title="Undo">
          <Undo2 style={{ width: 15, height: 15 }} />
        </button>
        <button style={ICON_BTN} title="Redo">
          <Redo2 style={{ width: 15, height: 15 }} />
        </button>

        {/* separator */}
        <div
          style={{
            width: 1,
            height: 20,
            background: "#CFD8DD",
            margin: "0 6px",
          }}
        />

        <button style={{ ...BTN, color: "#273139" }} title="Debug">
          <Play style={{ width: 13, height: 13 }} />
          Debug
        </button>

        <button style={{ ...BTN, color: "#273139" }} title="Evaluate">
          <FlaskConical style={{ width: 13, height: 13 }} />
          Evaluate
        </button>

        <button
          style={{
            ...BTN,
            background: "#0067DF",
            color: "#FFFFFF",
            fontWeight: 600,
          }}
          title="Publish"
        >
          <Upload style={{ width: 13, height: 13 }} />
          Publish
        </button>

        {/* separator */}
        <div
          style={{
            width: 1,
            height: 20,
            background: "#CFD8DD",
            margin: "0 6px",
          }}
        />

        <button style={ICON_BTN} title="Close">
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}
