"use client";

import { Bell, HelpCircle, ChevronDown } from "lucide-react";

export function GlobalHeader() {
  return (
    <header
      style={{
        height: 48,
        background: "#FFFFFF",
        borderBottom: "1px solid #CFD8DD",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 8,
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      {/* Logo + App name */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
        {/* 3×3 dot grid */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          {[0, 1, 2].flatMap((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={col * 6 + 1}
                y={row * 6 + 1}
                width="3"
                height="3"
                rx="0.5"
                fill="#0067DF"
              />
            ))
          )}
        </svg>
        <span
          style={{
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#182027",
            lineHeight: "20px",
          }}
        >
          UiPath Studio
        </span>
      </div>

      {/* Right: Bell, Help, Tenant, Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            borderRadius: 4,
          }}
          title="Notifications"
        >
          <Bell style={{ width: 16, height: 16, color: "#526069" }} />
        </button>
        <button
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            borderRadius: 4,
          }}
          title="Help"
        >
          <HelpCircle style={{ width: 16, height: 16, color: "#526069" }} />
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 8px",
            background: "none",
            border: "1px solid #CFD8DD",
            cursor: "pointer",
            borderRadius: 4,
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 13,
            color: "#273139",
          }}
        >
          Tenant: Production
          <ChevronDown style={{ width: 12, height: 12, color: "#526069" }} />
        </button>
        {/* Avatar */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#E5173B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            marginLeft: 4,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: "'Noto Sans', system-ui, sans-serif",
            }}
          >
            NA
          </span>
        </div>
      </div>
    </header>
  );
}
