
export interface HistoryItem {
  id: string;
  code: string;
  output: string[];
  timestamp: number;
  status: "success" | "error";
}

export interface Settings {
  theme: "vs-dark";
  fontSize: number;
  tabSize: number;
  language: "javascript" | "typescript";
  autoSave: boolean;
  wordWrap: boolean;
}

export interface ApiConfig {
  provider: "deepseek" | "cohere";
  apiKey: string;
}

export const DEFAULT_COHERE_MODEL = "command";
export const COHERE_API_MODELS = ["command", "command-light", "command-nightly", "command-r", "command-r-plus", "command-a-03-2025"] as const;
export type CohereModelType = typeof COHERE_API_MODELS[number];

export const getThemeColors = () => {
  return {
    bg: "bg-editor-bg",
    text: "text-foreground",
    border: "border-editor-border",
    muted: "text-muted-foreground",
    primary: "text-editor-accent",
    inputBg: "bg-editor-bg/50",
    panelBg: "bg-editor-bg",
    hover: "hover:bg-editor-border",
    successText: "text-green-400 dark:text-green-400",
    errorText: "text-red-400 dark:text-red-400",
  };
};
