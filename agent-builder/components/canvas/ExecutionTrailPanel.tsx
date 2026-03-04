"use client";

import { Fragment, useState } from "react";
import {
  Bot,
  Brain,
  ChevronDown,
  ChevronRight,
  Code2,
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter,
  Download,
  AlignJustify,
  Loader2,
  AlertOctagon,
  CheckCircle2,
  X,
  Info,
  ClipboardList,
} from "lucide-react";
import { useSolutionStore } from "@/state/solutionStore";
import type { TraceNode, HistoryRun } from "@/state/solutionStore";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  foreground: "#273139",
  muted: "#526069",
  deemphasized: "#6B7882",
  primary: "#0067DF",
  selectedBg: "#E9F1FA",
  secondaryBg: "#F4F5F7",
  border: "#CFD8DD",
  white: "#FFFFFF",
  error: "#D52B1E",
  font: "'Noto Sans', system-ui, sans-serif",
} as const;

// ─── Icon button ──────────────────────────────────────────────────────────────
function TrailIconBtn({
  icon: Icon,
  title,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        borderRadius: "100px",
        flexShrink: 0,
        color: T.muted,
      }}
    >
      <Icon style={{ width: 16, height: 16 }} />
    </button>
  );
}

// ─── Leading icon badge ───────────────────────────────────────────────────────
function LeadingBadge({ type }: { type: TraceNode["type"] }) {
  const Icon = type === "run" ? Bot : Brain;
  return (
    <div
      style={{
        background: T.secondaryBg,
        borderRadius: 3,
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon style={{ width: 16, height: 16, color: T.muted }} />
    </div>
  );
}

// ─── Status indicator ─────────────────────────────────────────────────────────
function StatusDot({ status }: { status: TraceNode["status"] }) {
  if (status === "pending" || status === "running") {
    return (
      <Loader2
        className="animate-spin"
        style={{ width: 14, height: 14, color: T.muted, flexShrink: 0 }}
      />
    );
  }
  if (status === "failure") {
    return (
      <AlertOctagon
        style={{ width: 14, height: 14, color: T.error, flexShrink: 0 }}
      />
    );
  }
  return null;
}

// ─── Collapsible section ──────────────────────────────────────────────────────
function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  errorStyle = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  errorStyle?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          height: 32,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 8px",
          background: "none",
          border: "none",
          borderBottom: `1px solid ${T.border}`,
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        {open ? (
          <ChevronDown style={{ width: 16, height: 16, color: T.muted, flexShrink: 0 }} />
        ) : (
          <ChevronRight style={{ width: 16, height: 16, color: T.muted, flexShrink: 0 }} />
        )}
        <span
          style={{
            fontFamily: T.font,
            fontSize: 14,
            fontWeight: 600,
            color: errorStyle ? T.error : T.foreground,
          }}
        >
          {title}
        </span>
      </button>
      {open && children}
    </div>
  );
}

// ─── Field row (Tt key: value) ────────────────────────────────────────────────
function FieldRow({
  name,
  value,
  valueColor,
}: {
  name: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        minHeight: 32,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px 6px 24px",
        borderBottom: `1px solid ${T.border}`,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: T.muted,
          border: `1px solid ${T.border}`,
          borderRadius: 2,
          padding: "0 3px",
          lineHeight: "16px",
          flexShrink: 0,
        }}
      >
        Tt
      </span>
      <span
        style={{
          fontFamily: T.font,
          fontSize: 13,
          color: T.muted,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {name}:
      </span>
      <span
        style={{
          fontFamily: T.font,
          fontSize: 13,
          color: valueColor ?? T.primary,
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: 1,
          minWidth: 0,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Generic trace row (props-based) ─────────────────────────────────────────
function TraceRow({
  node,
  depth,
  isSelected,
  hasChildren,
  isCollapsed,
  onToggle,
  onClick,
}: {
  node: TraceNode;
  depth: number;
  isSelected: boolean;
  hasChildren: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        height: 32,
        display: "flex",
        alignItems: "center",
        gap: 6,
        paddingRight: 8,
        cursor: "pointer",
        flexShrink: 0,
        width: "100%",
        boxSizing: "border-box",
        background: isSelected ? T.selectedBg : "transparent",
        borderLeft: `4px solid ${isSelected ? T.primary : "transparent"}`,
        paddingLeft: 8 + depth * 16,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) onToggle();
        }}
        style={{
          width: 16,
          height: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: hasChildren ? "pointer" : "default",
          opacity: hasChildren ? 1 : 0,
          padding: 0,
          flexShrink: 0,
          color: T.muted,
        }}
      >
        {isCollapsed ? (
          <ChevronRight style={{ width: 14, height: 14 }} />
        ) : (
          <ChevronDown style={{ width: 14, height: 14 }} />
        )}
      </button>

      <LeadingBadge type={node.type} />

      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          gap: 6,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: T.font,
            fontSize: 13,
            color: T.foreground,
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flexShrink: 0,
          }}
        >
          {node.label}
        </span>
        {node.model && (
          <div
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: 2,
              padding: "0 4px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: T.font,
                fontSize: 10,
                color: T.muted,
                lineHeight: "16px",
              }}
            >
              {node.model}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
        <StatusDot status={node.status} />
        <span
          style={{
            fontFamily: T.font,
            fontSize: 12,
            color: T.deemphasized,
            lineHeight: "16px",
            width: 52,
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          {node.durationSeconds != null
            ? `${node.durationSeconds.toFixed(2)} s`
            : "—"}
        </span>
      </div>
    </div>
  );
}

// ─── Generic trace tree view (props-based) ───────────────────────────────────
function TraceTreeView({
  root,
  selectedNodeId,
  onSelect,
}: {
  root: TraceNode;
  selectedNodeId: string | null;
  onSelect: (id: string) => void;
}) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const renderNode = (node: TraceNode, depth: number) => {
    const hasChildren = (node.children?.length ?? 0) > 0;
    const isCollapsed = collapsedIds.has(node.id);
    return (
      <Fragment key={node.id}>
        <TraceRow
          node={node}
          depth={depth}
          isSelected={node.id === selectedNodeId}
          hasChildren={hasChildren}
          isCollapsed={isCollapsed}
          onToggle={() => toggle(node.id)}
          onClick={() => onSelect(node.id)}
        />
        {!isCollapsed &&
          node.children?.map((child) => renderNode(child, depth + 1))}
      </Fragment>
    );
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {renderNode(root, 0)}
    </div>
  );
}

// ─── Generic trace detail view (props-based, local tab state) ─────────────────
function TraceDetailView({
  root,
  selectedNodeId,
}: {
  root: TraceNode;
  selectedNodeId: string | null;
}) {
  const [activeTab, setActiveTab] = useState<"results" | "metadata" | "feedback">("results");

  const findNode = (node: TraceNode, id: string): TraceNode | null => {
    if (node.id === id) return node;
    for (const child of node.children ?? []) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const selectedNode = selectedNodeId
    ? findNode(root, selectedNodeId) ?? root
    : root;

  const TABS = ["results", "metadata", "feedback"] as const;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: T.white,
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8px",
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{
              background: T.secondaryBg,
              borderRadius: 3,
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bot style={{ width: 20, height: 20, color: T.muted }} />
          </div>
          <span
            style={{
              fontFamily: T.font,
              fontSize: 14,
              fontWeight: 600,
              color: T.foreground,
              lineHeight: "20px",
            }}
          >
            {selectedNode.label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 1, height: 24, background: T.border }} />
          <TrailIconBtn icon={Code2} title="View code" />
          <div style={{ width: 1, height: 24, background: T.border }} />
          <TrailIconBtn icon={ThumbsUp} title="Thumbs up" />
          <TrailIconBtn icon={ThumbsDown} title="Thumbs down" />
        </div>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          paddingLeft: 8,
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
          height: 34,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          const label = tab.charAt(0).toUpperCase() + tab.slice(1);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0 8px",
                height: 34,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: T.font,
                fontSize: 13,
                fontWeight: 600,
                color: isActive ? T.primary : T.foreground,
                borderBottom: isActive
                  ? `4px solid ${T.primary}`
                  : "4px solid transparent",
                marginBottom: -1,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "results" && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {selectedNode.errors &&
              Object.keys(selectedNode.errors).length > 0 && (
                <CollapsibleSection title="Errors" errorStyle>
                  <div style={{ padding: "8px 12px" }}>
                    <div
                      style={{
                        border: `1px solid #FCBAB7`,
                        background: "#FFF5F5",
                        borderRadius: 4,
                        padding: 12,
                        fontFamily: T.font,
                        fontSize: 13,
                        color: T.error,
                        lineHeight: "20px",
                      }}
                    >
                      {Object.entries(selectedNode.errors).map(([, v]) => v).join("\n")}
                    </div>
                  </div>
                </CollapsibleSection>
              )}
            {selectedNode.explanation && (
              <CollapsibleSection title="Explanation">
                <div style={{ padding: "8px 12px" }}>
                  <div
                    style={{
                      border: `1px solid ${T.border}`,
                      borderRadius: 4,
                      padding: 12,
                      fontFamily: T.font,
                      fontSize: 13,
                      color: T.foreground,
                      lineHeight: "20px",
                    }}
                  >
                    {selectedNode.explanation}
                  </div>
                </div>
              </CollapsibleSection>
            )}
            {selectedNode.inputs &&
              Object.keys(selectedNode.inputs).length > 0 && (
                <CollapsibleSection title="Inputs">
                  {Object.entries(selectedNode.inputs).map(([key, val]) => (
                    <FieldRow key={key} name={key} value={val} />
                  ))}
                </CollapsibleSection>
              )}
            {selectedNode.outputs &&
              Object.keys(selectedNode.outputs).length > 0 && (
                <CollapsibleSection title="Outputs">
                  {Object.entries(selectedNode.outputs).map(([key, val]) => (
                    <FieldRow key={key} name={key} value={val} />
                  ))}
                </CollapsibleSection>
              )}
            {!selectedNode.errors &&
              !selectedNode.explanation &&
              !selectedNode.inputs &&
              !selectedNode.outputs && (
                <div
                  style={{
                    padding: 24,
                    textAlign: "center",
                    fontFamily: T.font,
                    fontSize: 13,
                    color: T.muted,
                  }}
                >
                  No results available.
                </div>
              )}
          </div>
        )}
        {activeTab === "metadata" && (
          <div style={{ padding: 24, textAlign: "center", fontFamily: T.font, fontSize: 13, color: T.muted }}>
            Metadata not available in this prototype.
          </div>
        )}
        {activeTab === "feedback" && (
          <div style={{ padding: 24, textAlign: "center", fontFamily: T.font, fontSize: 13, color: T.muted }}>
            Feedback not available in this prototype.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Execution Trail tab content ──────────────────────────────────────────────
function ExecutionTrailTabContent() {
  const agentTrace = useSolutionStore((s) => s.agentTrace);
  const isRunning = useSolutionStore((s) => s.isRunning);
  const trailSelectedNodeId = useSolutionStore((s) => s.trailSelectedNodeId);
  const selectTrailNode = useSolutionStore((s) => s.selectTrailNode);

  if (isRunning || !agentTrace) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {isRunning && (
          <Loader2
            className="animate-spin"
            style={{ width: 20, height: 20, color: T.muted }}
          />
        )}
        <span
          style={{
            fontFamily: T.font,
            fontSize: 13,
            color: T.muted,
          }}
        >
          {isRunning
            ? "Running agent..."
            : "No traces yet. Click Debug to start a run."}
        </span>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Left pane: header + tree */}
      <div
        style={{
          width: 360,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${T.border}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 36,
            display: "flex",
            alignItems: "center",
            padding: "0 4px 0 8px",
            borderBottom: `1px solid ${T.border}`,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              flex: 1,
              fontFamily: T.font,
              fontSize: 13,
              fontWeight: 600,
              color: T.foreground,
            }}
          >
            Execution trail
          </span>
          <TrailIconBtn icon={AlignJustify} title="Collapse all" />
          <TrailIconBtn icon={Download} title="Export" />
          <TrailIconBtn icon={Filter} title="Filter" />
          <TrailIconBtn icon={Search} title="Search" />
        </div>
        <TraceTreeView
          root={agentTrace}
          selectedNodeId={trailSelectedNodeId}
          onSelect={selectTrailNode}
        />
      </div>

      {/* Right pane: detail */}
      <TraceDetailView root={agentTrace} selectedNodeId={trailSelectedNodeId} />
    </div>
  );
}

// ─── History tab content ──────────────────────────────────────────────────────
function HistoryTabContent() {
  const traceHistory = useSolutionStore((s) => s.traceHistory);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(
    traceHistory.length > 0 ? traceHistory[0].id : null
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    traceHistory.length > 0 ? traceHistory[0].trace.id : null
  );

  const selectedRun = traceHistory.find((r) => r.id === selectedRunId) ?? null;

  const handleSelectRun = (run: HistoryRun) => {
    setSelectedRunId(run.id);
    setSelectedNodeId(run.trace.id);
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Left: run list */}
      <div
        style={{
          width: 280,
          flexShrink: 0,
          borderRight: `1px solid ${T.border}`,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {traceHistory.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: T.font,
              fontSize: 13,
              color: T.muted,
              padding: 24,
              textAlign: "center",
            }}
          >
            No runs yet. Click Debug to start.
          </div>
        ) : (
          traceHistory.map((run) => {
            const isSelected = run.id === selectedRunId;
            return (
              <div
                key={run.id}
                onClick={() => handleSelectRun(run)}
                style={{
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 12px",
                  cursor: "pointer",
                  flexShrink: 0,
                  background: isSelected ? T.selectedBg : "transparent",
                  borderLeft: `4px solid ${isSelected ? T.primary : "transparent"}`,
                  borderBottom: `1px solid ${T.border}`,
                  boxSizing: "border-box",
                }}
              >
                {run.status === "failure" ? (
                  <AlertOctagon style={{ width: 14, height: 14, color: T.error, flexShrink: 0 }} />
                ) : (
                  <CheckCircle2 style={{ width: 14, height: 14, color: "#1B8A5A", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: T.font,
                      fontSize: 13,
                      color: T.foreground,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {run.label}
                  </div>
                  <div style={{ fontFamily: T.font, fontSize: 11, color: T.muted }}>
                    {run.time}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Right: trace view */}
      {selectedRun ? (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div
            style={{
              width: 320,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              borderRight: `1px solid ${T.border}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 36,
                display: "flex",
                alignItems: "center",
                padding: "0 8px",
                borderBottom: `1px solid ${T.border}`,
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.foreground }}>
                Execution trail
              </span>
            </div>
            <TraceTreeView
              root={selectedRun.trace}
              selectedNodeId={selectedNodeId}
              onSelect={setSelectedNodeId}
            />
          </div>
          <TraceDetailView root={selectedRun.trace} selectedNodeId={selectedNodeId} />
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: T.font,
            fontSize: 13,
            color: T.muted,
          }}
        >
          Select a run to view details.
        </div>
      )}
    </div>
  );
}

// ─── Evaluations tab content ──────────────────────────────────────────────────
function EvaluationsTabContent() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Left: evaluation sets */}
      <div
        style={{
          width: 280,
          flexShrink: 0,
          borderRight: `1px solid ${T.border}`,
          overflowY: "auto",
        }}
      >
        <div
          onClick={() => setSelected("default")}
          style={{
            height: 44,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 12px",
            cursor: "pointer",
            background: selected === "default" ? T.selectedBg : "transparent",
            borderLeft: `4px solid ${selected === "default" ? T.primary : "transparent"}`,
            borderBottom: `1px solid ${T.border}`,
            boxSizing: "border-box",
          }}
        >
          <ClipboardList style={{ width: 14, height: 14, color: T.muted, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.font, fontSize: 13, color: T.foreground }}>
              Default Evaluation Set
            </div>
            <div style={{ fontFamily: T.font, fontSize: 11, color: T.muted }}>
              0 evaluators configured
            </div>
          </div>
        </div>
      </div>

      {/* Right: evaluation details */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: T.font,
          fontSize: 13,
          color: T.muted,
        }}
      >
        {selected === null
          ? "Select an evaluation set to view results."
          : "No evaluation results available in this prototype."}
      </div>
    </div>
  );
}

// ─── Main ExecutionTrailPanel ─────────────────────────────────────────────────
export function ExecutionTrailPanel() {
  const trailSection = useSolutionStore((s) => s.trailSection);
  const setTrailSection = useSolutionStore((s) => s.setTrailSection);
  const historyBadgeCount = useSolutionStore((s) => s.historyBadgeCount);
  const exitDebugMode = useSolutionStore((s) => s.exitDebugMode);

  const tabConfigs = [
    { id: "execution-trail" as const, label: "Execution trail", badge: 0 },
    { id: "history" as const, label: "History", badge: historyBadgeCount },
    { id: "evaluations" as const, label: "Evaluations", badge: 0 },
  ];

  return (
    <div
      style={{
        height: 400,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderTop: `1px solid ${T.border}`,
        background: T.white,
        overflow: "hidden",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          height: 36,
          display: "flex",
          alignItems: "flex-end",
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
          paddingLeft: 8,
        }}
      >
        {tabConfigs.map((tab) => {
          const isActive = trailSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTrailSection(tab.id)}
              style={{
                padding: "0 10px",
                height: 36,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: T.font,
                fontSize: 13,
                fontWeight: 600,
                color: isActive ? T.primary : T.foreground,
                borderBottom: isActive
                  ? `3px solid ${T.primary}`
                  : "3px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
              }}
            >
              {tab.label}
              {tab.badge > 0 && (
                <span
                  style={{
                    background: T.primary,
                    color: "#FFFFFF",
                    borderRadius: "100px",
                    padding: "0 5px",
                    fontSize: 10,
                    lineHeight: "16px",
                    minWidth: 16,
                    textAlign: "center",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <TrailIconBtn icon={X} title="Close panel" onClick={exitDebugMode} />
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
        {trailSection === "execution-trail" && <ExecutionTrailTabContent />}
        {trailSection === "history" && <HistoryTabContent />}
        {trailSection === "evaluations" && <EvaluationsTabContent />}
      </div>
    </div>
  );
}
