export interface MealProgress {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  meal_type: 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner' | 'eveningSnack';
  followed_plan: boolean;
  consumed_calories: number;
  consumed_protein: number;
  consumed_carbs: number;
  consumed_fat: number;
  custom_ingredients?: Array<{
    name: string;
    quantity: string;
  }>;
  note?: string;
}

export interface PlannedMeal {
  id: string;
  meal_type: 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner' | 'eveningSnack';
  name: string;
  ingredients: Array<{
    name: string;
    quantity: string;
  }>;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface DayStatus {
  date: string;
  status: 'success' | 'failure' | 'undereaten' | 'no-data';
  consumed_calories: number;
  target_calories: number;
}

export interface ChartData {
  meal_type: string;
  consumed_calories: number;
  target_calories: number;
}

export type MealType = 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner' | 'eveningSnack';