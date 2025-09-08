import { create } from "zustand";

interface QuestionNameState {
  questionName: string;
  setQuestionName: (newValue: string) => void;
}

const useQuestionName = create<QuestionNameState>((set) => ({
  questionName: "",
  setQuestionName: (newValue) => set({ questionName: newValue }),
}));

export default useQuestionName;
