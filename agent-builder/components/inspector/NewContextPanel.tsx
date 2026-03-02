"use client";

import { useState } from "react";
import { Search, Plus, ArrowLeft, Globe, Folder, X } from "lucide-react";

// ─── Mock entity data ──────────────────────────────────────────────────────────

interface Entity {
  id: string;
  name: string;
  iconType?: "globe" | "folder";
  group?: string;
  inSolution?: boolean;
}

const IN_SOLUTION: Entity[] = [
  { id: "orders-sol", name: "Orders", inSolution: true },
];

const AVAILABLE: Entity[] = [
  { id: "tenant", name: "Tenant", iconType: "globe" },
  { id: "customer", name: "Customer" },
  { id: "orders", name: "Orders" },
  { id: "product", name: "Product" },
  { id: "status", name: "Status" },
  { id: "is-folder", name: "IS / IS2", iconType: "folder" },
  { id: "app-installer", name: "ApplicationInstaller" },
  { id: "emaillist", name: "EmailList" },
  { id: "po-item", name: "PO Item table" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "4px 16px",
        background: "#F4F5F7",
        fontFamily: "'Noto Sans', system-ui, sans-serif",
        fontSize: 12,
        fontWeight: 400,
        color: "#526069",
        lineHeight: "16px",
      }}
    >
      {label}
    </div>
  );
}

function EntityRow({
  entity,
  checked,
  onToggle,
}: {
  entity: Entity;
  checked: boolean;
  onToggle: () => void;
}) {
  const isFolder = entity.iconType === "folder";
  const isGlobe = entity.iconType === "globe";
  const noCheckbox = isFolder;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 16px",
        height: 32,
        cursor: noCheckbox ? "default" : "pointer",
      }}
      onClick={() => !noCheckbox && onToggle()}
    >
      {/* Checkbox or icon only */}
      {noCheckbox ? (
        <Folder style={{ width: 16, height: 16, color: "#526069", flexShrink: 0 }} />
      ) : (
        <div
          style={{
            width: 16,
            height: 16,
            border: `1.5px solid ${checked ? "#0067DF" : "#A4B1B8"}`,
            borderRadius: 3,
            background: checked ? "#0067DF" : "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.1s",
          }}
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      )}

      {/* Globe icon for Tenant */}
      {isGlobe && (
        <Globe style={{ width: 16, height: 16, color: "#526069", flexShrink: 0 }} />
      )}

      <span
        style={{
          fontFamily: "'Noto Sans', system-ui, sans-serif",
          fontSize: 13,
          color: isFolder ? "#526069" : "#273139",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {entity.name}
      </span>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function NewContextPanel() {
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const q = search.toLowerCase();
  const filteredSolution = IN_SOLUTION.filter((e) =>
    e.name.toLowerCase().includes(q)
  );
  const filteredAvailable = AVAILABLE.filter((e) =>
    e.name.toLowerCase().includes(q)
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        borderLeft: "1px solid #CFD8DD",
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          height: 36,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          borderBottom: "1px solid #CFD8DD",
          flexShrink: 0,
        }}
      >
        {/* Context document icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="1" width="10" height="14" rx="1" stroke="#526069" strokeWidth="1.2" />
          <line x1="5.5" y1="5.5" x2="10.5" y2="5.5" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5.5" y1="8" x2="10.5" y2="8" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5.5" y1="10.5" x2="8.5" y2="10.5" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span
          style={{
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#182027",
            flex: 1,
          }}
        >
          New context
        </span>
      </div>

      {/* ── Breadcrumb nav ───────────────────────────────────────────────────── */}
      <div
        style={{
          height: 36,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          borderBottom: "1px solid #CFD8DD",
          flexShrink: 0,
        }}
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            borderRadius: 4,
            flex: 1,
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 13,
            color: "#273139",
          }}
        >
          <ArrowLeft style={{ width: 14, height: 14, color: "#526069" }} />
          Entities · Structured data
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 6px",
            borderRadius: 4,
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 13,
            color: "#0067DF",
            whiteSpace: "nowrap",
          }}
        >
          <Plus style={{ width: 13, height: 13 }} />
          Create new
        </button>
      </div>

      {/* ── Search ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid #CFD8DD",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#FFFFFF",
            border: "1px solid #CFD8DD",
            borderRadius: 4,
            padding: "0 10px",
            height: 32,
          }}
        >
          <Search style={{ width: 14, height: 14, color: "#8A97A0", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search entities"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "'Noto Sans', system-ui, sans-serif",
              fontSize: 13,
              color: "#273139",
              background: "transparent",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <X style={{ width: 12, height: 12, color: "#8A97A0" }} />
            </button>
          )}
        </div>
      </div>

      {/* ── Entity lists ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* In current solution */}
        {filteredSolution.length > 0 && (
          <>
            <SectionHeader label={`In current solution (${filteredSolution.length})`} />
            {filteredSolution.map((e) => (
              <EntityRow
                key={e.id}
                entity={e}
                checked={checked.has(e.id)}
                onToggle={() => toggle(e.id)}
              />
            ))}
          </>
        )}

        {/* Available entities */}
        {filteredAvailable.length > 0 && (
          <>
            <SectionHeader label="Available entities" />
            {filteredAvailable.map((e) => (
              <EntityRow
                key={e.id}
                entity={e}
                checked={checked.has(e.id)}
                onToggle={() => toggle(e.id)}
              />
            ))}
          </>
        )}

        {filteredSolution.length === 0 && filteredAvailable.length === 0 && (
          <p
            style={{
              padding: "16px",
              fontFamily: "'Noto Sans', system-ui, sans-serif",
              fontSize: 13,
              color: "#8A97A0",
              textAlign: "center",
            }}
          >
            No entities found.
          </p>
        )}
      </div>

      {/* ── Footer: Add button ────────────────────────────────────────────── */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #CFD8DD",
          display: "flex",
          justifyContent: "flex-end",
          flexShrink: 0,
        }}
      >
        <button
          style={{
            padding: "6px 20px",
            background: "#0067DF",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
