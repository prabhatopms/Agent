"use client";

// ─────────────────────────────────────────────────────────────────────────────
// DataManagerPanel — Left panel shown when canvasMode === "process".
// Shows process-level Variables, Arguments, and Entity Variables.
// Users can create, edit, and delete each item inline.
// Based on UiPath Studio Web Data Manager documentation.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  ChevronRight,
  Plus,
  Search,
  Trash2,
  Type,
  Hash,
  ToggleLeft,
  Calendar,
  Braces,
  List,
  Percent,
  Check,
  X,
} from "lucide-react";
import {
  useSolutionStore,
  type ProcessVariable,
  type ProcessArgument,
  type EntityVariable,
  type VariableType,
  type ArgumentDirection,
} from "@/state/solutionStore";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#FFFFFF",
  border: "#CFD8DD",
  sectionBg: "#F4F5F7",
  hoverBg: "#F4F5F7",
  selectedBg: "#E9F1FA",
  foreground: "#273139",
  muted: "#526069",
  deemphasized: "#8A97A0",
  primary: "#0067DF",
  font: "'Noto Sans', system-ui, sans-serif",
} as const;

const VARIABLE_TYPES: VariableType[] = [
  "String", "Int32", "Boolean", "DateTime", "Double", "Object", "Array",
];

const ARGUMENT_DIRECTIONS: ArgumentDirection[] = ["In", "Out", "InOut"];

// ─── Type icon ────────────────────────────────────────────────────────────────
function TypeIcon({ type, size = 13 }: { type: VariableType; size?: number }) {
  const props = { width: size, height: size, color: T.muted, flexShrink: 0 } as const;
  switch (type) {
    case "String":   return <Type   {...props} />;
    case "Int32":    return <Hash   {...props} />;
    case "Boolean":  return <ToggleLeft {...props} />;
    case "DateTime": return <Calendar {...props} />;
    case "Double":   return <Percent {...props} />;
    case "Object":   return <Braces {...props} />;
    case "Array":    return <List   {...props} />;
  }
}

// Diamond icon for entity variables (matches UiPath Data Fabric)
function DiamondIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M7 1.5L12 7L7 12.5L2 7L7 1.5Z" stroke={T.muted} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M7 4L9.5 7L7 10L4.5 7L7 4Z" fill={T.muted} />
    </svg>
  );
}

// {x} icon for section headers (matches UiPath variable group icon)
function VarGroupIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="4" width="14" height="8" rx="1.5" stroke={T.muted} strokeWidth="1.2" />
      <text x="8" y="11" textAnchor="middle" fontSize="7" fill={T.muted} fontFamily="monospace" fontWeight="600">{"{x}"}</text>
    </svg>
  );
}

// ─── Shared small button ──────────────────────────────────────────────────────
function IconBtn({
  icon: Icon,
  onClick,
  title,
  color = T.muted,
}: {
  icon: React.ElementType;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  color?: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 22, height: 22, border: "none", background: "none",
        cursor: "pointer", borderRadius: 3, color, flexShrink: 0,
      }}
    >
      <Icon width={12} height={12} />
    </button>
  );
}

// ─── Inline form to add a Variable ───────────────────────────────────────────
function AddVariableForm({ onSave, onCancel }: { onSave: (v: Omit<ProcessVariable, "id">) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<VariableType>("String");
  const [defaultValue, setDefaultValue] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), type, defaultValue: defaultValue || undefined });
  };

  return (
    <div style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, background: T.selectedBg }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        <input
          autoFocus
          placeholder="Variable name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          style={{ flex: 1, height: 26, border: `1px solid ${T.border}`, borderRadius: 3, padding: "0 8px", fontFamily: T.font, fontSize: 12, color: T.foreground, outline: "none" }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as VariableType)}
          style={{ height: 26, border: `1px solid ${T.border}`, borderRadius: 3, padding: "0 6px", fontFamily: T.font, fontSize: 12, color: T.foreground, background: "#FFFFFF", cursor: "pointer" }}
        >
          {VARIABLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input
          placeholder="Default value (optional)"
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
          style={{ flex: 1, height: 26, border: `1px solid ${T.border}`, borderRadius: 3, padding: "0 8px", fontFamily: T.font, fontSize: 12, color: T.foreground, outline: "none" }}
        />
        <IconBtn icon={Check} onClick={handleSave} title="Save" color={T.primary} />
        <IconBtn icon={X} onClick={onCancel} title="Cancel" />
      </div>
    </div>
  );
}

// ─── Inline form to add an Argument ──────────────────────────────────────────
function AddArgumentForm({ onSave, onCancel }: { onSave: (a: Omit<ProcessArgument, "id">) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<VariableType>("String");
  const [direction, setDirection] = useState<ArgumentDirection>("In");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), type, direction });
  };

  return (
    <div style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, background: T.selectedBg }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        <input
          autoFocus
          placeholder="Argument name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          style={{ flex: 1, height: 26, border: `1px solid ${T.border}`, borderRadius: 3, padding: "0 8px", fontFamily: T.font, fontSize: 12, color: T.foreground, outline: "none" }}
        />
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as ArgumentDirection)}
          style={{ height: 26, border: `1px solid ${T.border}`, borderRadius: 3, padding: "0 6px", fontFamily: T.font, fontSize: 12, color: T.foreground, background: "#FFFFFF", cursor: "pointer" }}
        >
          {ARGUMENT_DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as VariableType)}
          style={{ flex: 1, height: 26, border: `1px solid ${T.border}`, borderRadius: 3, padding: "0 6px", fontFamily: T.font, fontSize: 12, color: T.foreground, background: "#FFFFFF", cursor: "pointer" }}
        >
          {VARIABLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <IconBtn icon={Check} onClick={handleSave} title="Save" color={T.primary} />
        <IconBtn icon={X} onClick={onCancel} title="Cancel" />
      </div>
    </div>
  );
}

// ─── Inline form to add an Entity Variable ───────────────────────────────────
function AddEntityForm({ onSave, onCancel }: { onSave: (ev: Omit<EntityVariable, "id">) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [entityType, setEntityType] = useState("");

  const handleSave = () => {
    if (!name.trim() || !entityType.trim()) return;
    onSave({ name: name.trim(), entityType: entityType.trim() });
  };

  return (
    <div style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, background: T.selectedBg }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        <input
          autoFocus
          placeholder="Variable name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, height: 26, border: `1px solid ${T.border}`, borderRadius: 3, padding: "0 8px", fontFamily: T.font, fontSize: 12, color: T.foreground, outline: "none" }}
        />
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input
          placeholder="Entity type (e.g. CustomerData)"
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          style={{ flex: 1, height: 26, border: `1px solid ${T.border}`, borderRadius: 3, padding: "0 8px", fontFamily: T.font, fontSize: 12, color: T.foreground, outline: "none" }}
        />
        <IconBtn icon={Check} onClick={handleSave} title="Save" color={T.primary} />
        <IconBtn icon={X} onClick={onCancel} title="Cancel" />
      </div>
    </div>
  );
}

// ─── Variable row ─────────────────────────────────────────────────────────────
function VariableRow({ variable }: { variable: ProcessVariable }) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(variable.name);
  const [editType, setEditType] = useState(variable.type);
  const updateProcessVariable = useSolutionStore((s) => s.updateProcessVariable);
  const deleteProcessVariable = useSolutionStore((s) => s.deleteProcessVariable);

  const handleSave = () => {
    if (editName.trim()) updateProcessVariable(variable.id, { name: editName.trim(), type: editType });
    setEditing(false);
  };

  if (editing) {
    return (
      <div style={{ padding: "4px 10px", borderBottom: `1px solid ${T.border}`, background: T.selectedBg, display: "flex", gap: 6, alignItems: "center" }}>
        <TypeIcon type={editType} />
        <input
          autoFocus
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
          style={{ flex: 1, height: 22, border: `1px solid ${T.border}`, borderRadius: 3, padding: "0 6px", fontFamily: T.font, fontSize: 12, color: T.foreground, outline: "none" }}
        />
        <select
          value={editType}
          onChange={(e) => setEditType(e.target.value as VariableType)}
          style={{ height: 22, border: `1px solid ${T.border}`, borderRadius: 3, padding: "0 4px", fontFamily: T.font, fontSize: 11, color: T.foreground, background: "#FFFFFF" }}
        >
          {VARIABLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <IconBtn icon={Check} onClick={handleSave} title="Save" color={T.primary} />
        <IconBtn icon={X} onClick={() => setEditing(false)} title="Cancel" />
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={() => setEditing(true)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "0 10px 0 28px", height: 28,
        background: hovered ? T.hoverBg : T.bg,
        borderBottom: `1px solid transparent`,
        cursor: "default",
      }}
    >
      <TypeIcon type={variable.type} />
      <span style={{ flex: 1, fontFamily: T.font, fontSize: 13, color: T.foreground, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {variable.name}
      </span>
      <span style={{ fontFamily: T.font, fontSize: 11, color: T.deemphasized, flexShrink: 0 }}>
        {variable.type}
      </span>
      {hovered && (
        <IconBtn icon={Trash2} onClick={(e) => { e.stopPropagation(); deleteProcessVariable(variable.id); }} title="Delete" color="#D52B1E" />
      )}
    </div>
  );
}

// ─── Argument row ─────────────────────────────────────────────────────────────
function ArgumentRow({ argument }: { argument: ProcessArgument }) {
  const [hovered, setHovered] = useState(false);
  const deleteProcessArgument = useSolutionStore((s) => s.deleteProcessArgument);

  const directionColor: Record<ArgumentDirection, string> = {
    In: "#0067DF", Out: "#22C55E", InOut: "#8B5CF6",
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "0 10px 0 28px", height: 28,
        background: hovered ? T.hoverBg : T.bg,
      }}
    >
      <TypeIcon type={argument.type} />
      <span style={{ flex: 1, fontFamily: T.font, fontSize: 13, color: T.foreground, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {argument.name}
      </span>
      <span style={{ fontFamily: T.font, fontSize: 11, color: directionColor[argument.direction], fontWeight: 600, flexShrink: 0 }}>
        {argument.direction}
      </span>
      <span style={{ fontFamily: T.font, fontSize: 11, color: T.deemphasized, flexShrink: 0 }}>
        {argument.type}
      </span>
      {hovered && (
        <IconBtn icon={Trash2} onClick={(e) => { e.stopPropagation(); deleteProcessArgument(argument.id); }} title="Delete" color="#D52B1E" />
      )}
    </div>
  );
}

// ─── Entity variable row ──────────────────────────────────────────────────────
function EntityVariableRow({ ev }: { ev: EntityVariable }) {
  const [hovered, setHovered] = useState(false);
  const deleteEntityVariable = useSolutionStore((s) => s.deleteEntityVariable);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "0 10px 0 28px", height: 28,
        background: hovered ? T.hoverBg : T.bg,
      }}
    >
      <DiamondIcon />
      <span style={{ flex: 1, fontFamily: T.font, fontSize: 13, color: T.foreground, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {ev.name}
      </span>
      <span style={{ fontFamily: T.font, fontSize: 11, color: T.deemphasized, flexShrink: 0 }}>
        ({ev.entityType})
      </span>
      {hovered && (
        <IconBtn icon={Trash2} onClick={(e) => { e.stopPropagation(); deleteEntityVariable(ev.id); }} title="Delete" color="#D52B1E" />
      )}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
function Section({
  label,
  count,
  children,
  onAdd,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
  onAdd: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      {/* Section header */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "0 10px", height: 30,
          background: T.sectionBg, cursor: "pointer",
        }}
      >
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <ChevronRight
            style={{ width: 12, height: 12, color: T.muted, transition: "transform 0.15s", transform: expanded ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}
          />
          <VarGroupIcon />
          <span style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.foreground }}>
            {label}
          </span>
          <span style={{ fontFamily: T.font, fontSize: 11, color: T.deemphasized }}>
            {count > 0 ? `(${count})` : ""}
          </span>
        </button>
        {hovered && (
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            title={`Add ${label.toLowerCase().replace(/s$/, "")}`}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, border: "none", background: "none", cursor: "pointer", borderRadius: 3, color: T.muted, flexShrink: 0 }}
          >
            <Plus width={11} height={11} />
          </button>
        )}
      </div>

      {/* Section content */}
      {expanded && children}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export function DataManagerPanel() {
  const processVariables  = useSolutionStore((s) => s.processVariables);
  const processArguments  = useSolutionStore((s) => s.processArguments);
  const entityVariables   = useSolutionStore((s) => s.entityVariables);
  const addProcessVariable  = useSolutionStore((s) => s.addProcessVariable);
  const addProcessArgument  = useSolutionStore((s) => s.addProcessArgument);
  const addEntityVariable   = useSolutionStore((s) => s.addEntityVariable);

  const [addingVariable, setAddingVariable]   = useState(false);
  const [addingArgument, setAddingArgument]   = useState(false);
  const [addingEntity, setAddingEntity]       = useState(false);
  const [search, setSearch]                   = useState("");
  const [showSearch, setShowSearch]           = useState(false);

  const q = search.toLowerCase();
  const filteredVars = q ? processVariables.filter((v) => v.name.toLowerCase().includes(q)) : processVariables;
  const filteredArgs = q ? processArguments.filter((a) => a.name.toLowerCase().includes(q)) : processArguments;
  const filteredEvs  = q ? entityVariables.filter((ev) => ev.name.toLowerCase().includes(q)) : entityVariables;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.bg, borderRight: `1px solid ${T.border}`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ height: 36, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <span style={{ flex: 1, fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.foreground }}>
          Data manager
        </span>
        <button
          title="Add variable"
          onClick={() => { setAddingVariable(true); setAddingArgument(false); setAddingEntity(false); }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "none", background: "none", cursor: "pointer", borderRadius: 4, color: T.muted }}
        >
          <Plus width={14} height={14} />
        </button>
        <button
          title="Search"
          onClick={() => setShowSearch((v) => !v)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "none", background: "none", cursor: "pointer", borderRadius: 4, color: showSearch ? T.primary : T.muted }}
        >
          <Search width={13} height={13} />
        </button>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F4F5F7", border: `1px solid ${T.border}`, borderRadius: 4, padding: "0 8px", height: 26 }}>
            <Search width={12} height={12} color={T.muted} />
            <input
              autoFocus
              placeholder="Search variables…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: "none", background: "none", fontFamily: T.font, fontSize: 12, color: T.foreground, outline: "none" }}
            />
            {search && <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: T.muted, display: "flex", alignItems: "center" }}><X width={11} height={11} /></button>}
          </div>
        </div>
      )}

      {/* Global add variable form */}
      {addingVariable && (
        <AddVariableForm
          onSave={(v) => { addProcessVariable(v); setAddingVariable(false); }}
          onCancel={() => setAddingVariable(false)}
        />
      )}

      {/* Scrollable sections */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Variables */}
        <Section label="Variables" count={filteredVars.length} onAdd={() => { setAddingVariable(true); setAddingArgument(false); setAddingEntity(false); }}>
          {filteredVars.map((v) => <VariableRow key={v.id} variable={v} />)}
        </Section>

        {/* Arguments */}
        <Section label="Arguments" count={filteredArgs.length} onAdd={() => { setAddingArgument(true); setAddingVariable(false); setAddingEntity(false); }}>
          {addingArgument && (
            <AddArgumentForm
              onSave={(a) => { addProcessArgument(a); setAddingArgument(false); }}
              onCancel={() => setAddingArgument(false)}
            />
          )}
          {filteredArgs.map((a) => <ArgumentRow key={a.id} argument={a} />)}
          {filteredArgs.length === 0 && !addingArgument && (
            <div style={{ padding: "8px 28px", fontFamily: T.font, fontSize: 12, color: T.deemphasized }}>
              No arguments defined
            </div>
          )}
        </Section>

        {/* Entity variables */}
        <Section label="Entity variables" count={filteredEvs.length} onAdd={() => { setAddingEntity(true); setAddingVariable(false); setAddingArgument(false); }}>
          {addingEntity && (
            <AddEntityForm
              onSave={(ev) => { addEntityVariable(ev); setAddingEntity(false); }}
              onCancel={() => setAddingEntity(false)}
            />
          )}
          {filteredEvs.map((ev) => <EntityVariableRow key={ev.id} ev={ev} />)}
        </Section>
      </div>
    </div>
  );
}
