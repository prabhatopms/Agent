"use client";

// ─────────────────────────────────────────────────────────────────────────────
// DataManagerPanel — Variables, Arguments, and Entity variables for the
// agentic process. Entity variables are "Entity reference" typed — they point
// to an external Data Fabric entity table with optional record-selection
// criteria (matching UiPath Studio Web's "Add variable" dialog).
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
  ExternalLink,
  AtSign,
  SlidersHorizontal,
} from "lucide-react";
import {
  useSolutionStore,
  type ProcessVariable,
  type ProcessArgument,
  type EntityVariable,
  type VariableType,
  type ArgumentDirection,
} from "@/state/solutionStore";
import { ENTITY_SCHEMAS } from "@/lib/mockData";

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
  entityPillBg: "#EDE9FE",
  entityPillText: "#6D28D9",
  font: "'Noto Sans', system-ui, sans-serif",
} as const;

const SCALAR_TYPES: VariableType[] = [
  "String", "Int32", "Boolean", "DateTime", "Double", "Object", "Array",
];
const ENTITY_TYPES = Object.keys(ENTITY_SCHEMAS);
const ARGUMENT_DIRECTIONS: ArgumentDirection[] = ["In", "Out", "InOut"];

// ─── Icons ────────────────────────────────────────────────────────────────────
function TypeIcon({ type, size = 13 }: { type: VariableType; size?: number }) {
  const props = { width: size, height: size, color: T.muted, flexShrink: 0 } as const;
  switch (type) {
    case "String":   return <Type       {...props} />;
    case "Int32":    return <Hash       {...props} />;
    case "Boolean":  return <ToggleLeft {...props} />;
    case "DateTime": return <Calendar   {...props} />;
    case "Double":   return <Percent    {...props} />;
    case "Object":   return <Braces     {...props} />;
    case "Array":    return <List       {...props} />;
  }
}

// Diamond + ExternalLink badge for entity variables
function EntityIcon() {
  return (
    <div style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" style={{ position: "absolute", top: 1, left: 0 }}>
        <path d="M7 1.5L12 7L7 12.5L2 7L7 1.5Z" stroke={T.entityPillText} strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M7 4L9.5 7L7 10L4.5 7L7 4Z" fill={T.entityPillText} />
      </svg>
      <div style={{ position: "absolute", top: -2, right: -2, background: "#fff", borderRadius: 2 }}>
        <ExternalLink width={7} height={7} color={T.entityPillText} />
      </div>
    </div>
  );
}

function VarGroupIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="4" width="14" height="8" rx="1.5" stroke={T.muted} strokeWidth="1.2" />
      <text x="8" y="11" textAnchor="middle" fontSize="7" fill={T.muted} fontFamily="monospace" fontWeight="600">{"{x}"}</text>
    </svg>
  );
}

function IconBtn({ icon: Icon, onClick, title, color = T.muted }: {
  icon: React.ElementType; onClick: (e: React.MouseEvent) => void; title: string; color?: string;
}) {
  return (
    <button title={title} onClick={onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 22, height: 22, border: "none", background: "none",
      cursor: "pointer", borderRadius: 3, color, flexShrink: 0,
    }}>
      <Icon width={12} height={12} />
    </button>
  );
}

// ─── Shared inline input style ─────────────────────────────────────────────────
const inputStyle = (flex = true): React.CSSProperties => ({
  ...(flex ? { flex: 1 } : {}),
  height: 26, border: `1px solid ${T.border}`, borderRadius: 3,
  padding: "0 8px", fontFamily: T.font, fontSize: 12, color: T.foreground, outline: "none",
});

const selectStyle = (width?: number): React.CSSProperties => ({
  ...(width ? { width } : { flex: 1 }),
  height: 26, border: `1px solid ${T.border}`, borderRadius: 3,
  padding: "0 6px", fontFamily: T.font, fontSize: 12, color: T.foreground,
  background: "#FFFFFF", cursor: "pointer",
});

// ─── Add Variable form — supports scalar types and "Entity reference" ─────────
function AddVariableForm({
  onSaveScalar,
  onSaveEntity,
  onCancel,
}: {
  onSaveScalar: (v: Omit<ProcessVariable, "id">) => void;
  onSaveEntity: (ev: Omit<EntityVariable, "id">) => void;
  onCancel: () => void;
}) {
  const [name, setName]               = useState("");
  const [selectedType, setSelectedType] = useState<string>("String");
  const [defaultValue, setDefaultValue] = useState("");

  // Entity-specific state
  const [entitySearch, setEntitySearch]       = useState("");
  const [entityType, setEntityType]           = useState<string>("");
  const [recordMode, setRecordMode]           = useState<"single" | "multiple">("single");
  const [criteriaField, setCriteriaField]     = useState<string>("");
  const [criteriaValue, setCriteriaValue]     = useState<string>("");

  const isEntity = selectedType === "Entity reference";

  const handleTypeChange = (t: string) => {
    setSelectedType(t);
    setDefaultValue("");
    setEntityType("");
    setEntitySearch("");
    setRecordMode("single");
    setCriteriaField("");
    setCriteriaValue("");
  };

  // Filter entity type suggestions
  const entitySuggestions = entitySearch
    ? ENTITY_TYPES.filter((t) => t.toLowerCase().includes(entitySearch.toLowerCase()))
    : ENTITY_TYPES;

  const selectedEntitySchema = entityType ? ENTITY_SCHEMAS[entityType] : null;

  const handleSave = () => {
    if (!name.trim()) return;
    if (isEntity) {
      if (!entityType) return; // entity type required
      onSaveEntity({
        name: name.trim(),
        entityType,
        recordMode,
        criteriaField: recordMode === "single" ? criteriaField : undefined,
        criteriaValue: recordMode === "single" ? criteriaValue : undefined,
      });
    } else {
      onSaveScalar({
        name: name.trim(),
        type: selectedType as VariableType,
        defaultValue: defaultValue || undefined,
      });
    }
  };

  return (
    <div style={{ borderBottom: `1px solid ${T.border}`, background: T.selectedBg }}>
      {/* Row 1: Name */}
      <div style={{ display: "flex", gap: 6, padding: "8px 10px 4px" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <label style={{ fontFamily: T.font, fontSize: 11, color: T.muted }}>Name<span style={{ color: "#D52B1E" }}>*</span></label>
          <input
            autoFocus
            placeholder="Variable name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isEntity && handleSave()}
            style={inputStyle()}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <label style={{ fontFamily: T.font, fontSize: 11, color: T.muted }}>Type<span style={{ color: "#D52B1E" }}>*</span></label>
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            style={selectStyle(152)}
          >
            <optgroup label="Scalar types">
              {SCALAR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </optgroup>
            <optgroup label="Reference types">
              <option value="Entity reference">Entity reference</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Scalar: default value */}
      {!isEntity && (
        <div style={{ padding: "0 10px 8px", display: "flex", gap: 6, alignItems: "center" }}>
          <input
            placeholder="Default value (optional)"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            style={inputStyle()}
          />
          <IconBtn icon={Check} onClick={handleSave} title="Save" color={T.primary} />
          <IconBtn icon={X} onClick={onCancel} title="Cancel" />
        </div>
      )}

      {/* Entity reference: additional fields */}
      {isEntity && (
        <>
          {/* Datafabric entity search */}
          <div style={{ padding: "4px 10px 4px", display: "flex", flexDirection: "column", gap: 2 }}>
            <label style={{ fontFamily: T.font, fontSize: 11, color: T.muted }}>Select Datafabric entity<span style={{ color: "#D52B1E" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <input
                placeholder="Type to search"
                value={entitySearch}
                onChange={(e) => {
                  setEntitySearch(e.target.value);
                  setEntityType(""); // reset until confirmed
                }}
                style={inputStyle()}
              />
              {/* Suggestions dropdown */}
              {entitySearch && !entityType && entitySuggestions.length > 0 && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20,
                  background: "#FFFFFF", border: `1px solid ${T.border}`, borderRadius: 4,
                  boxShadow: "0 4px 12px #00000018", maxHeight: 120, overflowY: "auto",
                }}>
                  {entitySuggestions.map((t) => (
                    <button key={t} onClick={() => { setEntityType(t); setEntitySearch(t); setCriteriaField(""); }}
                      style={{
                        width: "100%", textAlign: "left", padding: "6px 10px",
                        border: "none", background: "none", cursor: "pointer",
                        fontFamily: T.font, fontSize: 12, color: T.foreground,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = T.hoverBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {entityType && (
              <span style={{ fontFamily: T.font, fontSize: 11, color: T.entityPillText }}>
                {selectedEntitySchema ? `${selectedEntitySchema.fields.length} fields available` : ""}
              </span>
            )}
          </div>

          {/* Single / Multiple records */}
          <div style={{ padding: "4px 10px 4px", display: "flex", gap: 16 }}>
            {(["single", "multiple"] as const).map((mode) => (
              <label key={mode} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontFamily: T.font, fontSize: 12, color: T.foreground }}>
                <input
                  type="radio"
                  name="recordMode"
                  checked={recordMode === mode}
                  onChange={() => setRecordMode(mode)}
                  style={{ accentColor: T.primary, cursor: "pointer" }}
                />
                {mode === "single" ? "Single record" : "Multiple records"}
              </label>
            ))}
          </div>

          {/* Criteria row — only for single record */}
          {recordMode === "single" && (
            <div style={{ padding: "4px 10px 4px" }}>
              <label style={{ fontFamily: T.font, fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>
                Select a record (using unique field only)
              </label>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {/* Field dropdown */}
                <select
                  value={criteriaField}
                  onChange={(e) => setCriteriaField(e.target.value)}
                  style={{ ...selectStyle(), flex: "0 0 130px" }}
                >
                  <option value="">Select a field</option>
                  {selectedEntitySchema?.fields.map((f) => (
                    <option key={f.name} value={f.name}>{f.name}</option>
                  ))}
                </select>

                <span style={{ fontFamily: T.font, fontSize: 12, color: T.muted, flexShrink: 0 }}>Equals</span>

                {/* Value input with @ and filter icons */}
                <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    placeholder="Value or @variable"
                    value={criteriaValue}
                    onChange={(e) => setCriteriaValue(e.target.value)}
                    style={{ ...inputStyle(), paddingRight: 48 }}
                  />
                  <div style={{ position: "absolute", right: 4, display: "flex", gap: 2 }}>
                    <button
                      title="Insert variable reference"
                      onClick={() => setCriteriaValue((v) => v + "@")}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, border: "none", background: "none", cursor: "pointer", borderRadius: 2, color: T.muted }}
                    >
                      <AtSign width={11} height={11} />
                    </button>
                    <button
                      title="Advanced criteria"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, border: "none", background: "none", cursor: "pointer", borderRadius: 2, color: T.muted }}
                    >
                      <SlidersHorizontal width={11} height={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save / Cancel */}
          <div style={{ padding: "8px 10px", display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button onClick={onCancel} style={{
              height: 26, padding: "0 12px", border: `1px solid ${T.border}`, borderRadius: 4,
              background: "#FFFFFF", fontFamily: T.font, fontSize: 12, color: T.foreground, cursor: "pointer",
            }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !entityType}
              style={{
                height: 26, padding: "0 12px", border: "none", borderRadius: 4,
                background: name.trim() && entityType ? T.primary : T.border,
                fontFamily: T.font, fontSize: 12, color: "#FFFFFF", cursor: name.trim() && entityType ? "pointer" : "default",
              }}
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Add Argument form ────────────────────────────────────────────────────────
function AddArgumentForm({ onSave, onCancel }: { onSave: (a: Omit<ProcessArgument, "id">) => void; onCancel: () => void }) {
  const [name, setName]           = useState("");
  const [type, setType]           = useState<VariableType>("String");
  const [direction, setDirection] = useState<ArgumentDirection>("In");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), type, direction });
  };

  return (
    <div style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, background: T.selectedBg }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        <input
          autoFocus placeholder="Argument name" value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          style={inputStyle()}
        />
        <select value={direction} onChange={(e) => setDirection(e.target.value as ArgumentDirection)} style={selectStyle(80)}>
          {ARGUMENT_DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <select value={type} onChange={(e) => setType(e.target.value as VariableType)} style={selectStyle()}>
          {SCALAR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <IconBtn icon={Check} onClick={handleSave} title="Save" color={T.primary} />
        <IconBtn icon={X} onClick={onCancel} title="Cancel" />
      </div>
    </div>
  );
}

// ─── Scalar variable row ──────────────────────────────────────────────────────
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
          autoFocus value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
          style={{ ...inputStyle(), height: 22 }}
        />
        <select value={editType} onChange={(e) => setEditType(e.target.value as VariableType)} style={{ ...selectStyle(100), height: 22, fontSize: 11 }}>
          {SCALAR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <IconBtn icon={Check} onClick={handleSave} title="Save" color={T.primary} />
        <IconBtn icon={X} onClick={() => setEditing(false)} title="Cancel" />
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onDoubleClick={() => setEditing(true)}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 10px 0 28px", height: 28, background: hovered ? T.hoverBg : T.bg, cursor: "default" }}
    >
      <TypeIcon type={variable.type} />
      <span style={{ flex: 1, fontFamily: T.font, fontSize: 13, color: T.foreground, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {variable.name}
      </span>
      <span style={{ fontFamily: T.font, fontSize: 11, color: T.deemphasized, flexShrink: 0 }}>{variable.type}</span>
      {hovered && <IconBtn icon={Trash2} onClick={(e) => { e.stopPropagation(); deleteProcessVariable(variable.id); }} title="Delete" color="#D52B1E" />}
    </div>
  );
}

// ─── Entity variable row ──────────────────────────────────────────────────────
function EntityVariableRow({ ev }: { ev: EntityVariable }) {
  const [hovered, setHovered] = useState(false);
  const deleteEntityVariable = useSolutionStore((s) => s.deleteEntityVariable);

  const schema = ENTITY_SCHEMAS[ev.entityType];
  const fieldCount = schema?.fields.length ?? 0;

  const hintParts: string[] = [];
  if (ev.recordMode === "single" && ev.criteriaField) {
    hintParts.push(`${ev.criteriaField} = ${ev.criteriaValue || "?"}`);
  } else if (ev.recordMode === "multiple") {
    hintParts.push(`all records`);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 10px 0 28px", height: 28, background: hovered ? T.hoverBg : T.bg, cursor: "default" }}
    >
      <EntityIcon />
      <span style={{ flex: 1, fontFamily: T.font, fontSize: 13, color: T.foreground, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {ev.name}
      </span>
      {/* Entity type pill */}
      <span style={{
        fontFamily: T.font, fontSize: 10, fontWeight: 600,
        color: T.entityPillText, background: T.entityPillBg,
        borderRadius: 4, padding: "1px 5px", flexShrink: 0,
      }}>
        {ev.entityType}
      </span>
      {/* Record mode / criteria hint */}
      <span style={{ fontFamily: T.font, fontSize: 11, color: T.deemphasized, fontStyle: "italic", flexShrink: 0, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {hintParts.length > 0 ? `· ${hintParts[0]}` : ev.recordMode === "single" ? "· 1 record" : "· all records"}
      </span>
      {hovered && <IconBtn icon={Trash2} onClick={(e) => { e.stopPropagation(); deleteEntityVariable(ev.id); }} title="Delete" color="#D52B1E" />}
    </div>
  );
}

// ─── Argument row ─────────────────────────────────────────────────────────────
function ArgumentRow({ argument }: { argument: ProcessArgument }) {
  const [hovered, setHovered] = useState(false);
  const deleteProcessArgument = useSolutionStore((s) => s.deleteProcessArgument);
  const directionColor: Record<ArgumentDirection, string> = { In: "#0067DF", Out: "#22C55E", InOut: "#8B5CF6" };

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 10px 0 28px", height: 28, background: hovered ? T.hoverBg : T.bg }}
    >
      <TypeIcon type={argument.type} />
      <span style={{ flex: 1, fontFamily: T.font, fontSize: 13, color: T.foreground, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {argument.name}
      </span>
      <span style={{ fontFamily: T.font, fontSize: 11, color: directionColor[argument.direction], fontWeight: 600, flexShrink: 0 }}>
        {argument.direction}
      </span>
      <span style={{ fontFamily: T.font, fontSize: 11, color: T.deemphasized, flexShrink: 0 }}>{argument.type}</span>
      {hovered && <IconBtn icon={Trash2} onClick={(e) => { e.stopPropagation(); deleteProcessArgument(argument.id); }} title="Delete" color="#D52B1E" />}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
function Section({ label, count, children, onAdd }: { label: string; count: number; children: React.ReactNode; onAdd: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered]   = useState(false);

  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <div
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", height: 30, background: T.sectionBg, cursor: "pointer" }}
      >
        <button onClick={() => setExpanded((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ChevronRight style={{ width: 12, height: 12, color: T.muted, transition: "transform 0.15s", transform: expanded ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }} />
          <VarGroupIcon />
          <span style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.foreground }}>{label}</span>
          <span style={{ fontFamily: T.font, fontSize: 11, color: T.deemphasized }}>{count > 0 ? `(${count})` : ""}</span>
        </button>
        {hovered && (
          <button onClick={(e) => { e.stopPropagation(); onAdd(); }} title={`Add ${label.toLowerCase().replace(/s$/, "")}`}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, border: "none", background: "none", cursor: "pointer", borderRadius: 3, color: T.muted, flexShrink: 0 }}>
            <Plus width={11} height={11} />
          </button>
        )}
      </div>
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

  const [addingVariable, setAddingVariable] = useState(false);
  const [addingArgument, setAddingArgument] = useState(false);
  const [search, setSearch]                 = useState("");
  const [showSearch, setShowSearch]         = useState(false);

  const q = search.toLowerCase();
  const filteredVars = q ? processVariables.filter((v) => v.name.toLowerCase().includes(q)) : processVariables;
  const filteredArgs = q ? processArguments.filter((a) => a.name.toLowerCase().includes(q)) : processArguments;
  const filteredEvs  = q ? entityVariables.filter((ev) => ev.name.toLowerCase().includes(q)) : entityVariables;

  const totalVarCount = filteredVars.length + filteredEvs.length;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.bg, borderRight: `1px solid ${T.border}`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ height: 36, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <span style={{ flex: 1, fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.foreground }}>Data manager</span>
        <button title="Add variable" onClick={() => { setAddingVariable(true); setAddingArgument(false); }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "none", background: "none", cursor: "pointer", borderRadius: 4, color: T.muted }}>
          <Plus width={14} height={14} />
        </button>
        <button title="Search" onClick={() => setShowSearch((v) => !v)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "none", background: "none", cursor: "pointer", borderRadius: 4, color: showSearch ? T.primary : T.muted }}>
          <Search width={13} height={13} />
        </button>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div style={{ padding: "6px 10px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F4F5F7", border: `1px solid ${T.border}`, borderRadius: 4, padding: "0 8px", height: 26 }}>
            <Search width={12} height={12} color={T.muted} />
            <input autoFocus placeholder="Search variables…" value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: "none", background: "none", fontFamily: T.font, fontSize: 12, color: T.foreground, outline: "none" }} />
            {search && <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: T.muted, display: "flex", alignItems: "center" }}><X width={11} height={11} /></button>}
          </div>
        </div>
      )}

      {/* Global add variable/entity form */}
      {addingVariable && (
        <AddVariableForm
          onSaveScalar={(v) => { addProcessVariable(v); setAddingVariable(false); }}
          onSaveEntity={(ev) => { addEntityVariable(ev); setAddingVariable(false); }}
          onCancel={() => setAddingVariable(false)}
        />
      )}

      {/* Scrollable sections */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Variables — includes scalar + entity variable rows */}
        <Section label="Variables" count={totalVarCount} onAdd={() => { setAddingVariable(true); setAddingArgument(false); }}>
          {filteredVars.map((v) => <VariableRow key={v.id} variable={v} />)}
          {filteredEvs.map((ev) => <EntityVariableRow key={ev.id} ev={ev} />)}
          {totalVarCount === 0 && !addingVariable && (
            <div style={{ padding: "8px 28px", fontFamily: T.font, fontSize: 12, color: T.deemphasized }}>No variables defined</div>
          )}
        </Section>

        {/* Arguments */}
        <Section label="Arguments" count={filteredArgs.length} onAdd={() => { setAddingArgument(true); setAddingVariable(false); }}>
          {addingArgument && (
            <AddArgumentForm
              onSave={(a) => { addProcessArgument(a); setAddingArgument(false); }}
              onCancel={() => setAddingArgument(false)}
            />
          )}
          {filteredArgs.map((a) => <ArgumentRow key={a.id} argument={a} />)}
          {filteredArgs.length === 0 && !addingArgument && (
            <div style={{ padding: "8px 28px", fontFamily: T.font, fontSize: 12, color: T.deemphasized }}>No arguments defined</div>
          )}
        </Section>
      </div>
    </div>
  );
}
