"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Code2,
  Table2,
  AtSign,
  ChevronDown,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getByPath } from "@/lib/path";
import { TokenChipBar } from "@/components/common/TokenChip";
import { useSolutionStore } from "@/state/solutionStore";
import type { InspectorField } from "@/config/inspectorSections";
import type { Agent } from "@/state/solutionStore";

interface FieldRendererProps {
  field: InspectorField;
  agent: Agent;
}

export function FieldRenderer({ field, agent }: FieldRendererProps) {
  const { patchAgentField, validationErrors } = useSolutionStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textareaRef = useRef<any>(null);

  const rawValue = getByPath(agent as unknown as Record<string, unknown>, field.valuePath);
  const value = rawValue !== undefined ? rawValue : field.defaultValue ?? "";
  const error = validationErrors[field.fieldId];

  const handleChange = (v: unknown) => {
    patchAgentField(field.fieldId, field.valuePath, v);
  };

  const insertToken = (token: string) => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const current = String(value);
    const next = current.slice(0, start) + `{{${token}}}` + current.slice(end);
    handleChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length + 4, start + token.length + 4);
    });
  };

  // schemaButton has no label row
  if (field.type === "schemaButton") {
    return (
      <Button
        variant="outline"
        className="w-full h-8 text-[12px] justify-center"
        onClick={() => {}}
      >
        Edit I/O arguments
      </Button>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        <Label
          htmlFor={field.fieldId}
          className={cn(
            "text-[12px] font-medium",
            error ? "text-red-600 dark:text-red-400" : "text-foreground"
          )}
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
        {field.helperText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="w-3 h-3 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-[11px]">
              {field.helperText}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Field control */}
      {field.type === "text" && (
        <Input
          id={field.fieldId}
          value={String(value)}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder}
          className={cn(
            "h-7 text-[12px]",
            field.ui?.monospace && "font-mono",
            error && "border-red-400 focus-visible:ring-red-400"
          )}
        />
      )}

      {field.type === "select" && (
        <Select value={String(value)} onValueChange={handleChange}>
          <SelectTrigger
            id={field.fieldId}
            className={cn(
              "h-8 text-[12px]",
              error && "border-red-400 ring-red-400"
            )}
          >
            <SelectValue placeholder={field.ui?.placeholder ?? "Select…"} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-[12px]">
                <span>{opt.label}</span>
                {opt.description && (
                  <span className="ml-2 text-[11px] text-muted-foreground">
                    — {opt.description}
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === "textarea" && (
        <Textarea
          id={field.fieldId}
          value={String(value)}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.ui?.rows ?? 4}
          className={cn(
            "text-[12px] resize-none leading-relaxed",
            field.ui?.monospace && "font-mono",
            error && "border-red-400 focus-visible:ring-red-400"
          )}
        />
      )}

      {field.type === "tokenTextarea" && (
        <TokenTextareaField
          fieldId={field.fieldId}
          value={String(value)}
          onChange={handleChange}
          placeholder={field.placeholder}
          rows={field.ui?.rows ?? 5}
          showToolbar={field.ui?.toolbar ?? false}
          canExpand={field.ui?.expand ?? false}
          tokens={field.ui?.tokenPaths ?? []}
          onInsertToken={insertToken}
          textareaRef={textareaRef}
          error={!!error}
        />
      )}

      {field.type === "codeEditor" && (
        <Textarea
          id={field.fieldId}
          value={String(value)}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.ui?.rows ?? 8}
          className={cn(
            "text-[11px] font-mono resize-none leading-relaxed",
            error && "border-red-400 focus-visible:ring-red-400"
          )}
        />
      )}

      {/* Error message */}
      {error && (
        <p className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Token Textarea ────────────────────────────────────────────────────────────

interface TokenTextareaFieldProps {
  fieldId: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows: number;
  showToolbar: boolean;
  canExpand: boolean;
  tokens: string[];
  onInsertToken: (token: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textareaRef: React.RefObject<any>;
  error: boolean;
}

const TOOLBAR_BUTTONS = [
  { icon: <Bold className="w-3 h-3" />, title: "Bold" },
  { icon: <Italic className="w-3 h-3" />, title: "Italic" },
  { icon: <Underline className="w-3 h-3" />, title: "Underline" },
  { icon: <Strikethrough className="w-3 h-3" />, title: "Strikethrough" },
  { icon: <List className="w-3 h-3" />, title: "List", separator: true },
  { icon: <Code2 className="w-3 h-3" />, title: "Code" },
  { icon: <Table2 className="w-3 h-3" />, title: "Table" },
  { icon: <AtSign className="w-3 h-3" />, title: "Mention" },
];

function TokenTextareaField({
  fieldId,
  value,
  onChange,
  placeholder,
  rows,
  showToolbar,
  canExpand,
  tokens,
  onInsertToken,
  textareaRef,
  error,
}: TokenTextareaFieldProps) {
  const [expanded, setExpanded] = useState(false);
  const displayRows = expanded ? rows * 2 : rows;

  return (
    <div
      className={cn(
        "rounded-md border bg-background overflow-hidden",
        error ? "border-red-400" : "border-border",
        "focus-within:ring-1",
        error ? "focus-within:ring-red-400" : "focus-within:ring-ring"
      )}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center border-b border-border bg-muted/20">
          {/* "Text" paragraph style dropdown */}
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1.5 text-[11px] text-muted-foreground hover:text-foreground border-r border-border"
          >
            Text
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Formatting buttons */}
          <div className="flex items-center gap-0 px-1 flex-1">
            {TOOLBAR_BUTTONS.map(({ icon, title, separator }) => (
              <Button
                key={title}
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 text-muted-foreground hover:text-foreground",
                  separator && "ml-1"
                )}
                title={title}
                type="button"
              >
                {icon}
              </Button>
            ))}
          </div>

          {/* Expand / collapse */}
          {canExpand && (
            <button
              type="button"
              className="p-1.5 mr-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setExpanded((v) => !v)}
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        id={fieldId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={displayRows}
        className={cn(
          "text-[12px] resize-none leading-relaxed border-0 rounded-none",
          "focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        )}
      />

      {/* Token chips bar */}
      {tokens.length > 0 && (
        <div className="border-t border-border px-2 py-1 bg-muted/15">
          <TokenChipBar tokens={tokens} onInsert={onInsertToken} />
        </div>
      )}
    </div>
  );
}
