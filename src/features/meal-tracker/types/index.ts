export interface TrackedMeal {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: 'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Evening Snack';
  followed: boolean;
  consumedMeal?: string;
  quantity?: string;
  calories?: number;
  notes?: string;
}

export interface PlannedMeal {
  id: string;
  mealType: 'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Evening Snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

export interface DayMealData {
  date: string;
  plannedMeals: PlannedMeal[];
  trackedMeals: TrackedMeal[];
}

export interface MealTrackerStats {
  totalPlannedCalories: number;
  totalConsumedCalories: number;
  mealsFollowed: number;
  totalMeals: number;
  caloriesDifference: number;
  adherencePercentage: number;
}

export type ViewMode = 'day' | 'week';
export type MealType = TrackedMeal['mealType'];