export interface MealPlan {
  user_id: string;
  meal_data: MealPlanEntry[];
}

export interface MealPlanEntry {
  meal_type: string;
  name: string;
  ingredients: Ingredient[];
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface MealProgress {
  date: string;
  meal_type: string;
  followed_plan: boolean;
  consumed_calories: number;
  consumed_protein: number;
  consumed_carbs: number;
  consumed_fat: number;
  custom_ingredients: Ingredient[];
  note?: string;
}

export interface DailyMealData {
  meal_type: string;
  planned: MealPlanEntry;
  tracked?: MealProgress;
  status: 'success' | 'failure' | 'neutral' | 'untracked';
}

export interface ChartData {
  meal_type: string;
  target_calories: number;
  consumed_calories: number;
}

export interface DateStatus {
  date: string;
  status: 'success' | 'failure' | 'neutral' | 'untracked';
  total_target: number;
  total_consumed: number;
}

export interface WeeklySummary {
  total_target_calories: number;
  total_consumed_calories: number;
  meals_followed: number;
  total_meals: number;
  adherence_percentage: number;
}