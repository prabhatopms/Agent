"use client";

import { Download, Info, Loader2, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { useSolutionStore } from "@/state/solutionStore";

const T = {
  foreground: "#273139",
  muted: "#526069",
  primary: "#0067DF",
  border: "#CFD8DD",
  secondaryBg: "#F4F5F7",
  white: "#FFFFFF",
  font: "'Noto Sans', system-ui, sans-serif",
} as const;

function StatusBadge({ status }: { status: "running" | "failed" | "success" }) {
  const configs = {
    running: { bg: "#E8F5E9", text: "#1B8A5A", icon: Loader2, label: "Running", spin: true },
    failed: { bg: "#FFF0EF", text: "#D52B1E", icon: AlertCircle, label: "Failed", spin: false },
    success: { bg: "#E8F5E9", text: "#1B8A5A", icon: CheckCircle2, label: "Success", spin: false },
  } as const;

  const cfg = configs[status];
  const Icon = cfg.icon;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: cfg.bg,
        borderRadius: 100,
        padding: "2px 8px",
      }}
    >
      <Icon
        className={cfg.spin ? "animate-spin" : undefined}
        style={{ width: 12, height: 12, color: cfg.text, flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: T.font,
          fontSize: 11,
          fontWeight: 600,
          color: cfg.text,
          lineHeight: "16px",
        }}
      >
        {cfg.label}
      </span>
    </div>
  );
}

export function OutputPanel() {
  const runStatus = useSolutionStore((s) => s.runStatus);
  const runLogs = useSolutionStore((s) => s.runLogs);
  const isRunning = useSolutionStore((s) => s.isRunning);

  const badgeStatus: "running" | "failed" | "success" | null = isRunning
    ? "running"
    : runStatus === "failed"
    ? "failed"
    : runStatus === "success"
    ? "success"
    : null;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderLeft: `1px solid ${T.border}`,
        background: T.white,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: T.font,
              fontSize: 14,
              fontWeight: 600,
              color: T.foreground,
            }}
          >
            Output
          </span>
          {badgeStatus && <StatusBadge status={badgeStatus} />}
        </div>
        <button
          title="Download logs"
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            borderRadius: 4,
            color: T.muted,
          }}
        >
          <Download style={{ width: 14, height: 14 }} />
        </button>
      </div>

      {/* Search bar */}
      <div
        style={{
          height: 32,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 10px",
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
          background: T.secondaryBg,
        }}
      >
        <Search style={{ width: 13, height: 13, color: T.muted, flexShrink: 0 }} />
        <span
          style={{
            fontFamily: T.font,
            fontSize: 12,
            color: T.muted,
          }}
        >
          Search logs...
        </span>
      </div>

      {/* Log list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {runLogs.length === 0 && isRunning && (
          <div
            style={{
              height: 32,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 12px",
            }}
          >
            <Loader2
              className="animate-spin"
              style={{ width: 13, height: 13, color: T.muted, flexShrink: 0 }}
            />
            <span style={{ fontFamily: T.font, fontSize: 12, color: T.muted }}>
              Initializing...
            </span>
          </div>
        )}
        {runLogs.map((log, i) => (
          <div
            key={i}
            style={{
              height: 28,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 12px",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <Info style={{ width: 13, height: 13, color: T.primary, flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: T.muted,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {log.time}
            </span>
            <span
              style={{
                fontFamily: T.font,
                fontSize: 12,
                color: T.foreground,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {log.message}
            </span>
          </div>
        ))}
        {runLogs.length === 0 && !isRunning && (
          <div
            style={{
              padding: 24,
              textAlign: "center",
              fontFamily: T.font,
              fontSize: 13,
              color: T.muted,
            }}
          >
            No logs available.
          </div>
        )}
      </div>
    </div>
  );
}
