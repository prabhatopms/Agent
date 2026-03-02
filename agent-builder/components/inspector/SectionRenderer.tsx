"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldRenderer } from "./FieldRenderer";
import type { InspectorSection } from "@/config/inspectorSections";
import type { Agent } from "@/state/solutionStore";

interface SectionRendererProps {
  section: InspectorSection;
  agent: Agent;
}

export function SectionRenderer({ section, agent }: SectionRendererProps) {
  const [collapsed, setCollapsed] = useState(section.defaultCollapsed);

  return (
    <div className="py-0.5">
      {/* Section header */}
      {section.collapsible ? (
        <button
          type="button"
          className={cn(
            "w-full flex items-center gap-1.5 px-4 py-2 text-left",
            "hover:bg-muted/40 transition-colors group"
          )}
          onClick={() => setCollapsed((v) => !v)}
        >
          <ChevronRight
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0",
              !collapsed && "rotate-90"
            )}
          />
          <span className="text-[12px] font-semibold text-foreground flex-1">
            {section.title}
          </span>
          {section.description && collapsed && (
            <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
              {section.description}
            </span>
          )}
        </button>
      ) : (
        <div className="px-4 py-2">
          <h3 className="text-[12px] font-semibold text-foreground">
            {section.title}
          </h3>
        </div>
      )}

      {/* Description */}
      {!collapsed && section.description && (
        <p className="px-4 pb-1.5 text-[11px] text-muted-foreground leading-relaxed">
          {section.description}
        </p>
      )}

      {/* Fields */}
      {!collapsed && (
        <div className="px-4 pb-3 space-y-3">
          {section.fields.map((field) => (
            <FieldRenderer key={field.fieldId} field={field} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
