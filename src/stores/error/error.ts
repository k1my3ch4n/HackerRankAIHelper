import { create } from "zustand";

interface ErrorState {
  error: string | null;
  setError: (message: string | null) => void;
  clearError: () => void;
}

const useError = create<ErrorState>((set) => ({
  error: null,
  setError: (message) => set({ error: message }),
  clearError: () => set({ error: null }),
}));

export default useError;
