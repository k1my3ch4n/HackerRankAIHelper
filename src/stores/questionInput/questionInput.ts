import { create } from "zustand";

interface QuestionInputState {
  questionInput: string;
  setQuestionInput: (newValue: string) => void;
}

const useQuestionInput = create<QuestionInputState>((set) => ({
  questionInput: "",
  setQuestionInput: (newValue) => set({ questionInput: newValue }),
}));

export default useQuestionInput;
