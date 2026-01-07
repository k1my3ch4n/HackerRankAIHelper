import { create } from "zustand";

interface IsLoadingState {
  isLoading: boolean;
  setIsLoading: (newState: boolean) => void;
  resetIsLoading: () => void;
}

const useIsLoading = create<IsLoadingState>((set) => ({
  isLoading: false,
  setIsLoading: (newState) => set({ isLoading: newState }),
  resetIsLoading: () => set({ isLoading: false }),
}));

export default useIsLoading;
