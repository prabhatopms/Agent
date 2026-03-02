"use client";

import { Globe } from "lucide-react";

const SELECTED_ENTITIES = [
  { id: "tenant", label: "Tenant", icon: true },
  { id: "customer", label: "Customer", icon: false },
  { id: "orders", label: "Orders", icon: false },
];

export function EntitiesPanel() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF", borderLeft: "1px solid #CFD8DD" }}>
      {/* Header */}
      <div style={{
        height: 36,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 16px",
        borderBottom: "1px solid #CFD8DD",
        flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#526069" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M4 7L12 12M12 12L20 7M12 12V22" stroke="#526069" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <span style={{
          fontFamily: "'Noto Sans', system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: "#182027",
        }}>
          Entities
        </span>
      </div>

      {/* Add more entities */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #CFD8DD", flexShrink: 0 }}>
        <button style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: "'Noto Sans', system-ui, sans-serif",
          fontSize: 13,
          color: "#0067DF",
          fontWeight: 400,
        }}>
          Add more entities
        </button>
      </div>

      {/* Selected entities section */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Section label */}
        <div style={{
          padding: "6px 16px",
          background: "#F4F5F7",
          borderBottom: "1px solid #CFD8DD",
        }}>
          <span style={{
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 12,
            color: "#526069",
            fontWeight: 400,
          }}>
            Selected entities
          </span>
        </div>

        {/* Entity rows */}
        {SELECTED_ENTITIES.map((entity) => (
          <div
            key={entity.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              height: 32,
            }}
          >
            {entity.icon ? (
              <Globe style={{ width: 16, height: 16, color: "#526069", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 16 }} />
            )}
            <span style={{
              fontFamily: "'Noto Sans', system-ui, sans-serif",
              fontSize: 13,
              color: "#273139",
            }}>
              {entity.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
