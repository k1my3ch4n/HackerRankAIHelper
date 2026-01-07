export type PromptType = "summary" | "hint" | "answer";

export interface PromptData {
  type: PromptType;
  url: string;
  summary: string;
}
