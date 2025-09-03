import { create } from "zustand";

export type TypeKey = "summary" | "hint" | "answer";

interface PromptDataType {
  type: TypeKey;
  questionTitle: string;
  summary: string;
}

interface PromptsState {
  prompts: PromptDataType[];
  setPrompts: (newPrompt: PromptDataType) => void;
}

const usePrompts = create<PromptsState>((set) => ({
  prompts: [],
  setPrompts: (newPrompt) =>
    set((state) => ({ prompts: [...state.prompts, newPrompt] })),
}));

export default usePrompts;
