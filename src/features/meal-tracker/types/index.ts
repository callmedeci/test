export type MealType =
  | 'breakfast'
  | 'morningSnack'
  | 'lunch'
  | 'afternoonSnack'
  | 'dinner'
  | 'eveningSnack';

export type MealEntry = {
  type: MealType;
  target: { food: string; calories: number };
  consumed: { food: string; calories: number };
  followed: boolean;
  reason?: string;
};

export type DailyMealTracking = {
  date: string; // "2025-01-31"
  meals: MealEntry[];
};

export type MockMealTrackingData = DailyMealTracking[];

export type TimeRange = 'day' | 'week' | 'month';

export type ProgressData = {
  date: string;
  targetCalories: number;
  consumedCalories: number;
  adherencePercentage: number;
};