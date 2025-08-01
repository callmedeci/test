import { MealProgress, PlannedMeal, ChartData, MealType } from '../types';

export function getMealProgressForDate(
  progress: MealProgress[],
  date: string
): MealProgress[] {
  return progress.filter(p => p.date === date);
}

export function getPlannedMealByType(
  plannedMeals: PlannedMeal[],
  mealType: MealType
): PlannedMeal | undefined {
  return plannedMeals.find(meal => meal.meal_type === mealType);
}

export function getMealProgressByType(
  progress: MealProgress[],
  mealType: MealType
): MealProgress | undefined {
  return progress.find(p => p.meal_type === mealType);
}

export function generateChartData(
  plannedMeals: PlannedMeal[],
  progress: MealProgress[]
): ChartData[] {
  const mealTypes: MealType[] = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner', 'eveningSnack'];
  
  return mealTypes.map(mealType => {
    const planned = getPlannedMealByType(plannedMeals, mealType);
    const tracked = getMealProgressByType(progress, mealType);
    
    return {
      meal_type: formatMealTypeName(mealType),
      consumed_calories: tracked?.consumed_calories || 0,
      target_calories: planned?.calories || 0,
    };
  });
}

export function calculateDayTotals(
  plannedMeals: PlannedMeal[],
  progress: MealProgress[]
) {
  const totalTarget = plannedMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalConsumed = progress.reduce((sum, p) => sum + p.consumed_calories, 0);
  
  return {
    totalTarget,
    totalConsumed,
    difference: totalConsumed - totalTarget,
    percentage: totalTarget > 0 ? Math.round((totalConsumed / totalTarget) * 100) : 0,
  };
}

export function formatMealTypeName(mealType: MealType): string {
  const names = {
    breakfast: 'Breakfast',
    morningSnack: 'Morning Snack',
    lunch: 'Lunch',
    afternoonSnack: 'Afternoon Snack',
    dinner: 'Dinner',
    eveningSnack: 'Evening Snack',
  };
  return names[mealType];
}

export function getMealIcon(mealType: MealType): string {
  const icons = {
    breakfast: '🌅',
    morningSnack: '🍎',
    lunch: '🍽️',
    afternoonSnack: '🥨',
    dinner: '🍖',
    eveningSnack: '🥛',
  };
  return icons[mealType];
}

export function getStatusColor(status: 'success' | 'failure' | 'undereaten' | 'no-data'): string {
  switch (status) {
    case 'success':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'failure':
      return 'text-destructive bg-destructive/10 border-destructive/20';
    case 'undereaten':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'no-data':
    default:
      return 'text-muted-foreground bg-muted border-border';
  }
}

export function isToday(date: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return date === today;
}

export function isFutureDate(date: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return date > today;
}

export function formatDateDisplay(date: string): string {
  const dateObj = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date === today.toISOString().split('T')[0]) {
    return 'Today';
  } else if (date === yesterday.toISOString().split('T')[0]) {
    return 'Yesterday';
  } else {
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }
}