// =============================================================================
// MAIN TYPES EXPORT FILE
// =============================================================================

export * from './constants';
export * from './database';
export * from './validation';
export * from './forms';
export * from './business';

// =============================================================================
// CONVENIENCE RE-EXPORTS (Most commonly used types)
// =============================================================================

// Database
export type { User, SmartPlanner, UserWithSmartPlanner } from './database';

// Forms
export type {
  ProfileFormValues,
  SmartPlannerFormValues,
  OnboardingFormValues,
} from './forms';

// Constants
export type { BiologicalSex, ActivityLevel, DietGoal } from './constants';

// Business
export type {
  NutritionPlan,
  MacroCalculationInput,
  WeightGoalProgress,
} from './business';
