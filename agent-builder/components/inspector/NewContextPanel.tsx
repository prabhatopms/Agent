"use client";

import { useState, useEffect } from "react";
import { Search, Plus, ArrowLeft, Globe, Folder, X, Pencil, Check } from "lucide-react";
import { useSolutionStore } from "@/state/solutionStore";

// ─── Types ─────────────────────────────────────────────────────────────────────

type ContextMethod = "entity" | "index";
type PanelStep = "method" | "select";

interface DataItem {
  id: string;
  name: string;
  iconType?: "globe" | "folder";
  inSolution?: boolean;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const ENTITY_IN_SOLUTION: DataItem[] = [
  { id: "orders-sol", name: "Orders", inSolution: true },
];

const ENTITY_AVAILABLE: DataItem[] = [
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

const INDEX_IN_SOLUTION: DataItem[] = [
  { id: "product-kb-sol", name: "Product Knowledge Base", inSolution: true },
];

const INDEX_AVAILABLE: DataItem[] = [
  { id: "faq", name: "FAQ Index" },
  { id: "policy", name: "Policy Documents" },
  { id: "release", name: "Release Notes" },
  { id: "api-docs", name: "API Documentation" },
  { id: "support-kb", name: "Support Knowledge Base" },
];

// ─── Shared helpers ────────────────────────────────────────────────────────────

function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="1" width="10" height="14" rx="1" stroke="#526069" strokeWidth="1.2" />
      <line x1="5.5" y1="5.5" x2="10.5" y2="5.5" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5.5" y1="8" x2="10.5" y2="8" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5.5" y1="10.5" x2="8.5" y2="10.5" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PanelHeader({ title = "New context" }: { title?: string }) {
  return (
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
      <DocIcon />
      <span
        style={{
          fontFamily: "'Noto Sans', system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: "#182027",
          flex: 1,
        }}
      >
        {title}
      </span>
    </div>
  );
}

function BreadcrumbBar({ label, onBack }: { label: string; onBack: () => void }) {
  return (
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
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
          borderRadius: 4,
          flex: 1,
          fontFamily: "'Noto Sans', system-ui, sans-serif",
          fontSize: 13,
          color: "#273139",
        }}
      >
        <ArrowLeft style={{ width: 14, height: 14, color: "#526069" }} />
        {label}
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
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "4px 16px",
        background: "#F4F5F7",
        fontFamily: "'Noto Sans', system-ui, sans-serif",
        fontSize: 12,
        color: "#526069",
        lineHeight: "16px",
      }}
    >
      {label}
    </div>
  );
}

function ItemRow({ item, checked, onToggle }: { item: DataItem; checked: boolean; onToggle: () => void }) {
  const isFolder = item.iconType === "folder";
  const isGlobe = item.iconType === "globe";
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
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      )}
      {isGlobe && <Globe style={{ width: 16, height: 16, color: "#526069", flexShrink: 0 }} />}
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
        {item.name}
      </span>
    </div>
  );
}

// ─── Step 1: Method selection ──────────────────────────────────────────────────

function MethodCard({ method, onClick }: { method: ContextMethod; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  const config =
    method === "entity"
      ? {
          icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="7" height="7" rx="1" stroke="#526069" strokeWidth="1.4" />
              <rect x="13" y="2" width="7" height="7" rx="1" stroke="#526069" strokeWidth="1.4" />
              <rect x="2" y="13" width="7" height="7" rx="1" stroke="#526069" strokeWidth="1.4" />
              <rect x="13" y="13" width="7" height="7" rx="1" stroke="#526069" strokeWidth="1.4" />
            </svg>
          ),
          title: "Entity",
          description: "Structured data from business entities like Orders, Customers, or Products.",
        }
      : {
          icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="10" cy="10" r="6.5" stroke="#526069" strokeWidth="1.4" />
              <line x1="15" y1="15" x2="19.5" y2="19.5" stroke="#526069" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="7.5" y1="10" x2="12.5" y2="10" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="10" y1="7.5" x2="10" y2="12.5" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          ),
          title: "Index",
          description: "Vector search over unstructured data like documents, FAQs, or knowledge bases.",
        };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 14px",
        border: `1.5px solid ${hovered ? "#0067DF" : "#CFD8DD"}`,
        borderRadius: 6,
        cursor: "pointer",
        background: hovered ? "#EBF4FF" : "#FFFFFF",
        transition: "border-color 0.12s, background 0.12s",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          background: "#F4F5F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {config.icon}
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#182027",
            marginBottom: 3,
          }}
        >
          {config.title}
        </div>
        <div
          style={{
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 12,
            color: "#526069",
            lineHeight: "16px",
          }}
        >
          {config.description}
        </div>
      </div>
    </div>
  );
}

function MethodStep({ onSelect, onCancel }: { onSelect: (m: ContextMethod) => void; onCancel: () => void }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF", borderLeft: "1px solid #CFD8DD" }}>
      <PanelHeader />
      <div style={{ flex: 1, padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
        <p
          style={{
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 12,
            color: "#526069",
            margin: "0 0 4px",
          }}
        >
          Select a method to add context for this agent.
        </p>
        <MethodCard method="entity" onClick={() => onSelect("entity")} />
        <MethodCard method="index" onClick={() => onSelect("index")} />
      </div>
      <div
        style={{
          padding: "10px 14px",
          borderTop: "1px solid #CFD8DD",
          display: "flex",
          justifyContent: "flex-end",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onCancel}
          style={{
            padding: "5px 16px",
            background: "none",
            color: "#526069",
            border: "1px solid #CFD8DD",
            borderRadius: 4,
            cursor: "pointer",
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 13,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Item selection ────────────────────────────────────────────────────

function SelectStep({
  method,
  onBack,
  onAdd,
}: {
  method: ContextMethod;
  onBack: () => void;
  onAdd: (itemIds: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const inSolution = method === "entity" ? ENTITY_IN_SOLUTION : INDEX_IN_SOLUTION;
  const available = method === "entity" ? ENTITY_AVAILABLE : INDEX_AVAILABLE;
  const breadcrumb = method === "entity" ? "Entities · Structured data" : "Index · Unstructured data";
  const placeholder = method === "entity" ? "Search entities" : "Search index sources";
  const emptyLabel = method === "entity" ? "entities" : "index sources";
  const availableLabel = method === "entity" ? "Available entities" : "Available index sources";

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const q = search.toLowerCase();
  const filteredSolution = inSolution.filter((e) => e.name.toLowerCase().includes(q));
  const filteredAvailable = available.filter((e) => e.name.toLowerCase().includes(q));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF", borderLeft: "1px solid #CFD8DD" }}>
      <PanelHeader />
      <BreadcrumbBar label={breadcrumb} onBack={onBack} />

      {/* Search */}
      <div style={{ padding: "8px 12px", borderBottom: "1px solid #CFD8DD", flexShrink: 0 }}>
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
            placeholder={placeholder}
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
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <X style={{ width: 12, height: 12, color: "#8A97A0" }} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filteredSolution.length > 0 && (
          <>
            <SectionHeader label={`In current solution (${filteredSolution.length})`} />
            {filteredSolution.map((e) => (
              <ItemRow key={e.id} item={e} checked={checked.has(e.id)} onToggle={() => toggle(e.id)} />
            ))}
          </>
        )}
        {filteredAvailable.length > 0 && (
          <>
            <SectionHeader label={availableLabel} />
            {filteredAvailable.map((e) => (
              <ItemRow key={e.id} item={e} checked={checked.has(e.id)} onToggle={() => toggle(e.id)} />
            ))}
          </>
        )}
        {filteredSolution.length === 0 && filteredAvailable.length === 0 && (
          <p
            style={{
              padding: 16,
              fontFamily: "'Noto Sans', system-ui, sans-serif",
              fontSize: 13,
              color: "#8A97A0",
              textAlign: "center",
            }}
          >
            No {emptyLabel} found.
          </p>
        )}
      </div>

      {/* Footer */}
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
          disabled={checked.size === 0}
          onClick={() => onAdd([...checked])}
          style={{
            padding: "6px 20px",
            background: checked.size === 0 ? "#A4B1B8" : "#0067DF",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 4,
            cursor: checked.size === 0 ? "default" : "pointer",
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            transition: "background 0.1s",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Configured / edit view ────────────────────────────────────────────────────

function ConfiguredView({
  nodeData,
  onEdit,
}: {
  nodeData: Record<string, unknown>;
  onEdit: () => void;
}) {
  const contextType = nodeData.contextType as ContextMethod;
  const selectedIds = (nodeData.selectedItems as string[]) ?? [];

  const allItems =
    contextType === "entity"
      ? [...ENTITY_IN_SOLUTION, ...ENTITY_AVAILABLE]
      : [...INDEX_IN_SOLUTION, ...INDEX_AVAILABLE];

  const selectedItems = selectedIds.map((id) => allItems.find((e) => e.id === id)).filter(Boolean) as DataItem[];

  const typeLabel = contextType === "entity" ? "Entity" : "Index";
  const typeColor = contextType === "entity" ? "#7C3AED" : "#0067DF";
  const typeBg = contextType === "entity" ? "#EDE9FE" : "#EBF4FF";
  const countLabel = contextType === "entity" ? "entities" : "sources";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF", borderLeft: "1px solid #CFD8DD" }}>
      {/* Header */}
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
        <DocIcon />
        <span
          style={{
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#182027",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {nodeData.label as string}
        </span>
        <button
          onClick={onEdit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "1px solid #CFD8DD",
            borderRadius: 4,
            cursor: "pointer",
            padding: "3px 8px",
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 12,
            color: "#526069",
            flexShrink: 0,
          }}
        >
          <Pencil style={{ width: 11, height: 11 }} />
          Edit
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
        {/* Method badge */}
        <div style={{ marginBottom: 14 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 8px",
              borderRadius: 12,
              background: typeBg,
              color: typeColor,
              fontFamily: "'Noto Sans', system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {typeLabel}
          </span>
        </div>

        {/* Count label */}
        <div
          style={{
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#8A97A0",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 6,
          }}
        >
          {selectedItems.length} {countLabel} selected
        </div>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {selectedItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 8px",
                borderRadius: 4,
                background: "#F4F5F7",
                fontFamily: "'Noto Sans', system-ui, sans-serif",
                fontSize: 13,
                color: "#273139",
              }}
            >
              <Check style={{ width: 12, height: 12, color: "#22C55E", flexShrink: 0 }} />
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main panel ────────────────────────────────────────────────────────────────

export function NewContextPanel() {
  const selectedNodeId = useSolutionStore((s) => s.selectedNodeId);
  const canvasNodes = useSolutionStore((s) => s.solution.canvasGraph.nodes);
  const configureContextNode = useSolutionStore((s) => s.configureContextNode);
  const selectCanvasNode = useSolutionStore((s) => s.selectCanvasNode);

  const [step, setStep] = useState<PanelStep>("method");
  const [method, setMethod] = useState<ContextMethod | null>(null);

  const node = canvasNodes.find((n) => n.id === selectedNodeId);
  const isConfigured = Boolean(node?.data?.configured);

  // Reset when selected node changes
  useEffect(() => {
    setStep("method");
    setMethod(null);
  }, [selectedNodeId]);

  const handleAdd = (itemIds: string[]) => {
    if (!selectedNodeId || !method) return;
    const allItems =
      method === "entity"
        ? [...ENTITY_IN_SOLUTION, ...ENTITY_AVAILABLE]
        : [...INDEX_IN_SOLUTION, ...INDEX_AVAILABLE];
    const label = allItems.find((e) => e.id === itemIds[0])?.name ?? "Context";
    configureContextNode(selectedNodeId, method, itemIds, label);
    setStep("method"); // reset so ConfiguredView shows
  };

  const handleEdit = () => {
    if (node?.data?.contextType) setMethod(node.data.contextType as ContextMethod);
    setStep("select");
  };

  // Configured view: show summary, allow re-editing
  if (isConfigured && step === "method") {
    return (
      <ConfiguredView
        nodeData={node!.data as Record<string, unknown>}
        onEdit={handleEdit}
      />
    );
  }

  // Method selection
  if (step === "method") {
    return (
      <MethodStep
        onSelect={(m) => { setMethod(m); setStep("select"); }}
        onCancel={() => selectCanvasNode(null)}
      />
    );
  }

  // Entity / index selection
  return (
    <SelectStep
      method={method!}
      onBack={() => {
        setStep("method");
        if (!isConfigured) setMethod(null);
      }}
      onAdd={handleAdd}
    />
  );
}
