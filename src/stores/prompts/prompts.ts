import { create } from "zustand";
import type { PromptData } from "@/types";

interface PromptsState {
  prompts: PromptData[];
  setPrompts: (newPrompt: PromptData) => void;
  clearPrompts: () => void;
}

const usePrompts = create<PromptsState>((set) => ({
  prompts: [],
  setPrompts: (newPrompt) =>
    set((state) => ({ prompts: [...state.prompts, newPrompt] })),
  clearPrompts: () => set({ prompts: [] }),
}));

export default usePrompts;
