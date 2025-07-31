export interface TrackedMeal {
  id: string;
  meal_type: string;
  planned_meal: string;
  planned_calories: number;
  followed_plan: boolean;
  actual_meal?: string;
  actual_quantity?: string;
  actual_calories?: number;
  notes?: string;
}

export interface DailyTracking {
  date: string;
  day_of_week: string;
  meals: TrackedMeal[];
  total_planned_calories: number;
  total_actual_calories: number;
  meals_followed: number;
  total_meals: number;
}

export interface WeeklyTracking {
  week_start: string;
  week_end: string;
  week_label: string;
  days: DailyTracking[];
  weekly_summary: {
    total_planned_calories: number;
    total_actual_calories: number;
    total_meals_followed: number;
    total_meals: number;
    adherence_percentage: number;
  };
}

export interface WeekOption {
  value: string;
  label: string;
  week_start: string;
  week_end: string;
  is_current: boolean;
  is_future: boolean;
}

export interface EditMealFormData {
  followed_plan: boolean;
  actual_meal: string;
  actual_quantity: string;
  actual_calories: number;
  notes: string;
}