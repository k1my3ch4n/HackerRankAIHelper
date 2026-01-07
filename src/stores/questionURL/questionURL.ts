import { create } from "zustand";

interface QuestionURLState {
  questionURL: string;
  setQuestionURL: (newValue: string) => void;
  clearQuestionURL: () => void;
}

const useQuestionURL = create<QuestionURLState>((set) => ({
  questionURL: "",
  setQuestionURL: (newValue) => set({ questionURL: newValue }),
  clearQuestionURL: () => set({ questionURL: "" }),
}));

export default useQuestionURL;
