import { BiologicalSex } from './constants';

// =============================================================================
// DATABASE TYPES (Raw database schema types)
// =============================================================================

export interface User {
  id: number;
  user_id: string;
  created_at: string;
  is_onboarding_complete: boolean;

  // Basic user information
  age: number | null;
  biological_sex: BiologicalSex | null;
  height_cm: number | null;
  current_weight_kg: number | null;
  target_weight_1month_kg: number | null;
  long_term_goal_weight_kg: number | null;

  // Activity and goals
  physical_activity_level: ActivityLevel | null;
  primary_diet_goal: DietGoal | null;
}

export interface SmartPlanner {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;

  // Calculated daily targets
  bmr_kcal: number | null;
  maintenance_calories_tdee: number | null;
  target_daily_calories: number | null;
  target_protein_g: number | null;
  target_protein_percentage: number | null;
  target_carbs_g: number | null;
  target_carbs_percentage: number | null;
  target_fat_g: number | null;
  target_fat_percentage: number | null;

  // Custom plan options (optional fields)
  custom_total_calories: number | null;
  custom_protein_per_kg: number | null;
  remaining_calories_carbs_percentage: number | null;

  // Custom plan results
  custom_total_calories_final: number | null;
  custom_protein_g: number | null;
  custom_protein_percentage: number | null;
  custom_carbs_g: number | null;
  custom_carbs_percentage: number | null;
  custom_fat_g: number | null;
  custom_fat_percentage: number | null;
}

// =============================================================================
// INSERT/UPDATE TYPES (For database operations)
// =============================================================================

export type UserInsert = Omit<User, 'id' | 'created_at'>;
export type UserUpdate = Partial<Omit<User, 'id' | 'user_id' | 'created_at'>>;

export type SmartPlannerInsert = Omit<
  SmartPlanner,
  'id' | 'created_at' | 'updated_at'
>;
export type SmartPlannerUpdate = Partial<
  Omit<SmartPlanner, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>;

// =============================================================================
// COMBINED TYPES (For convenience)
// =============================================================================

export interface UserWithSmartPlanner extends User {
  smart_planner?: SmartPlanner;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type DatabaseTable = 'users' | 'smart_planner';

export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
}
