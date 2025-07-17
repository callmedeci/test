import { z } from 'zod';
import { BIOLOGICAL_SEX, ACTIVITY_LEVELS, DIET_GOALS } from './constants';

// =============================================================================
// ZOD SCHEMAS FOR VALIDATION
// =============================================================================

// User Schema
export const UserSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  is_onboarding_complete: z.boolean().default(false),

  // Basic user information
  age: z.coerce
    .number()
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be less than 120')
    .optional(),
  biological_sex: z.enum(BIOLOGICAL_SEX).optional(),
  height_cm: z.coerce
    .number()
    .min(50, 'Height must be at least 50cm')
    .max(300, 'Height must be less than 300cm')
    .optional(),
  current_weight_kg: z.coerce
    .number()
    .min(20, 'Weight must be at least 20kg')
    .max(500, 'Weight must be less than 500kg')
    .optional(),
  target_weight_1month_kg: z.coerce
    .number()
    .min(20, 'Target weight must be at least 20kg')
    .max(500, 'Target weight must be less than 500kg')
    .optional(),
  long_term_goal_weight_kg: z.coerce
    .number()
    .min(20, 'Goal weight must be at least 20kg')
    .max(500, 'Goal weight must be less than 500kg')
    .optional(),

  // Activity and goals
  physical_activity_level: z.enum(ACTIVITY_LEVELS).optional(),
  primary_diet_goal: z.enum(DIET_GOALS).optional(),
});

// Smart Planner Schema
export const SmartPlannerSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),

  // Calculated daily targets
  bmr_kcal: z.coerce.number().min(0).optional(),
  maintenance_calories_tdee: z.coerce.number().min(0).optional(),
  target_daily_calories: z.coerce.number().min(0).optional(),
  target_protein_g: z.coerce.number().min(0).optional(),
  target_protein_percentage: z.coerce.number().min(0).max(100).optional(),
  target_carbs_g: z.coerce.number().min(0).optional(),
  target_carbs_percentage: z.coerce.number().min(0).max(100).optional(),
  target_fat_g: z.coerce.number().min(0).optional(),
  target_fat_percentage: z.coerce.number().min(0).max(100).optional(),

  // Custom plan options
  custom_total_calories: z.coerce.number().min(0).optional(),
  custom_protein_per_kg: z.coerce.number().min(0).max(10).optional(),
  remaining_calories_carbs_percentage: z.coerce
    .number()
    .min(0)
    .max(100)
    .optional(),

  // Custom plan results
  custom_total_calories_final: z.coerce.number().min(0).optional(),
  custom_protein_g: z.coerce.number().min(0).optional(),
  custom_protein_percentage: z.coerce.number().min(0).max(100).optional(),
  custom_carbs_g: z.coerce.number().min(0).optional(),
  custom_carbs_percentage: z.coerce.number().min(0).max(100).optional(),
  custom_fat_g: z.coerce.number().min(0).optional(),
  custom_fat_percentage: z.coerce.number().min(0).max(100).optional(),
});

// =============================================================================
// INFERRED TYPES FROM SCHEMAS
// =============================================================================

export type UserFormValues = z.infer<typeof UserSchema>;
export type SmartPlannerValues = z.infer<typeof SmartPlannerSchema>;
