// ─────────────────────────────────────────────────────────────────────────────
// Inspector Sections Configuration
// Central config that drives ALL inspector rendering.
// ─────────────────────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "codeEditor"
  | "toggle"
  | "tokenTextarea"
  | "schemaEditor"
  | "schemaButton";

export interface FieldOption {
  value: string;
  label: string;
  description?: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
}

export interface FieldUI {
  rows?: number;
  height?: string;
  monospace?: boolean;
  placeholder?: string;
  showTokenChips?: boolean;
  tokenPaths?: string[];
  toolbar?: boolean;
  expand?: boolean;
}

export interface InspectorField {
  fieldId: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  validation?: FieldValidation;
  valuePath: string;
  options?: FieldOption[];
  ui?: FieldUI;
  defaultValue?: unknown;
}

export interface VisibilityRule {
  fieldPath: string;
  operator: "eq" | "neq" | "exists" | "notExists";
  value?: unknown;
}

export interface InspectorSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  collapsible: boolean;
  defaultCollapsed: boolean;
  /** Render the section title as a standalone header row (only needed when fields have no visible label, e.g. schemaButton) */
  showSectionTitle?: boolean;
  visibility?: VisibilityRule[];
  fields: InspectorField[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const INSPECTOR_SECTIONS: InspectorSection[] = [
  {
    id: "model-config",
    title: "Model",
    order: 0,
    collapsible: false,
    defaultCollapsed: false,
    fields: [
      {
        fieldId: "model",
        label: "Model",
        type: "select",
        required: true,
        valuePath: "model",
        validation: { required: true, message: "A model must be selected." },
        options: [
          { value: "gpt-4o-2024-11-20", label: "gpt-4o-2024-11-20", description: "OpenAI — latest GPT-4o" },
          { value: "gpt-4o", label: "GPT-4o", description: "OpenAI — multimodal" },
          { value: "gpt-4o-mini", label: "GPT-4o Mini", description: "OpenAI — cost-efficient" },
          { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", description: "Balanced — fast & capable" },
          { value: "claude-opus-4-6", label: "Claude Opus 4.6", description: "Most capable, higher latency" },
          { value: "claude-haiku-4-5", label: "Claude Haiku 4.5", description: "Fastest, lightest" },
          { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", description: "Google — low latency" },
        ],
        ui: { placeholder: "Select a model…" },
      },
    ],
  },
  {
    id: "system-prompt",
    title: "System prompt",
    order: 1,
    collapsible: false,
    defaultCollapsed: false,
    fields: [
      {
        fieldId: "systemPrompt",
        label: "System prompt",
        type: "tokenTextarea",
        required: true,
        valuePath: "systemPrompt",
        helperText: "Defines the agent's identity, purpose, and rules. Use {{variable}} tokens to inject dynamic values.",
        validation: { required: true, message: "System prompt cannot be empty." },
        ui: {
          rows: 10,
          toolbar: true,
          expand: true,
          showTokenChips: true,
          tokenPaths: ["inputData", "expectedOutput", "context", "tools"],
        },
      },
    ],
  },
  {
    id: "user-prompt",
    title: "User prompt",
    order: 2,
    collapsible: false,
    defaultCollapsed: false,
    fields: [
      {
        fieldId: "userPrompt",
        label: "User prompt",
        type: "tokenTextarea",
        required: true,
        valuePath: "userPrompt",
        helperText: "The specific request given to the agent at runtime. Use {{variable}} tokens to inject dynamic values.",
        ui: {
          rows: 5,
          toolbar: true,
          expand: true,
          showTokenChips: true,
          tokenPaths: ["inputData", "expectedOutput", "sessionId", "userId"],
        },
      },
    ],
  },
  {
    id: "schema",
    title: "Schema",
    order: 3,
    collapsible: false,
    defaultCollapsed: false,
    showSectionTitle: true,
    fields: [
      {
        fieldId: "schema",
        label: "I/O Arguments",
        type: "schemaButton",
        valuePath: "schema",
      },
    ],
  },
  {
    id: "model-settings",
    title: "Model settings",
    description: "Temperature, max tokens, retries, and timeouts.",
    order: 4,
    collapsible: true,
    defaultCollapsed: true,
    fields: [
      {
        fieldId: "temperature",
        label: "Temperature",
        type: "text",
        placeholder: "0.7",
        valuePath: "temperature",
        helperText: "Float between 0 and 2. Higher = more creative.",
      },
      {
        fieldId: "maxTokens",
        label: "Max Tokens",
        type: "text",
        placeholder: "4096",
        valuePath: "maxTokens",
        helperText: "Maximum tokens in the response.",
      },
      {
        fieldId: "maxRetries",
        label: "Max Retries",
        type: "text",
        placeholder: "3",
        valuePath: "maxRetries",
        helperText: "Number of retry attempts on failure.",
      },
    ],
  },
];
