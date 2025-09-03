import { create } from "zustand";

interface IsLoadingState {
  isLoading: boolean;
  setIsLoading: (newState: boolean) => void;
}

const useIsLoading = create<IsLoadingState>((set) => ({
  isLoading: false,
  setIsLoading: (newState) => set({ isLoading: newState }),
}));

export default useIsLoading;
