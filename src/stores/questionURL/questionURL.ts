import { create } from "zustand";

interface QuestionURLState {
  questionURL: string;
  setQuestionURL: (newValue: string) => void;
}

const useQuestionURL = create<QuestionURLState>((set) => ({
  questionURL: "",
  setQuestionURL: (newValue) => set({ questionURL: newValue }),
}));

export default useQuestionURL;
