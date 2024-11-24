import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  completedSteps: string[];
  isComplete: boolean;
  markStepComplete: (stepId: string) => void;
  markOnboardingComplete: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completedSteps: [],
      isComplete: false,
      markStepComplete: (stepId) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, stepId])],
        })),
      markOnboardingComplete: () => set({ isComplete: true }),
      reset: () => set({ completedSteps: [], isComplete: false }),
    }),
    {
      name: 'amelia-onboarding',
    }
  )
);