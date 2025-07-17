import { z } from 'zod';
import { BIOLOGICAL_SEX, ACTIVITY_LEVELS, DIET_GOALS } from './constants';

// =============================================================================
// FORM SCHEMAS (For frontend forms)
// =============================================================================

// Extended ProfileFormSchema with new fields
export const ProfileFormSchema = z.object({
  name: z.string().min(1, 'Name is required.').optional(),
  subscriptionStatus: z.string().optional(),

  // Basic user information (new schema fields)
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
  physical_activity_level: z.enum(ACTIVITY_LEVELS).optional(),
  primary_diet_goal: z.enum(DIET_GOALS).optional(),

  // Legacy fields (keeping for backward compatibility)
  goalWeight: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') return val === '' ? undefined : Number(val);
      return undefined;
    })
    .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
      message: 'Goal weight must be a positive number',
    })
    .optional(),
  gender: z.enum(BIOLOGICAL_SEX).optional(),
  currentWeight: z.coerce
    .number()
    .min(20, 'Weight must be at least 20kg')
    .max(500)
    .optional(),
  height: z.coerce
    .number()
    .min(50, 'Height must be at least 50cm')
    .max(300)
    .optional(),
  activityLevel: z.enum(ACTIVITY_LEVELS).optional(),
  dietGoal: z.enum(DIET_GOALS).optional(),

  // Medical Info & Physical Limitations
  painMobilityIssues: z.string().optional(),
  injuries: z.array(z.string()).optional(),
  surgeries: z.array(z.string()).optional(),

  // Exercise Preferences
  exerciseGoals: z.array(z.string()).optional(),
  exercisePreferences: z.array(z.string()).optional(),
  exerciseFrequency: z.string().optional(),
  exerciseIntensity: z.string().optional(),
  equipmentAccess: z.array(z.string()).optional(),
});

// Smart Planner Form Schema (for user input)
export const SmartPlannerFormSchema = z.object({
  // Custom plan inputs
  custom_total_calories: z.coerce.number().min(0).optional(),
  custom_protein_per_kg: z.coerce.number().min(0).max(10).optional(),
  remaining_calories_carbs_percentage: z.coerce
    .number()
    .min(0)
    .max(100)
    .optional(),
});

// Onboarding Form Schema (subset of profile fields)
export const OnboardingFormSchema = z.object({
  age: z.coerce
    .number()
    .min(1, 'Age is required')
    .max(120, 'Age must be less than 120'),
  biological_sex: z.enum(BIOLOGICAL_SEX, {
    required_error: 'Please select your biological sex',
  }),
  height_cm: z.coerce
    .number()
    .min(50, 'Height must be at least 50cm')
    .max(300, 'Height must be less than 300cm'),
  current_weight_kg: z.coerce
    .number()
    .min(20, 'Weight must be at least 20kg')
    .max(500, 'Weight must be less than 500kg'),
  target_weight_1month_kg: z.coerce
    .number()
    .min(20, 'Target weight must be at least 20kg')
    .max(500, 'Target weight must be less than 500kg'),
  physical_activity_level: z.enum(ACTIVITY_LEVELS, {
    required_error: 'Please select your activity level',
  }),
  primary_diet_goal: z.enum(DIET_GOALS, {
    required_error: 'Please select your primary diet goal',
  }),
  long_term_goal_weight_kg: z.coerce
    .number()
    .min(20, 'Goal weight must be at least 20kg')
    .max(500, 'Goal weight must be less than 500kg')
    .optional(),
});

// =============================================================================
// INFERRED TYPES FROM FORM SCHEMAS
// =============================================================================

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
export type SmartPlannerFormValues = z.infer<typeof SmartPlannerFormSchema>;
export type OnboardingFormValues = z.infer<typeof OnboardingFormSchema>;
