import { MealProgress, MealPlanEntry, DailyMealData, ChartData, WeeklySummary, DateStatus } from '../types';
import { mockMealPlan, mockMealProgress, mealTypes } from './mockData';

export function getMealDataForDate(date: string): DailyMealData[] {
  const progressForDate = mockMealProgress.filter(p => p.date === date);
  
  return mealTypes.map(mealType => {
    const planned = mockMealPlan.meal_data.find(m => m.meal_type === mealType);
    const tracked = progressForDate.find(p => p.meal_type === mealType);
    
    let status: 'success' | 'failure' | 'neutral' | 'untracked' = 'untracked';
    
    if (tracked) {
      const targetCalories = planned?.calories || 0;
      const consumedCalories = tracked.consumed_calories;
      
      if (Math.abs(consumedCalories - targetCalories) <= 20) {
        status = 'success'; // Within 20 calories = success
      } else if (consumedCalories > targetCalories) {
        status = 'failure'; // Overeaten
      } else {
        status = 'neutral'; // Undereaten
      }
    }
    
    return {
      meal_type: mealType,
      planned: planned!,
      tracked,
      status,
    };
  });
}

export function getChartDataForDate(date: string): ChartData[] {
  const mealData = getMealDataForDate(date);
  
  return mealData.map(meal => ({
    meal_type: meal.meal_type,
    target_calories: meal.planned.calories,
    consumed_calories: meal.tracked?.consumed_calories || 0,
  }));
}

export function getWeeklySummaryForDate(date: string): WeeklySummary {
  const mealData = getMealDataForDate(date);
  
  const totalTarget = mealData.reduce((sum, meal) => sum + meal.planned.calories, 0);
  const totalConsumed = mealData.reduce((sum, meal) => sum + (meal.tracked?.consumed_calories || 0), 0);
  const mealsFollowed = mealData.filter(meal => meal.tracked?.followed_plan).length;
  const totalMeals = mealData.filter(meal => meal.tracked).length;
  
  return {
    total_target_calories: totalTarget,
    total_consumed_calories: totalConsumed,
    meals_followed: mealsFollowed,
    total_meals: totalMeals,
    adherence_percentage: totalMeals > 0 ? Math.round((mealsFollowed / totalMeals) * 100) : 0,
  };
}

export function getDateStatus(date: string): DateStatus['status'] {
  const summary = getWeeklySummaryForDate(date);
  
  if (summary.total_meals === 0) return 'untracked';
  
  const calorieDiff = Math.abs(summary.total_consumed_calories - summary.total_target_calories);
  
  if (calorieDiff <= 50) return 'success';
  if (summary.total_consumed_calories > summary.total_target_calories) return 'failure';
  return 'neutral';
}

export function canEditDate(date: string): boolean {
  const today = new Date();
  const selectedDate = new Date(date);
  
  // Can only edit today or past dates
  return selectedDate <= today;
}

export function formatMealType(mealType: string): string {
  return mealType.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}