import { DailyMealTracking, MealEntry, ProgressData, TimeRange } from '../types';

export const formatMealTypeName = (mealType: string): string => {
  const mealNames: Record<string, string> = {
    breakfast: 'Breakfast',
    morningSnack: 'Morning Snack',
    lunch: 'Lunch',
    afternoonSnack: 'Afternoon Snack',
    dinner: 'Dinner',
    eveningSnack: 'Evening Snack',
  };
  return mealNames[mealType] || mealType;
};

export const calculateDayTotals = (meals: MealEntry[]) => {
  const targetTotal = meals.reduce((sum, meal) => sum + meal.target.calories, 0);
  const consumedTotal = meals.reduce((sum, meal) => sum + meal.consumed.calories, 0);
  const followedCount = meals.filter(meal => meal.followed).length;
  const adherencePercentage = Math.round((followedCount / meals.length) * 100);
  
  return {
    targetTotal,
    consumedTotal,
    adherencePercentage,
    followedCount,
    totalMeals: meals.length,
  };
};

export const generateProgressData = (
  trackingData: DailyMealTracking[],
  timeRange: TimeRange
): ProgressData[] => {
  const now = new Date();
  let startDate: Date;
  
  switch (timeRange) {
    case 'day':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
      break;
    case 'week':
      startDate = new Date(now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000); // Last 4 weeks
      break;
    case 'month':
      startDate = new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000); // Last 3 months
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  
  return trackingData
    .filter(day => new Date(day.date) >= startDate)
    .map(day => {
      const totals = calculateDayTotals(day.meals);
      return {
        date: day.date,
        targetCalories: totals.targetTotal,
        consumedCalories: totals.consumedTotal,
        adherencePercentage: totals.adherencePercentage,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculateOverallAdherence = (trackingData: DailyMealTracking[]): number => {
  const totalMeals = trackingData.reduce((sum, day) => sum + day.meals.length, 0);
  const followedMeals = trackingData.reduce(
    (sum, day) => sum + day.meals.filter(meal => meal.followed).length,
    0
  );
  
  return totalMeals > 0 ? Math.round((followedMeals / totalMeals) * 100) : 0;
};

export const getMostSkippedMealTypes = (trackingData: DailyMealTracking[]) => {
  const mealTypeSkips: Record<string, number> = {};
  
  trackingData.forEach(day => {
    day.meals.forEach(meal => {
      if (!meal.followed) {
        mealTypeSkips[meal.type] = (mealTypeSkips[meal.type] || 0) + 1;
      }
    });
  });
  
  return Object.entries(mealTypeSkips)
    .map(([type, skips]) => ({ type, skips }))
    .sort((a, b) => b.skips - a.skips);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  return date > today;
};