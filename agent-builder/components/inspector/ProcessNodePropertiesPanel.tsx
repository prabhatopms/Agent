"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ProcessNodePropertiesPanel — Properties panel for BPMN process canvas nodes.
// Shown when a node is selected on the Process (BPMN) canvas.
// Shows General section (name, ID, description) + type-specific section.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import {
  Settings,
  CircleDot,
  Diamond,
  Play,
  User,
  Bot,
  MousePointerClick,
} from "lucide-react";
import { useSolutionStore } from "@/state/solutionStore";

// ─── Design tokens (matching InspectorPanel) ──────────────────────────────────
const T = {
  font: "'Noto Sans', system-ui, sans-serif",
  foreground: "#273139",
  muted: "#526069",
  deemphasized: "#8A97A0",
  border: "#CFD8DD",
  sectionBg: "#F8F9FA",
  inputBorder: "#D0D7DE",
  primary: "#0067DF",
} as const;

// ─── Node type metadata ───────────────────────────────────────────────────────
const NODE_META: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  serviceTask:  { label: "Service Task",  color: "#0067DF", bg: "#E9F1FA", Icon: Settings  },
  userTask:     { label: "User Task",     color: "#0067DF", bg: "#E9F1FA", Icon: User       },
  gateway:      { label: "Gateway",       color: "#92400E", bg: "#FEF3C7", Icon: Diamond    },
  agentAction:  { label: "Agent Action",  color: "#6D28D9", bg: "#EDE9FE", Icon: Bot        },
  startEvent:   { label: "Start Event",   color: "#065F46", bg: "#D1FAE5", Icon: Play       },
  endEvent:     { label: "End Event",     color: "#991B1B", bg: "#FEE2E2", Icon: CircleDot  },
};

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{
      padding: "8px 16px 4px",
      fontFamily: T.font,
      fontSize: 11,
      fontWeight: 600,
      color: T.muted,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      background: T.sectionBg,
      borderBottom: `1px solid ${T.border}`,
    }}>
      {title}
    </div>
  );
}

// ─── Field row ────────────────────────────────────────────────────────────────
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "8px 16px",
      borderBottom: `1px solid ${T.border}`,
    }}>
      <span style={{
        fontFamily: T.font, fontSize: 12, color: T.muted,
        width: 80, flexShrink: 0, paddingTop: 3, lineHeight: "18px",
      }}>
        {label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, readOnly }: {
  value: string; onChange?: (v: string) => void; placeholder?: string; readOnly?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      style={{
        width: "100%",
        height: 26,
        border: `1px solid ${readOnly ? "transparent" : T.inputBorder}`,
        borderRadius: 3,
        padding: "0 8px",
        fontFamily: T.font,
        fontSize: 12,
        color: readOnly ? T.muted : T.foreground,
        background: readOnly ? "transparent" : "#FFFFFF",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}

function TextArea({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      style={{
        width: "100%",
        border: `1px solid ${T.inputBorder}`,
        borderRadius: 3,
        padding: "6px 8px",
        fontFamily: T.font,
        fontSize: 12,
        color: T.foreground,
        background: "#FFFFFF",
        outline: "none",
        resize: "vertical",
        boxSizing: "border-box",
      }}
    />
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 7px",
      borderRadius: 4,
      fontFamily: T.font, fontSize: 11, fontWeight: 600,
      color, background: bg,
    }}>
      {label}
    </span>
  );
}

// ─── Type-specific section ────────────────────────────────────────────────────
function TypeSpecificSection({
  nodeType,
  data,
  onPatch,
}: {
  nodeType: string;
  data: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
}) {
  const agents = useSolutionStore((s) => s.solution.agents);

  switch (nodeType) {
    case "serviceTask":
      return (
        <>
          <SectionHeader title="Implementation" />
          <FieldRow label="Type">
            <select
              value={(data.implType as string) ?? "none"}
              onChange={(e) => onPatch({ implType: e.target.value })}
              style={{
                height: 26, border: `1px solid ${T.inputBorder}`, borderRadius: 3,
                padding: "0 6px", fontFamily: T.font, fontSize: 12, color: T.foreground,
                background: "#FFFFFF", cursor: "pointer", width: "100%",
              }}
            >
              <option value="none">None</option>
              <option value="script">Script Task</option>
              <option value="webservice">Web Service</option>
            </select>
          </FieldRow>
          <FieldRow label="Input">
            <span style={{ fontFamily: T.font, fontSize: 12, color: T.deemphasized, fontStyle: "italic" }}>
              No inputs configured
            </span>
          </FieldRow>
        </>
      );

    case "agentAction":
      return (
        <>
          <SectionHeader title="Agent Configuration" />
          <FieldRow label="Agent">
            <select
              value={(data.agentName as string) ?? ""}
              onChange={(e) => onPatch({ agentName: e.target.value, label: e.target.value })}
              style={{
                height: 26, border: `1px solid ${T.inputBorder}`, borderRadius: 3,
                padding: "0 6px", fontFamily: T.font, fontSize: 12, color: T.foreground,
                background: "#FFFFFF", cursor: "pointer", width: "100%",
              }}
            >
              {agents.map((a) => (
                <option key={a.id} value={a.name}>{a.name}</option>
              ))}
            </select>
          </FieldRow>
          <FieldRow label="Input params">
            <span style={{ fontFamily: T.font, fontSize: 12, color: T.deemphasized, fontStyle: "italic" }}>
              No parameters mapped
            </span>
          </FieldRow>
          <FieldRow label="Output">
            <span style={{ fontFamily: T.font, fontSize: 12, color: T.deemphasized, fontStyle: "italic" }}>
              No output mapping
            </span>
          </FieldRow>
        </>
      );

    case "gateway":
      return (
        <>
          <SectionHeader title="Gateway" />
          <FieldRow label="Type">
            <Badge label="Exclusive Gateway" color="#92400E" bg="#FEF3C7" />
          </FieldRow>
          <FieldRow label="Conditions">
            <span style={{ fontFamily: T.font, fontSize: 12, color: T.deemphasized, fontStyle: "italic" }}>
              Configured via sequence flow labels
            </span>
          </FieldRow>
        </>
      );

    case "startEvent":
      return (
        <>
          <SectionHeader title="Trigger" />
          <FieldRow label="Type">
            <Badge label="Message Start" color="#065F46" bg="#D1FAE5" />
          </FieldRow>
        </>
      );

    case "endEvent":
      return (
        <>
          <SectionHeader title="Outcome" />
          <FieldRow label="Variant">
            <div style={{ display: "flex", gap: 8 }}>
              {(["green", "red"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => onPatch({ variant: v })}
                  style={{
                    height: 24, padding: "0 10px", borderRadius: 12,
                    border: `1.5px solid ${(data.variant ?? "green") === v ? (v === "green" ? "#065F46" : "#991B1B") : T.border}`,
                    background: (data.variant ?? "green") === v ? (v === "green" ? "#D1FAE5" : "#FEE2E2") : "#FFFFFF",
                    cursor: "pointer", fontFamily: T.font, fontSize: 11, fontWeight: 600,
                    color: v === "green" ? "#065F46" : "#991B1B",
                  }}
                >
                  {v === "green" ? "Resolved" : "Escalated"}
                </button>
              ))}
            </div>
          </FieldRow>
        </>
      );

    case "userTask":
      return (
        <>
          <SectionHeader title="Assignment" />
          <FieldRow label="Assignee">
            <TextInput
              value={(data.assignee as string) ?? ""}
              onChange={(v) => onPatch({ assignee: v })}
              placeholder="e.g. {currentUser}"
            />
          </FieldRow>
          <FieldRow label="Instructions">
            <TextArea
              value={(data.instructions as string) ?? ""}
              onChange={(v) => onPatch({ instructions: v })}
              placeholder="Task instructions for the assignee…"
            />
          </FieldRow>
        </>
      );

    default:
      return null;
  }
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export function ProcessNodePropertiesPanel() {
  const selectedNodeId       = useSolutionStore((s) => s.selectedNodeId);
  const selectedCanvasNodeType = useSolutionStore((s) => s.selectedCanvasNodeType);
  const processCanvasNodes   = useSolutionStore((s) => s.processCanvasNodes);
  const updateProcessNodeData = useSolutionStore((s) => s.updateProcessNodeData);

  const node = processCanvasNodes.find((n) => n.id === selectedNodeId);
  const nodeType = selectedCanvasNodeType ?? node?.type ?? "";
  const meta = NODE_META[nodeType];

  // Local editable state (name, description) — synced to store on change
  const [name, setName]        = useState<string>("");
  const [description, setDesc] = useState<string>("");

  useEffect(() => {
    if (node) {
      setName((node.data?.label as string) ?? (node.data?.agentName as string) ?? "");
      setDesc((node.data?.description as string) ?? "");
    }
  }, [selectedNodeId, node]);

  if (!node || !meta) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 border-l border-border text-center px-6">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <MousePointerClick className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-[13px] font-semibold text-foreground">No node selected</p>
        <p className="text-[12px] text-muted-foreground">
          Click a node on the process canvas to view its properties.
        </p>
      </div>
    );
  }

  const { Icon } = meta;

  const handleNameChange = (v: string) => {
    setName(v);
    updateProcessNodeData(node.id, { label: v });
  };

  const handleDescChange = (v: string) => {
    setDesc(v);
    updateProcessNodeData(node.id, { description: v });
  };

  const handlePatch = (patch: Record<string, unknown>) => {
    updateProcessNodeData(node.id, patch);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", borderLeft: `1px solid ${T.border}`, background: "#FFFFFF", overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: `1px solid ${T.border}`,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon style={{ width: 14, height: 14, color: meta.color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.foreground, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {name || meta.label}
          </div>
          <div style={{ fontFamily: T.font, fontSize: 11, color: T.muted }}>{meta.label}</div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* General section */}
        <SectionHeader title="General" />
        <FieldRow label="Name">
          <TextInput value={name} onChange={handleNameChange} placeholder="Node name" />
        </FieldRow>
        <FieldRow label="ID">
          <TextInput value={node.id} readOnly />
        </FieldRow>
        <FieldRow label="Description">
          <TextArea value={description} onChange={handleDescChange} placeholder="Optional description…" />
        </FieldRow>

        {/* Type-specific section */}
        <TypeSpecificSection
          nodeType={nodeType}
          data={node.data as Record<string, unknown>}
          onPatch={handlePatch}
        />
      </div>
    </div>
  );
}
