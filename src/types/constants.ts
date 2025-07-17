// =============================================================================
// ENUMS & CONSTANTS
// =============================================================================

export const BIOLOGICAL_SEX = ['male', 'female', 'other'] as const;
export const ACTIVITY_LEVELS = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'extra_active',
] as const;
export const DIET_GOALS = ['fat_loss', 'muscle_gain', 'recomp'] as const;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type BiologicalSex = (typeof BIOLOGICAL_SEX)[number];
export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];
export type DietGoal = (typeof DIET_GOALS)[number];

// =============================================================================
// DISPLAY LABELS (For UI components)
// =============================================================================

export const BIOLOGICAL_SEX_LABELS: Record<BiologicalSex, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
};

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Light (light exercise 1-3 days/week)',
  moderate: 'Moderate (moderate exercise 3-5 days/week)',
  active: 'Active (hard exercise 6-7 days/week)',
  extra_active: 'Extra Active (very hard exercise, physical job)',
};

export const DIET_GOAL_LABELS: Record<DietGoal, string> = {
  fat_loss: 'Fat Loss',
  muscle_gain: 'Muscle Gain',
  recomp: 'Body Recomposition',
};
