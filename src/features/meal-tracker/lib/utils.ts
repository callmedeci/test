import { format } from 'date-fns';
import { TrackedMeal, MealType, CalorieSummary, MealTrackingStatus } from '../types';
import { getMealTypeOrder, getPlannedMealForType } from './mockData';

export const formatMealDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const calculateDayCalorieSummary = (
  date: string, 
  trackedMeals: TrackedMeal[]
): CalorieSummary => {
  let plannedCalories = 0;
  let consumedCalories = 0;

  const dayTrackedMeals = trackedMeals.filter(meal => meal.date === date);

  getMealTypeOrder().forEach(mealType => {
    const plannedMeal = getPlannedMealForType(mealType);
    const trackedMeal = dayTrackedMeals.find(meal => meal.mealType === mealType);

    if (plannedMeal?.total_calories) {
      plannedCalories += plannedMeal.total_calories;
    }

    if (trackedMeal) {
      if (trackedMeal.followed && plannedMeal?.total_calories) {
        consumedCalories += plannedMeal.total_calories;
      } else if (!trackedMeal.followed && trackedMeal.calories) {
        consumedCalories += trackedMeal.calories;
      }
    }
  });

  const difference = consumedCalories - plannedCalories;
  const percentage = plannedCalories > 0 ? (consumedCalories / plannedCalories) * 100 : 0;

  return {
    planned: plannedCalories,
    consumed: consumedCalories,
    difference,
    percentage
  };
};

export const calculateDayTrackingStatus = (
  date: string, 
  trackedMeals: TrackedMeal[]
): MealTrackingStatus => {
  const dayTrackedMeals = trackedMeals.filter(meal => meal.date === date);
  const totalMeals = dayTrackedMeals.length;
  const followedMeals = dayTrackedMeals.filter(meal => meal.followed).length;
  
  const percentage = totalMeals > 0 ? (followedMeals / totalMeals) * 100 : 0;

  return {
    totalMeals,
    followedMeals,
    percentage
  };
};

export const getMealTypeDisplayName = (mealType: MealType): string => {
  return mealType;
};

export const isMealTrackingAllowed = (date: Date): boolean => {
  const today = new Date();
  return date <= today;
};