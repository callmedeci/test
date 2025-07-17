import { type GeneratePersonalizedMealPlanInput } from '@/ai/flows/generate-meal-plan';
import {
  daysOfWeek,
  defaultMacroPercentages,
  mealNames,
} from '@/lib/constants';
import { BaseProfileData, WeeklyMealPlan } from '@/lib/schemas';
import { DailyTargetsTypes, MealToOptimizeTypes } from '../types';
import { requiredFields } from './config';

export function mapProfileToMealPlanInput(
  profile: Partial<BaseProfileData>
): GeneratePersonalizedMealPlanInput {
  const input: GeneratePersonalizedMealPlanInput = {
    age: profile.age!,
    biological_sex: profile.biological_sex!,
    height_cm: profile.height_cm!,
    current_weight_kg: profile.current_weight_kg!,
    target_weight_1month_kg: profile.target_weight_1month_kg!,
    physical_activity_level: profile.physical_activity_level!,
    primary_diet_goal: profile.primary_diet_goal!,

    // Optional fields
    long_term_goal_weight_kg: profile.long_term_goal_weight_kg ?? undefined,
    bf_current: profile.bf_current ?? undefined,
    bf_target: profile.bf_target ?? undefined,
    bf_ideal: profile.bf_ideal ?? undefined,
    mm_current: profile.mm_current ?? undefined,
    mm_target: profile.mm_target ?? undefined,
    mm_ideal: profile.mm_ideal ?? undefined,
    bw_current: profile.bw_current ?? undefined,
    bw_target: profile.bw_target ?? undefined,
    bw_ideal: profile.bw_ideal ?? undefined,
    waist_current: profile.waist_current ?? undefined,
    waist_goal_1m: profile.waist_goal_1m ?? undefined,
    waist_ideal: profile.waist_ideal ?? undefined,
    hips_current: profile.hips_current ?? undefined,
    hips_goal_1m: profile.hips_goal_1m ?? undefined,
    hips_ideal: profile.hips_ideal ?? undefined,
    right_leg_current: profile.right_leg_current ?? undefined,
    right_leg_goal_1m: profile.right_leg_goal_1m ?? undefined,
    right_leg_ideal: profile.right_leg_ideal ?? undefined,
    left_leg_current: profile.left_leg_current ?? undefined,
    left_leg_goal_1m: profile.left_leg_goal_1m ?? undefined,
    left_leg_ideal: profile.left_leg_ideal ?? undefined,
    right_arm_current: profile.right_arm_current ?? undefined,
    right_arm_goal_1m: profile.right_arm_goal_1m ?? undefined,
    right_arm_ideal: profile.right_arm_ideal ?? undefined,
    left_arm_current: profile.left_arm_current ?? undefined,
    left_arm_goal_1m: profile.left_arm_goal_1m ?? undefined,
    left_arm_ideal: profile.left_arm_ideal ?? undefined,
    preferred_diet: profile.preferred_diet ?? undefined,
    allergies: profile.allergies ?? undefined,
    preferred_cuisines: profile.preferred_cuisines ?? undefined,
    dispreferrred_cuisines: profile.dispreferrred_cuisines ?? undefined,
    preferred_ingredients: profile.preferred_ingredients ?? undefined,
    dispreferrred_ingredients: profile.dispreferrred_ingredients ?? undefined,
    preferred_micronutrients: profile.preferred_micronutrients ?? undefined,
    medical_conditions: profile.medical_conditions ?? undefined,
    medications: profile.medications ?? undefined,
  };

  Object.keys(input).forEach(
    (key) =>
      input[key as keyof GeneratePersonalizedMealPlanInput] === undefined &&
      delete input[key as keyof GeneratePersonalizedMealPlanInput]
  );

  return input;
}

export function getAdjustedMealInput(
  profileData: Partial<BaseProfileData>,
  dailyTargets: DailyTargetsTypes,
  mealToOptimize: MealToOptimizeTypes
) {
  let mealDistribution;
  const userMealDistributions = profileData.mealDistributions;
  if (!userMealDistributions)
    mealDistribution = defaultMacroPercentages[mealToOptimize.name];
  else
    mealDistribution = userMealDistributions.filter(
      (meal) => meal.mealName === mealToOptimize.name
    )[0];

  const targetMacrosForMeal = {
    calories:
      dailyTargets.targetCalories! * (mealDistribution.calories_pct / 100),
    protein:
      dailyTargets.targetProtein! * (mealDistribution.calories_pct / 100),
    carbs: dailyTargets.targetCarbs! * (mealDistribution.calories_pct / 100),
    fat: dailyTargets.targetFat! * (mealDistribution.calories_pct / 100),
  };

  const preparedIngredients = mealToOptimize.ingredients.map((ing) => ({
    name: ing.name,
    quantity: Number(ing.quantity) || 0,
    unit: ing.unit,
    calories: Number(ing.calories) || 0,
    protein: Number(ing.protein) || 0,
    carbs: Number(ing.carbs) || 0,
    fat: Number(ing.fat) || 0,
  }));

  return {
    originalMeal: {
      name: mealToOptimize.name,
      customName: mealToOptimize.custom_name || '',
      ingredients: preparedIngredients,
      total_calories: Number(mealToOptimize.total_calories) || 0,
      total_protein: Number(mealToOptimize.total_protein) || 0,
      total_carbs: Number(mealToOptimize.total_carbs) || 0,
      total_fat: Number(mealToOptimize.total_fat) || 0,
    },
    targetMacros: targetMacrosForMeal,
    userProfile: {
      age: profileData.age ?? undefined,
      biological_sex: profileData.biological_sex ?? undefined,
      physical_activity_level: profileData.physical_activity_level ?? undefined,
      primary_diet_goal: profileData.primary_diet_goal ?? undefined,
      preferred_diet: profileData.preferred_diet ?? undefined,
      allergies: profileData.allergies ?? [],
      dispreferrred_ingredients: profileData.dispreferrred_ingredients ?? [],
      preferred_ingredients: profileData.preferred_ingredients ?? [],
    },
  };
}
export function getMissingProfileFields(
  profile: Partial<BaseProfileData>
): (keyof Partial<BaseProfileData>)[] {
  return requiredFields.filter((field) => !profile[field]);
}

export function generateInitialWeeklyPlan(): WeeklyMealPlan {
  return {
    days: daysOfWeek.map((day) => ({
      day_of_week: day,
      meals: mealNames.map((mealName) => ({
        name: mealName,
        custom_name: '',
        ingredients: [],
        total_calories: null,
        total_protein: null,
        total_carbs: null,
        total_fat: null,
      })),
    })),
  };
}
