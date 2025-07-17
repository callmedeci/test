// =============================================================================
// BUSINESS LOGIC TYPES (For calculations and business rules)
// =============================================================================

export interface NutritionPlan {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: {
    grams: number;
    percentage: number;
  };
  carbs: {
    grams: number;
    percentage: number;
  };
  fat: {
    grams: number;
    percentage: number;
  };
}

export interface CustomNutritionPlan {
  totalCalories: number;
  protein: {
    grams: number;
    percentage: number;
  };
  carbs: {
    grams: number;
    percentage: number;
  };
  fat: {
    grams: number;
    percentage: number;
  };
}

export interface MacroCalculationInput {
  age: number;
  biologicalSex: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'extra_active';
  dietGoal: 'fat_loss' | 'muscle_gain' | 'recomp';
}

export interface CustomMacroInput {
  totalCalories?: number;
  proteinPerKg?: number;
  carbsPercentage?: number;
  currentWeight: number;
}

export interface WeightGoalProgress {
  current: number;
  oneMonth: number;
  longTerm?: number;
  weeklyChange: number;
  isRealistic: boolean;
  recommendation?: string;
}

export interface ActivityMultiplier {
  sedentary: 1.2;
  light: 1.375;
  moderate: 1.55;
  active: 1.725;
  extra_active: 1.9;
}

export interface CalorieAdjustment {
  fat_loss: -0.15; // -15% for fat loss
  muscle_gain: 0.1; // +10% for muscle gain
  recomp: 0; // maintenance for recomp
}

// =============================================================================
// CALCULATION RESULT TYPES
// =============================================================================

export interface BMRResult {
  bmr: number;
  formula: 'harris-benedict' | 'mifflin-st-jeor';
}

export interface TDEEResult {
  tdee: number;
  bmr: number;
  activityMultiplier: number;
}

export interface MacroDistribution {
  protein: {
    grams: number;
    calories: number;
    percentage: number;
  };
  carbs: {
    grams: number;
    calories: number;
    percentage: number;
  };
  fat: {
    grams: number;
    calories: number;
    percentage: number;
  };
  totalCalories: number;
}

// =============================================================================
// UTILITY TYPES FOR CALCULATIONS
// =============================================================================

export type NutritionCalculationError =
  | 'INVALID_INPUT'
  | 'CALCULATION_ERROR'
  | 'UNREALISTIC_GOAL'
  | 'MISSING_DATA';

export interface CalculationResult<T> {
  success: boolean;
  data?: T;
  error?: NutritionCalculationError;
  message?: string;
}
