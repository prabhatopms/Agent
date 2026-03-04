"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, ArrowLeft, Globe, Folder, X, Pencil, Check } from "lucide-react";
import { useSolutionStore } from "@/state/solutionStore";

// ─── Types ─────────────────────────────────────────────────────────────────────

type ContextMethod = "entity" | "index";
type PanelStep = "method" | "select";

interface TreeNode {
  id: string;
  name: string;
  iconType?: "globe" | "folder";
  inSolution?: boolean;
  isContainer?: boolean; // non-selectable scope/folder node (no checkbox)
  children?: TreeNode[];
}

interface DataItem {
  id: string;
  name: string;
  iconType?: "globe" | "folder";
  inSolution?: boolean;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const ENTITY_TREE: TreeNode[] = [
  {
    id: "tenant",
    name: "Tenant",
    iconType: "globe",
    isContainer: true,
    children: [
      { id: "customer", name: "Customer" },
      {
        id: "orders",
        name: "Orders",
        inSolution: true,
        children: [
          { id: "order-line-item", name: "Order Line Item", inSolution: true },
        ],
      },
      { id: "product", name: "Product" },
      { id: "status", name: "Status" },
    ],
  },
  {
    id: "is-folder",
    name: "IS / IS2",
    iconType: "folder",
    isContainer: true,
    children: [
      { id: "app-installer", name: "ApplicationInstaller" },
      { id: "emaillist", name: "EmailList" },
      { id: "po-item", name: "PO Item table" },
    ],
  },
];

function flattenTree(nodes: TreeNode[]): TreeNode[] {
  return nodes.flatMap((n) => [n, ...(n.children ? flattenTree(n.children) : [])]);
}
const ENTITY_ALL_FLAT = flattenTree(ENTITY_TREE);

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

// ─── Tree helpers ───────────────────────────────────────────────────────────────

function getSelectableIds(node: TreeNode): string[] {
  if (node.isContainer) return node.children?.flatMap(getSelectableIds) ?? [];
  return [node.id, ...(node.children?.flatMap(getSelectableIds) ?? [])];
}

function getCheckState(node: TreeNode, checked: Set<string>): "checked" | "indeterminate" | "unchecked" {
  const ids = getSelectableIds(node);
  if (ids.length === 0) return "unchecked";
  const count = ids.filter((id) => checked.has(id)).length;
  if (count === 0) return "unchecked";
  if (count === ids.length) return "checked";
  return "indeterminate";
}

function getAllExpandableIds(nodes: TreeNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.id, ...getAllExpandableIds(n.children)] : []
  );
}

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

// ─── ItemRow (index flat list) ─────────────────────────────────────────────────

function ItemRow({
  item,
  checked,
  radio = false,
  onToggle,
}: {
  item: DataItem;
  checked: boolean;
  radio?: boolean;
  onToggle: () => void;
}) {
  const isFolder = item.iconType === "folder";
  const isGlobe = item.iconType === "globe";
  const noControl = isFolder;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 16px",
        height: 32,
        cursor: noControl ? "default" : "pointer",
      }}
      onClick={() => !noControl && onToggle()}
    >
      {noControl ? (
        <Folder style={{ width: 16, height: 16, color: "#526069", flexShrink: 0 }} />
      ) : radio ? (
        <div
          style={{
            width: 16,
            height: 16,
            border: `1.5px solid ${checked ? "#0067DF" : "#A4B1B8"}`,
            borderRadius: "50%",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "border-color 0.1s",
          }}
        >
          {checked && (
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0067DF" }} />
          )}
        </div>
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

// ─── TreeRow (entity hierarchical tree) ────────────────────────────────────────

function InSolutionBadge() {
  return (
    <span
      style={{
        fontSize: 10,
        color: "#0067DF",
        border: "1px solid #BDD7F8",
        background: "#EBF4FF",
        borderRadius: 3,
        padding: "1px 5px",
        flexShrink: 0,
        fontFamily: "'Noto Sans', system-ui, sans-serif",
        fontWeight: 600,
        lineHeight: "14px",
      }}
    >
      in solution
    </span>
  );
}

function Checkbox({ state }: { state: "checked" | "indeterminate" | "unchecked" }) {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        border: `1.5px solid ${state !== "unchecked" ? "#0067DF" : "#A4B1B8"}`,
        borderRadius: 3,
        background: state === "checked" ? "#0067DF" : "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.1s",
      }}
    >
      {state === "checked" && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {state === "indeterminate" && (
        <div style={{ width: 8, height: 2, background: "#0067DF", borderRadius: 1 }} />
      )}
    </div>
  );
}

function TreeRow({
  node,
  depth,
  checked,
  expanded,
  onToggle,
  onToggleExpand,
}: {
  node: TreeNode;
  depth: number;
  checked: Set<string>;
  expanded: Set<string>;
  onToggle: (node: TreeNode) => void;
  onToggleExpand: (id: string) => void;
}) {
  const hasChildren = !!(node.children?.length);
  const isExpanded = expanded.has(node.id);
  const checkState = getCheckState(node, checked);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 32,
          paddingLeft: 8 + depth * 16,
          paddingRight: 12,
          cursor: node.isContainer ? "default" : "pointer",
          gap: 2,
          userSelect: "none",
        }}
        onClick={() => {
          if (!node.isContainer) onToggle(node);
        }}
      >
        {/* Expand / collapse chevron */}
        <div
          style={{
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            cursor: hasChildren ? "pointer" : "default",
            opacity: hasChildren ? 1 : 0,
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggleExpand(node.id);
          }}
        >
          {hasChildren && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 0.15s",
                flexShrink: 0,
              }}
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="#526069"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Container icon OR Checkbox */}
        {node.isContainer ? (
          node.iconType === "globe" ? (
            <Globe style={{ width: 15, height: 15, color: "#526069", flexShrink: 0, marginRight: 2 }} />
          ) : (
            <Folder style={{ width: 15, height: 15, color: "#E5A020", flexShrink: 0, marginRight: 2 }} />
          )
        ) : (
          <div style={{ marginRight: 4, flexShrink: 0 }}>
            <Checkbox state={checkState} />
          </div>
        )}

        {/* Label */}
        <span
          style={{
            fontFamily: "'Noto Sans', system-ui, sans-serif",
            fontSize: 13,
            color: node.isContainer ? "#526069" : "#273139",
            fontWeight: node.isContainer ? 600 : 400,
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {node.name}
        </span>

        {node.inSolution && <InSolutionBadge />}
      </div>

      {/* Connector line + children */}
      {hasChildren && isExpanded && (
        <div style={{ position: "relative" }}>
          {/* Vertical connector line */}
          <div
            style={{
              position: "absolute",
              left: 8 + depth * 16 + 17,
              top: 0,
              bottom: 8,
              width: 1,
              background: "#CFD8DD",
            }}
          />
          {node.children!.map((child, idx) => (
            <div key={child.id} style={{ position: "relative" }}>
              {/* Horizontal connector to this child */}
              <div
                style={{
                  position: "absolute",
                  left: 8 + depth * 16 + 17,
                  top: 16,
                  width: 8,
                  height: 1,
                  background: "#CFD8DD",
                }}
              />
              <TreeRow
                node={child}
                depth={depth + 1}
                checked={checked}
                expanded={expanded}
                onToggle={onToggle}
                onToggleExpand={onToggleExpand}
              />
            </div>
          ))}
        </div>
      )}
    </>
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

  // Entity: multi-select with pre-checked in-solution items
  // Index: single-select
  const [checked, setChecked] = useState<Set<string>>(() => {
    const init = new Set<string>();
    if (method === "entity") {
      function collectInSolution(nodes: TreeNode[]) {
        for (const n of nodes) {
          if (!n.isContainer && n.inSolution) init.add(n.id);
          if (n.children) collectInSolution(n.children);
        }
      }
      collectInSolution(ENTITY_TREE);
    }
    return init;
  });

  // Expanded nodes (entity tree only) — default: all expanded
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(getAllExpandableIds(ENTITY_TREE))
  );

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleNode = (node: TreeNode) => {
    const ids = getSelectableIds(node);
    setChecked((prev) => {
      const next = new Set(prev);
      const allChecked = ids.every((id) => next.has(id));
      if (allChecked) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleIndex = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.clear(); } else { next.clear(); next.add(id); }
      return next;
    });
  };

  const q = search.toLowerCase();

  // Flat filtered list for entity search
  const filteredEntityFlat = q
    ? ENTITY_ALL_FLAT.filter((n) => !n.isContainer && n.name.toLowerCase().includes(q))
    : null;

  // Index flat data
  const filteredIndexSolution = INDEX_IN_SOLUTION.filter((e) => e.name.toLowerCase().includes(q));
  const filteredIndexAvailable = INDEX_AVAILABLE.filter((e) => e.name.toLowerCase().includes(q));

  const breadcrumb = method === "entity" ? "Entities · Structured data" : "Index · Unstructured data";
  const placeholder = method === "entity" ? "Search entities…" : "Search indexes…";

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
        {method === "entity" ? (
          filteredEntityFlat ? (
            /* Search results: flat list */
            filteredEntityFlat.length === 0 ? (
              <p style={{ padding: 16, fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 13, color: "#8A97A0", textAlign: "center" }}>
                No entities found.
              </p>
            ) : (
              filteredEntityFlat.map((node) => (
                <div
                  key={node.id}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px", height: 32, cursor: "pointer", userSelect: "none" }}
                  onClick={() => toggleNode(node)}
                >
                  <Checkbox state={checked.has(node.id) ? "checked" : "unchecked"} />
                  <span style={{ fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 13, color: "#273139", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {node.name}
                  </span>
                  {node.inSolution && <InSolutionBadge />}
                </div>
              ))
            )
          ) : (
            /* Tree view */
            ENTITY_TREE.map((node) => (
              <TreeRow
                key={node.id}
                node={node}
                depth={0}
                checked={checked}
                expanded={expanded}
                onToggle={toggleNode}
                onToggleExpand={toggleExpand}
              />
            ))
          )
        ) : (
          /* Index: flat list */
          <>
            {filteredIndexSolution.length > 0 && (
              <>
                <SectionHeader label={`In current solution (${filteredIndexSolution.length})`} />
                {filteredIndexSolution.map((e) => (
                  <ItemRow key={e.id} item={e} checked={checked.has(e.id)} radio onToggle={() => toggleIndex(e.id)} />
                ))}
              </>
            )}
            {filteredIndexAvailable.length > 0 && (
              <>
                <SectionHeader label="Available indexes" />
                {filteredIndexAvailable.map((e) => (
                  <ItemRow key={e.id} item={e} checked={checked.has(e.id)} radio onToggle={() => toggleIndex(e.id)} />
                ))}
              </>
            )}
            {filteredIndexSolution.length === 0 && filteredIndexAvailable.length === 0 && (
              <p style={{ padding: 16, fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 13, color: "#8A97A0", textAlign: "center" }}>
                No indexes found.
              </p>
            )}
          </>
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

// ─── Entity configured view ────────────────────────────────────────────────────

function EntityConfiguredView({ nodeData, onEdit }: { nodeData: Record<string, unknown>; onEdit: () => void }) {
  const selectedIds = (nodeData.selectedItems as string[]) ?? [];
  const selectedItems = selectedIds
    .map((id) => ENTITY_ALL_FLAT.find((e) => e.id === id))
    .filter((e): e is TreeNode => !!e && !e.isContainer);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF", borderLeft: "1px solid #CFD8DD" }}>
      <div style={{ height: 36, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: "1px solid #CFD8DD", flexShrink: 0 }}>
        <DocIcon />
        <span style={{ fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: "#182027", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {nodeData.label as string}
        </span>
        <button
          onClick={onEdit}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "1px solid #CFD8DD", borderRadius: 4, cursor: "pointer", padding: "3px 8px", fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 12, color: "#526069", flexShrink: 0 }}
        >
          <Pencil style={{ width: 11, height: 11 }} />
          Edit
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 12, background: "#EDE9FE", color: "#7C3AED", fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 11, fontWeight: 600 }}>
            Entity
          </span>
        </div>
        <div style={{ fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 11, fontWeight: 600, color: "#8A97A0", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
          {selectedItems.length} {selectedItems.length === 1 ? "entity" : "entities"} selected
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {selectedItems.map((item) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 4, background: "#F4F5F7", fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 13, color: "#273139" }}>
              <Check style={{ width: 12, height: 12, color: "#22C55E", flexShrink: 0 }} />
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Index property panel ──────────────────────────────────────────────────────

const FIELD_LABEL: React.CSSProperties = {
  fontFamily: "'Noto Sans', system-ui, sans-serif",
  fontSize: 13,
  fontWeight: 600,
  color: "#182027",
  marginBottom: 5,
};

const FIELD_INPUT: React.CSSProperties = {
  width: "100%",
  height: 32,
  border: "1px solid #CFD8DD",
  borderRadius: 4,
  padding: "0 10px",
  fontFamily: "'Noto Sans', system-ui, sans-serif",
  fontSize: 13,
  color: "#273139",
  background: "#FFFFFF",
  outline: "none",
  boxSizing: "border-box",
};

const FIELD_SELECT: React.CSSProperties = {
  ...FIELD_INPUT,
  cursor: "pointer",
  appearance: "none",
  paddingRight: 28,
};

function ExprPickerBtn() {
  return (
    <button
      style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", borderLeft: "1px solid #E8ECED" }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <line x1="2" y1="4" x2="9" y2="4" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="2" y1="7" x2="9" y2="7" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="2" y1="10" x2="6" y2="10" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M10 6L12.5 9L10 9" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12.5" y1="9" x2="12.5" y2="5" stroke="#526069" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function SelectChevron() {
  return (
    <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#526069" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function RangeSlider({
  min, max, step, value, onChange, formatLabel,
}: {
  min: number; max: number; step: number; value: number;
  onChange: (v: number) => void;
  formatLabel?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 3, borderRadius: 2, background: "#E1E7EA" }} />
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: 3, borderRadius: 2, background: "#0067DF" }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer", margin: 0 }}
        />
        <div
          style={{
            position: "absolute",
            left: `calc(${pct}% - 7px)`,
            width: 14, height: 14,
            borderRadius: "50%",
            background: "#0067DF",
            boxShadow: "0 1px 3px #0000001A",
            pointerEvents: "none",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 11, color: "#8A97A0" }}>
          {formatLabel ? formatLabel(min) : min}
        </span>
        <span style={{ fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 11, color: "#8A97A0" }}>
          {formatLabel ? formatLabel(max) : max}
        </span>
      </div>
    </div>
  );
}

function IndexPropertyPanel({ nodeData }: { nodeData: Record<string, unknown> }) {
  const selectedNodeId = useSolutionStore((s) => s.selectedNodeId);
  const updateContextNodeLabel = useSolutionStore((s) => s.updateContextNodeLabel);

  const [name, setName] = useState((nodeData.label as string) ?? "");
  const [description, setDescription] = useState((nodeData.description as string) ?? "");
  const [strategy, setStrategy] = useState((nodeData.strategy as string) ?? "Semantic");
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [folderPath, setFolderPath] = useState((nodeData.folderPath as string) ?? "");
  const [fileExt, setFileExt] = useState((nodeData.fileExt as string) ?? "All");
  const [queryTokens, setQueryTokens] = useState<string[]>(
    (nodeData.queryTokens as string[]) ?? [`The query for the ${(nodeData.strategy as string) ?? "Semantic"} strategy.`]
  );
  const [threshold, setThreshold] = useState((nodeData.threshold as number) ?? 0);
  const [maxResults, setMaxResults] = useState((nodeData.maxResults as number) ?? 3);

  const handleNameChange = (value: string) => {
    setName(value);
    if (selectedNodeId) updateContextNodeLabel(selectedNodeId, value);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#FFFFFF", borderLeft: "1px solid #CFD8DD" }}>
      <div style={{ height: 36, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: "1px solid #CFD8DD", flexShrink: 0 }}>
        <DocIcon />
        <span style={{ fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: "#182027", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name || "Index"}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={FIELD_LABEL}>Name <span style={{ color: "#E53935" }}>*</span></div>
          <input value={name} onChange={(e) => handleNameChange(e.target.value)} style={FIELD_INPUT} />
        </div>

        <div>
          <div style={FIELD_LABEL}>Description</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter context description"
            rows={3}
            style={{ ...FIELD_INPUT, height: "auto", padding: "6px 10px", resize: "none", lineHeight: "1.5" }}
          />
        </div>

        <div>
          <div style={FIELD_LABEL}>Strategy</div>
          <div style={{ position: "relative" }}>
            <select value={strategy} onChange={(e) => setStrategy(e.target.value)} style={FIELD_SELECT}>
              <option>Semantic</option>
              <option>Structured (Preview)</option>
              <option>DeepRAG</option>
              <option>Batch Transform (Preview)</option>
            </select>
            <SelectChevron />
          </div>
        </div>

        <div style={{ border: "1px solid #CFD8DD", borderRadius: 6, overflow: "hidden" }}>
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 13, fontWeight: 600, color: "#273139" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: settingsOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.15s", flexShrink: 0 }}>
              <path d="M3 5L7 9L11 5" stroke="#526069" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Settings
          </button>

          {settingsOpen && (
            <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid #E8ECED" }}>
              <div style={{ paddingTop: 12 }}>
                <div style={FIELD_LABEL}>Folder path prefix</div>
                <div style={{ position: "relative" }}>
                  <input value={folderPath} onChange={(e) => setFolderPath(e.target.value)} placeholder="e.g., /documents/project" style={{ ...FIELD_INPUT, paddingRight: 34 }} />
                  <ExprPickerBtn />
                </div>
              </div>

              <div>
                <div style={FIELD_LABEL}>File extension</div>
                <div style={{ position: "relative" }}>
                  <select value={fileExt} onChange={(e) => setFileExt(e.target.value)} style={FIELD_SELECT}>
                    <option>All</option>
                    <option>.pdf</option>
                    <option>.docx</option>
                    <option>.txt</option>
                    <option>.csv</option>
                    <option>.md</option>
                  </select>
                  <SelectChevron />
                </div>
              </div>

              <div>
                <div style={FIELD_LABEL}>Query <span style={{ color: "#E53935" }}>*</span></div>
                <div style={{ position: "relative", minHeight: 32, border: "1px solid #CFD8DD", borderRadius: 4, background: "#FFFFFF", padding: "4px 34px 4px 6px", display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                  {queryTokens.map((token, i) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#EDE9FE", color: "#5B21B6", borderRadius: 4, padding: "2px 6px", fontFamily: "'Noto Sans', system-ui, sans-serif", fontSize: 12 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <line x1="1.5" y1="4" x2="7.5" y2="4" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="1.5" y1="7" x2="7.5" y2="7" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M8.5 5L10.5 7L8.5 7" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="10.5" y1="7" x2="10.5" y2="4" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      {token}
                      <button onClick={() => setQueryTokens((prev) => prev.filter((_, j) => j !== i))} style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0, color: "#7C3AED" }}>
                        <X style={{ width: 10, height: 10 }} />
                      </button>
                    </span>
                  ))}
                  <ExprPickerBtn />
                </div>
              </div>

              <div>
                <div style={FIELD_LABEL}>Relevance score threshold</div>
                <RangeSlider min={0} max={1} step={0.01} value={threshold} onChange={setThreshold} />
              </div>

              <div>
                <div style={FIELD_LABEL}>Max results retrieved</div>
                <RangeSlider min={1} max={10} step={1} value={maxResults} onChange={setMaxResults} />
              </div>
            </div>
          )}
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
  const deleteCanvasNode = useSolutionStore((s) => s.deleteCanvasNode);

  const [step, setStep] = useState<PanelStep>("method");
  const [method, setMethod] = useState<ContextMethod | null>(null);

  const node = canvasNodes.find((n) => n.id === selectedNodeId);
  const isConfigured = Boolean(node?.data?.configured);

  useEffect(() => {
    setStep("method");
    setMethod(null);
  }, [selectedNodeId]);

  const handleMethodSelect = (m: ContextMethod) => {
    if (m === "entity") {
      const existing = canvasNodes.find(
        (n) => n.id !== selectedNodeId && n.data?.configured && n.data?.contextType === "entity"
      );
      if (existing) {
        if (selectedNodeId) deleteCanvasNode(selectedNodeId);
        selectCanvasNode(existing.id);
        return;
      }
    }
    setMethod(m);
    setStep("select");
  };

  const handleAdd = (itemIds: string[]) => {
    if (!selectedNodeId || !method) return;
    const firstItem = method === "entity"
      ? ENTITY_ALL_FLAT.find((e) => e.id === itemIds[0])
      : [...INDEX_IN_SOLUTION, ...INDEX_AVAILABLE].find((e) => e.id === itemIds[0]);
    const label = firstItem?.name ?? "Context";
    configureContextNode(selectedNodeId, method, itemIds, label);
    setStep("method");
  };

  const handleEdit = () => {
    if (node?.data?.contextType) setMethod(node.data.contextType as ContextMethod);
    setStep("select");
  };

  if (isConfigured && step === "method") {
    const data = node!.data as Record<string, unknown>;
    if (data.contextType === "index") {
      return <IndexPropertyPanel nodeData={data} />;
    }
    return <EntityConfiguredView nodeData={data} onEdit={handleEdit} />;
  }

  if (step === "method") {
    return (
      <MethodStep
        onSelect={handleMethodSelect}
        onCancel={() => selectCanvasNode(null)}
      />
    );
  }

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
