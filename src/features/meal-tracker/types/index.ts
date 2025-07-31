export type MealType = 'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Evening Snack';

export type TrackedMeal = {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  followed: boolean;
  consumedMeal?: string;
  quantity?: string;
  calories?: number;
  notes?: string;
};

export type PlannedMeal = {
  name: string;
  custom_name: string;
  ingredients: Array<{
    name: string;
    quantity: number | null;
    unit: string;
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
  }>;
  total_calories: number | null;
  total_protein: number | null;
  total_carbs: number | null;
  total_fat: number | null;
};

export type DayMealPlan = {
  day_of_week: string;
  meals: PlannedMeal[];
};

export type CalorieSummary = {
  planned: number;
  consumed: number;
  difference: number;
  percentage: number;
};

export type MealTrackingStatus = {
  totalMeals: number;
  followedMeals: number;
  percentage: number;
};