import { User } from 'firebase/auth';
import * as z from 'zod';
import {
  activityLevels as allActivityLevels,
  genders,
  preferredDiets,
  smartPlannerDietGoals,
} from './constants';

// Helper for preprocessing optional number fields: empty string, null, or non-numeric becomes undefined
export const preprocessOptionalNumber = (val: unknown) => {
  if (val === '' || val === null || val === undefined) {
    return undefined;
  }
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

// Helper to convert undefined to null for Firestore
export function preprocessDataForFirestore(
  data: Record<string, any> | null | undefined
): Record<string, any> | null | any[] {
  if (data === null || data === undefined) return null;

  if (typeof data !== 'object' || data instanceof Date) {
    return data === undefined ? null : data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => preprocessDataForFirestore(item));
  }

  const processedData: Record<string, any> = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      processedData[key] = preprocessDataForFirestore(value);
    }
  }
  return processedData;
}

export const ProfileFormSchema = z.object({
  name: z.string().min(1, 'Name is required.').optional(),
  subscription_status: z.string().nullable().optional(),
  long_term_goal_weight_kg: z
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
  // Medical Info & Physical Limitations
  pain_mobility_issues: z.array(z.string()).nullable().optional(),
  injuries: z.array(z.string()).nullable().optional(),
  surgeries: z.array(z.string()).nullable().optional(),
  // Exercise Preferences
  exercise_goals: z.array(z.string()).nullable().optional(),
  preferred_exercise_types: z.array(z.string()).nullable().optional(),
  exercise_frequency: z.string().nullable().optional(),
  typical_exercise_intensity: z.string().nullable().optional(),
  equipment_access: z.array(z.string()).nullable().optional(),
  // Added fields
  biological_sex: z
    .enum(genders.map((g) => g.value) as [string, ...string[]])
    .nullable()
    .optional(),
  current_weight_kg: z.coerce
    .number()
    .min(20, 'Weight must be at least 20kg')
    .max(500)
    .nullable()
    .optional(),
  height_cm: z.coerce
    .number()
    .min(50, 'Height must be at least 50cm')
    .max(300)
    .nullable()
    .optional(),
  age: z.coerce
    .number()
    .min(1, 'Age is required')
    .max(120)
    .nullable()
    .optional(),
  physical_activity_level: z
    .enum(allActivityLevels.map((al) => al.value) as [string, ...string[]])
    .nullable()
    .optional(),
  primary_diet_goal: z
    .enum(smartPlannerDietGoals.map((g) => g.value) as [string, ...string[]])
    .nullable()
    .optional(),
});
export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

// Interface for data structure stored in Firestore
export interface GlobalCalculatedTargets {
  bmr_kcal?: number | null;
  maintenance_calories_tdee?: number | null;
  custom_total_calories_final?: number | null;
  custom_protein_percentage?: number | null;
  custom_protein_g?: number | null;
  custom_carbs_percentage?: number | null;
  custom_carbs_g?: number | null;
  custom_fat_percentage?: number | null;
  custom_fat_g?: number | null;
  current_weight_for_custom_calc?: number | null;

  // Fields that don't exist in user structure - separated
  estimated_weekly_weight_change_kg?: number | null;
  protein_calories?: number | null;
  carb_calories?: number | null;
  fat_calories?: number | null;

  // Additional fields from the data structure
  custom_protein_per_kg?: number | null;
  custom_total_calories?: number | null;
  remaining_calories_carbs_percentage?: number | null;
  target_carbs_g?: number | null;
  target_carbs_percentage?: number | null;
  target_daily_calories?: number | null;
  target_fat_g?: number | null;
  target_fat_percentage?: number | null;
  target_protein_g?: number | null;
  target_protein_percentage?: number | null;

  proteinCalories?: number | null;
  carbCalories?: number | null;
  fatCalories?: number | null;
}

// Base fields for onboarding/profile data used by tools
export interface BaseProfileData extends User {
  name: string;
  age?: number | null;
  biological_sex?: string | null;
  height_cm?: number | null;
  current_weight_kg?: number | null;
  target_weight_1month_kg?: number | null;
  long_term_goal_weight_kg?: number | null;
  physical_activity_level?: string | null;
  primary_diet_goal?: string | null;

  // Body Composition
  bf_current?: number | null;
  bf_target?: number | null;
  bf_ideal?: number | null;
  mm_current?: number | null;
  mm_target?: number | null;
  mm_ideal?: number | null;
  bw_current?: number | null;
  bw_target?: number | null;
  bw_ideal?: number | null;

  // Measurements
  waist_current?: number | null;
  waist_goal_1m?: number | null;
  waist_ideal?: number | null;
  hips_current?: number | null;
  hips_goal_1m?: number | null;
  hips_ideal?: number | null;
  right_leg_current?: number | null;
  right_leg_goal_1m?: number | null;
  right_leg_ideal?: number | null;
  left_leg_current?: number | null;
  left_leg_goal_1m?: number | null;
  left_leg_ideal?: number | null;
  right_arm_current?: number | null;
  right_arm_goal_1m?: number | null;
  right_arm_ideal?: number | null;
  left_arm_current?: number | null;
  left_arm_goal_1m?: number | null;
  left_arm_ideal?: number | null;

  is_onboarding_complete?: boolean;
  subscription_status?: string | null;

  // Exercise related
  pain_mobility_issues?: string[] | null;
  injuries?: string[] | null;
  surgeries?: string[] | null;
  exercise_goals?: string[] | null;
  preferred_exercise_types?: string[] | null;
  exercise_frequency?: string | null;
  typical_exercise_intensity?: string | null;
  equipment_access?: string[] | null;

  // Diet preferences
  preferred_diet?: string | null;
  allergies?: string[] | null;
  preferred_cuisines?: string[] | null;
  dispreferrred_cuisines?: string[] | null;
  preferred_ingredients?: string[] | null;
  dispreferrred_ingredients?: string[] | null;
  preferred_micronutrients?: string[] | null;
  medical_conditions?: string[] | null;
  medications?: string[] | null;

  mealDistributions?: MealMacroDistribution[] | null;
}

// Schema for an ingredient in a meal
export const IngredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  quantity: z.preprocess(
    preprocessOptionalNumber,
    z.coerce
      .number()
      .min(0, 'Quantity must be non-negative')
      .nullable()
      .default(null)
  ),
  unit: z.string().min(1, 'Unit is required (e.g., g, ml, piece)'),
  calories: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).nullable().default(null)
  ),
  protein: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).nullable().default(null)
  ),
  carbs: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).nullable().default(null)
  ),
  fat: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).nullable().default(null)
  ),
});
export type Ingredient = z.infer<typeof IngredientSchema>;

// Schema for a single meal
export const MealSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Meal name is required'), // e.g. Breakfast, Lunch. This is the meal type.
  custom_name: z.string().optional().default(''), // User given name for the meal e.g. Chicken Salad
  ingredients: z.array(IngredientSchema).default([]),
  total_calories: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).nullable().default(null)
  ),
  total_protein: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).nullable().default(null)
  ),
  total_carbs: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).nullable().default(null)
  ),
  total_fat: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).nullable().default(null)
  ),
});
export type Meal = z.infer<typeof MealSchema>;

// Schema for a day's meal plan
export const DailyMealPlanSchema = z.object({
  day_of_week: z.string(), // e.g. "Monday"
  meals: z.array(MealSchema), // Array of Meal objects for the day
});
export type DailyMealPlan = z.infer<typeof DailyMealPlanSchema>;

// Schema for the entire weekly meal plan (current or optimized)
export const WeeklyMealPlanSchema = z.object({
  id: z.string().optional(), // Optional ID for the plan
  user_id: z.string().optional(), // Optional user ID association
  start_date: z.date().optional(), // Optional start date for the plan
  days: z.array(DailyMealPlanSchema), // Array of DailyMealPlan objects for the week
  weekly_summary: z
    .object({
      // Optional summary of weekly totals
      total_calories: z.number(),
      total_protein: z.number(),
      total_carbs: z.number(),
      total_fat: z.number(),
    })
    .optional(),
});
export type WeeklyMealPlan = z.infer<typeof WeeklyMealPlanSchema>;

export interface MealPlans {
  id: string;
  user_id: string;
  meal_data: WeeklyMealPlan;
  created_at: number;
  updated_at: number;
}

export const MealMacroDistributionSchema = z.object({
  mealName: z.string(),
  calories_pct: z.coerce
    .number()
    .min(0, '% must be >= 0')
    .max(100, '% must be <= 100')
    .default(0),
});
export type MealMacroDistribution = z.infer<typeof MealMacroDistributionSchema>;

export const MacroSplitterFormSchema = z
  .object({
    mealDistributions: z
      .array(MealMacroDistributionSchema)
      .length(6, `Must have 6 meal entries.`),
  })
  .superRefine((data, ctx) => {
    const checkSum = (
      macroKey: keyof Omit<MealMacroDistribution, 'mealName'>,
      macroName: string
    ) => {
      const sum = data.mealDistributions.reduce(
        (acc, meal) => acc + (Number(meal[macroKey]) || 0),
        0
      );
      if (Math.abs(sum - 100) > 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Total ${macroName} percentages must sum to 100%. Current sum: ${sum.toFixed(
            0
          )}%`,
          path: ['mealDistributions'],
        });
      }
    };
    checkSum('calories_pct', 'Calorie');
  });
export type MacroSplitterFormValues = z.infer<typeof MacroSplitterFormSchema>;

export const SmartCaloriePlannerFormSchema = z.object({
  age: z.coerce
    .number()
    .int('Age must be a whole number (e.g., 30, not 30.5).')
    .positive('Age must be a positive number.')
    .nullable(),
  biological_sex: z
    .enum(genders.map((g) => g.value) as [string, ...string[]], {
      required_error: 'Gender is required.',
    })
    .nullable(),
  height_cm: z.coerce
    .number()
    .positive('Height must be a positive number.')
    .nullable(),
  current_weight_kg: z.coerce
    .number()
    .positive('Current weight must be a positive number.')
    .nullable(),
  target_weight_1month_kg: z.coerce
    .number()
    .positive('1-Month Goal Weight must be a positive number.')
    .nullable(),
  long_term_goal_weight_kg: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce
        .number()
        .positive('Long-term Goal Weight must be positive if provided.')
        .optional()
    )
    .nullable(),
  physical_activity_level: z
    .enum(allActivityLevels.map((al) => al.value) as [string, ...string[]], {
      required_error: 'Activity level is required.',
    })
    .nullable(),
  primary_diet_goal: z
    .enum(smartPlannerDietGoals.map((g) => g.value) as [string, ...string[]], {
      required_error: 'Diet goal is required.',
    })
    .nullable(),

  bf_current: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce
        .number()
        .min(0, 'Must be >= 0')
        .max(100, 'Body fat % must be between 0 and 100.')
        .optional()
    )
    .nullable(),
  bf_target: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce
        .number()
        .min(0, 'Must be >= 0')
        .max(100, 'Target body fat % must be between 0 and 100.')
        .optional()
    )
    .nullable(),
  bf_ideal: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce.number().min(0).max(100).optional()
    )
    .nullable(),
  mm_current: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce.number().min(0).max(100).optional()
    )
    .nullable(),
  mm_target: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce.number().min(0).max(100).optional()
    )
    .nullable(),
  mm_ideal: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce.number().min(0).max(100).optional()
    )
    .nullable(),
  bw_current: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce.number().min(0).max(100).optional()
    )
    .nullable(),
  bw_target: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce.number().min(0).max(100).optional()
    )
    .nullable(),
  bw_ideal: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce.number().min(0).max(100).optional()
    )
    .nullable(),

  waist_current: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  waist_goal_1m: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  waist_ideal: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  hips_current: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  hips_goal_1m: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  hips_ideal: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),

  right_leg_current: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  right_leg_goal_1m: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  right_leg_ideal: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  left_leg_current: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  left_leg_goal_1m: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  left_leg_ideal: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  right_arm_current: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  right_arm_goal_1m: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  right_arm_ideal: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  left_arm_current: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  left_arm_goal_1m: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),
  left_arm_ideal: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().min(0).optional())
    .nullable(),

  custom_total_calories: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce
        .number()
        .int('Custom calories must be a whole number if provided.')
        .positive('Custom calories must be positive if provided.')
        .optional()
    )
    .nullable(),
  custom_protein_per_kg: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce
        .number()
        .min(0, 'Protein per kg must be non-negative if provided.')
        .optional()
    )
    .nullable(), // Protein per kg can be decimal
  remaining_calories_carb_pct: z
    .preprocess(
      preprocessOptionalNumber,
      z.coerce
        .number()
        .int('Carb percentage must be a whole number.')
        .min(0, 'Carb percentage must be between 0 and 100.')
        .max(100, 'Carb percentage must be between 0 and 100.')
        .optional()
        .default(50)
    )
    .nullable(),

  carbCalories: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().int().optional())
    .nullable(),
  carbGrams: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().int().optional())
    .nullable(),
  carbTargetPct: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().int().optional())
    .nullable(),

  fatCalories: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().int().optional())
    .nullable(),
  fatGrams: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().int().optional())
    .nullable(),
  fatTargetPct: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().int().optional())
    .nullable(),

  proteinCalories: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().int().optional())
    .nullable(),
  proteinGrams: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().int().optional())
    .nullable(),
  proteinTargetPct: z
    .preprocess(preprocessOptionalNumber, z.coerce.number().int().optional())
    .nullable(),
});
export type SmartCaloriePlannerFormValues = z.infer<
  typeof SmartCaloriePlannerFormSchema
>;

export const MealSuggestionPreferencesSchema = z.object({
  preferred_diet: z
    .enum(preferredDiets.map((pd) => pd.value) as [string, ...string[]])
    .nullable(),
  preferred_cuisines: z.array(z.string()).nullable(),
  dispreferrred_cuisines: z.array(z.string()).nullable(),
  preferred_ingredients: z.array(z.string()).nullable(),
  dispreferrred_ingredients: z.array(z.string()).nullable(),
  allergies: z.array(z.string()).nullable(),
  preferred_micronutrients: z.array(z.string()).nullable(),
  medical_conditions: z.array(z.string()).nullable(),
  medications: z.array(z.string()).nullable(),
});
export type MealSuggestionPreferencesValues = z.infer<
  typeof MealSuggestionPreferencesSchema
>;

export interface MacroResults {
  Protein_g: number;
  Carbs_g: number;
  Fat_g: number;
  Protein_cals: number;
  Carb_cals: number;
  Fat_cals: number;
  Total_cals: number;
  Protein_pct: number;
  Carb_pct: number;
  Fat_pct: number;
}

const CalculatedTargetsSchema = z.object({
  bmr: z.number().optional(),
  tdee: z.number().optional(),
  targetCalories: z.number().optional(),
  targetProtein: z.number().optional(),
  targetCarbs: z.number().optional(),
  targetFat: z.number().optional(),
  current_weight_for_calc: z.number().optional(),
});

// If you need the inferred TypeScript type:
// type CalculatedTargets = z.infer<typeof CalculatedTargetsSchema>;

const CustomCalculatedTargetsSchema = z.object({
  totalCalories: z.number().optional(),
  proteinGrams: z.number().optional(),
  proteinCalories: z.number().optional(),
  proteinPct: z.number().optional(),
  carbGrams: z.number().optional(),
  carbCalories: z.number().optional(),
  carbPct: z.number().optional(),
  fatGrams: z.number().optional(),
  fatCalories: z.number().optional(),
  fatPct: z.number().optional(),
});
type CustomCalculatedTargets = z.infer<typeof CustomCalculatedTargetsSchema>;

// Onboarding Schema
export const OnboardingFormSchema = z.object({
  age: z.coerce
    .number()
    .int('Age must be a whole number.')
    .min(1, 'Age is required')
    .max(120),
  biological_sex: z.enum(genders.map((g) => g.value) as [string, ...string[]], {
    required_error: 'Biological sex is required.',
  }),
  height_cm: z.coerce.number().min(50, 'Height must be at least 50cm').max(300),
  current_weight_kg: z.coerce
    .number()
    .min(20, 'Weight must be at least 20kg')
    .max(500),
  target_weight_1month_kg: z.coerce
    .number()
    .min(20, 'Target weight must be at least 20kg')
    .max(500),
  long_term_goal_weight_kg: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  physical_activity_level: z.enum(
    allActivityLevels.map((al) => al.value) as [string, ...string[]],
    { required_error: 'Activity level is required.' }
  ),
  primary_diet_goal: z.enum(
    smartPlannerDietGoals.map((g) => g.value) as [string, ...string[]],
    { required_error: 'Diet goal is required.' }
  ),

  bf_current: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).max(100).optional()
  ),
  bf_target: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).max(100).optional()
  ),
  bf_ideal: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).max(100).optional()
  ),
  mm_current: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).max(100).optional()
  ),
  mm_target: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).max(100).optional()
  ),
  mm_ideal: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).max(100).optional()
  ),
  bw_current: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).max(100).optional()
  ),
  bw_target: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).max(100).optional()
  ),
  bw_ideal: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).max(100).optional()
  ),

  waist_current: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  waist_goal_1m: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  waist_ideal: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  hips_current: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  hips_goal_1m: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  hips_ideal: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  right_leg_current: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  right_leg_goal_1m: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  right_leg_ideal: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  left_leg_current: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  left_leg_goal_1m: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  left_leg_ideal: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  right_arm_current: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  right_arm_goal_1m: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  right_arm_ideal: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  left_arm_current: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  left_arm_goal_1m: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),
  left_arm_ideal: z.preprocess(
    preprocessOptionalNumber,
    z.coerce.number().min(0).optional()
  ),

  preferred_diet: z.string().optional(),
  allergies: z.string().or(z.array(z.string())).optional(),
  preferred_cuisines: z.string().or(z.array(z.string())).optional(),
  dispreferrred_cuisines: z.string().or(z.array(z.string())).optional(),
  preferred_ingredients: z.string().or(z.array(z.string())).optional(),
  dispreferrred_ingredients: z.string().or(z.array(z.string())).optional(),
  mealsPerDay: z.coerce.number().min(2).max(7).default(3),
  preferred_micronutrients: z.string().or(z.array(z.string())).optional(),

  medical_conditions: z.string().or(z.array(z.string())).optional(),
  medications: z.string().or(z.array(z.string())).optional(),

  systemCalculatedTargets: CalculatedTargetsSchema,
  userCustomizedTargets: CustomCalculatedTargetsSchema,

  custom_total_calories: z.preprocess(
    preprocessOptionalNumber,
    z.coerce
      .number()
      .positive('Custom calories must be positive if provided.')
      .optional()
  ),
  custom_protein_per_kg: z.preprocess(
    preprocessOptionalNumber,
    z.coerce
      .number()
      .min(0, 'Protein per kg must be non-negative if provided.')
      .optional()
  ),
  remaining_calories_carbs_percentage: z.preprocess(
    preprocessOptionalNumber,
    z.coerce
      .number()
      .int('Carb % must be a whole number.')
      .min(0)
      .max(100)
      .optional()
      .default(50)
  ),

  mealDistributions: z.array(MealMacroDistributionSchema).optional(),

  typicalMealsDescription: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof OnboardingFormSchema>;
export type { CustomCalculatedTargets };

export interface UserPlanType {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  bmr_kcal: number | null;

  custom_carbs_g: number | null;
  custom_carbs_percentage: number | null;
  custom_fat_g: number | null;
  custom_fat_percentage: number | null;
  custom_protein_g: number | null;
  custom_protein_per_kg: number | null;
  custom_protein_percentage: number | null;
  custom_total_calories: number | null;
  custom_total_calories_final: number | null;

  maintenance_calories_tdee: number | null;
  remaining_calories_carb_pct: number | null;
  remaining_calories_carbs_percentage: number | null;

  target_carbs_g: number;
  target_carbs_percentage: number;
  target_daily_calories: number;
  target_fat_g: number;
  target_fat_percentage: number;
  target_protein_g: number;
  target_protein_percentage: number;

  proteinCalories?: number | null;
  carbCalories?: number | null;
  fatCalories?: number | null;

  current_weight_for_custom_calc?: number | null;
}

export const IngredientDetailSchema = z.object({
  name: z.string(),
  amount: z.string(),
  unit: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  macrosString: z.string(),
});
export type IngredientDetail = z.infer<typeof IngredientDetailSchema>;

export type MealSuggestion = z.infer<typeof MealSuggestionSchema>;

export const MealSuggestionSchema = z.object({
  mealTitle: z.string(),
  description: z.string(),
  ingredients: z.array(IngredientDetailSchema),
  totalCalories: z.number(),
  totalProtein: z.number(),
  totalCarbs: z.number(),
  totalFat: z.number(),
  instructions: z.string().optional(),
});
export const SuggestMealsForMacrosOutputSchema = z.object({
  suggestions: z.array(MealSuggestionSchema),
});
export type SuggestMealsForMacrosOutput = z.infer<
  typeof SuggestMealsForMacrosOutputSchema
>;

// SUGGEST MEAL
export const SuggestMealsForMacrosInputSchema = z.object({
  meal_name: z.string(),
  target_calories: z.number(),
  target_protein_grams: z.number(),
  target_carbs_grams: z.number(),
  target_fat_grams: z.number(),
  age: z.number().optional(),
  gender: z.string().optional(),
  activity_level: z.string().optional(),
  diet_goal: z.string().optional(),
  preferred_diet: z.string().optional(),
  preferred_cuisines: z.array(z.string()).optional(),
  dispreferrred_cuisines: z.array(z.string()).optional(),
  preferred_ingredients: z.array(z.string()).optional(),
  dispreferrred_ingredients: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medical_conditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
});
export type SuggestMealsForMacrosInput = z.infer<
  typeof SuggestMealsForMacrosInputSchema
>;

export const AIServiceIngredientSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});
export type AIServiceIngredient = z.infer<typeof AIServiceIngredientSchema>;

export const AIServiceMealSchema = z.object({
  name: z.string(),
  customName: z.string().optional(),
  ingredients: z.array(AIServiceIngredientSchema),
  total_calories: z.number(),
  total_protein: z.number(),
  total_carbs: z.number(),
  total_fat: z.number(),
});
export type AIServiceMeal = z.infer<typeof AIServiceMealSchema>;

export const AdjustMealIngredientsInputSchema = z.object({
  originalMeal: AIServiceMealSchema,
  targetMacros: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
  userProfile: z.object({
    age: z.number().optional(),
    biological_sex: z.string().optional(),
    physical_activity_level: z.string().optional(),
    primary_diet_goal: z.string().optional(),
    preferred_diet: z.string().optional(),
    allergies: z.array(z.string()).optional(),
    dispreferrred_ingredients: z.array(z.string()).optional(),
    preferred_ingredients: z.array(z.string()).optional(),
  }),
});
export type AdjustMealIngredientsInput = z.infer<
  typeof AdjustMealIngredientsInputSchema
>;

export const AdjustMealIngredientsOutputSchema = z.object({
  adjustedMeal: AIServiceMealSchema,
  explanation: z.string(),
});
export type AdjustMealIngredientsOutput = z.infer<
  typeof AdjustMealIngredientsOutputSchema
>;

export const AIDailyMealSchema = z.object({
  meal_title: z
    .string()
    .describe(
      "A short, appetizing name for the meal. E.g., 'Sunrise Scramble' or 'Zesty Salmon Salad'."
    ),
  ingredients: z
    .array(
      z.object({
        name: z
          .string()
          .describe(
            "The name of the ingredient, e.g., 'Large Egg' or 'Rolled Oats'."
          ),
        calories: z
          .number()
          .describe('Total calories for the quantity of this ingredient.'),
        protein: z.number().describe('Grams of protein.'),
        carbs: z.number().describe('Grams of carbohydrates.'),
        fat: z.number().describe('Grams of fat.'),
      })
    )
    .min(1, 'Each meal must have at least one ingredient.'),
});

export const AIDailyPlanOutputSchema = z.object({
  meals: z
    .array(AIDailyMealSchema)
    .describe('An array of all meals for this one day.'),
});
export type AIDailyPlanOutput = z.infer<typeof AIDailyPlanOutputSchema>;
