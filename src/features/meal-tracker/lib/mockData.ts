import { DayMealData, PlannedMeal, TrackedMeal } from '../types';

// Mock planned meals for the week
export const mockPlannedMeals: PlannedMeal[] = [
  {
    id: 'planned_1',
    mealType: 'Breakfast',
    name: 'Protein Oatmeal with Berries',
    calories: 450,
    protein: 25,
    carbs: 55,
    fat: 12,
    ingredients: ['Oats', 'Greek Yogurt', 'Blueberries', 'Almonds'],
  },
  {
    id: 'planned_2',
    mealType: 'Morning Snack',
    name: 'Apple with Almond Butter',
    calories: 200,
    protein: 8,
    carbs: 25,
    fat: 12,
    ingredients: ['Apple', 'Almond Butter'],
  },
  {
    id: 'planned_3',
    mealType: 'Lunch',
    name: 'Grilled Chicken Salad',
    calories: 550,
    protein: 45,
    carbs: 30,
    fat: 25,
    ingredients: ['Chicken Breast', 'Mixed Greens', 'Quinoa', 'Olive Oil'],
  },
  {
    id: 'planned_4',
    mealType: 'Afternoon Snack',
    name: 'Greek Yogurt with Nuts',
    calories: 180,
    protein: 15,
    carbs: 12,
    fat: 8,
    ingredients: ['Greek Yogurt', 'Walnuts'],
  },
  {
    id: 'planned_5',
    mealType: 'Dinner',
    name: 'Salmon with Sweet Potato',
    calories: 480,
    protein: 35,
    carbs: 40,
    fat: 18,
    ingredients: ['Salmon Fillet', 'Sweet Potato', 'Broccoli'],
  },
  {
    id: 'planned_6',
    mealType: 'Evening Snack',
    name: 'Cottage Cheese Bowl',
    calories: 140,
    protein: 20,
    carbs: 8,
    fat: 4,
    ingredients: ['Cottage Cheese', 'Cucumber'],
  },
];

// Mock tracked meals for today
export const mockTrackedMeals: TrackedMeal[] = [
  {
    id: 'tracked_1',
    date: new Date().toISOString().split('T')[0],
    mealType: 'Breakfast',
    followed: true,
  },
  {
    id: 'tracked_2',
    date: new Date().toISOString().split('T')[0],
    mealType: 'Morning Snack',
    followed: false,
    consumedMeal: 'Banana and Peanut Butter',
    quantity: '1 medium banana + 2 tbsp',
    calories: 280,
    notes: 'Was craving something different',
  },
  {
    id: 'tracked_3',
    date: new Date().toISOString().split('T')[0],
    mealType: 'Lunch',
    followed: true,
  },
];

// Generate mock data for the past week
export function generateMockWeekData(): DayMealData[] {
  const weekData: DayMealData[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Generate some random tracking data for past days
    const trackedMeals: TrackedMeal[] = [];
    const followedCount = Math.floor(Math.random() * 4) + 2; // 2-5 meals followed
    
    for (let j = 0; j < followedCount; j++) {
      const mealType = mockPlannedMeals[j].mealType;
      const followed = Math.random() > 0.3; // 70% chance of following
      
      trackedMeals.push({
        id: `tracked_${dateString}_${j}`,
        date: dateString,
        mealType,
        followed,
        ...(followed ? {} : {
          consumedMeal: `Alternative ${mealType}`,
          quantity: '1 serving',
          calories: mockPlannedMeals[j].calories + Math.floor(Math.random() * 100) - 50,
          notes: 'Had something different',
        }),
      });
    }
    
    weekData.push({
      date: dateString,
      plannedMeals: mockPlannedMeals,
      trackedMeals: i === 0 ? mockTrackedMeals : trackedMeals, // Use detailed mock for today
    });
  }
  
  return weekData;
}

export const mockWeekData = generateMockWeekData();

// Helper function to get data for a specific date
export function getMockDataForDate(date: string): DayMealData {
  const existing = mockWeekData.find(d => d.date === date);
  if (existing) return existing;
  
  // Return empty data for future dates or missing dates
  return {
    date,
    plannedMeals: mockPlannedMeals,
    trackedMeals: [],
  };
}

// Helper function to calculate stats
export function calculateMealStats(dayData: DayMealData) {
  const totalPlannedCalories = dayData.plannedMeals.reduce((sum, meal) => sum + meal.calories, 0);
  
  let totalConsumedCalories = 0;
  let mealsFollowed = 0;
  
  dayData.trackedMeals.forEach(tracked => {
    if (tracked.followed) {
      mealsFollowed++;
      const plannedMeal = dayData.plannedMeals.find(p => p.mealType === tracked.mealType);
      totalConsumedCalories += plannedMeal?.calories || 0;
    } else {
      totalConsumedCalories += tracked.calories || 0;
    }
  });
  
  const totalMeals = dayData.plannedMeals.length;
  const caloriesDifference = totalConsumedCalories - totalPlannedCalories;
  const adherencePercentage = totalMeals > 0 ? (mealsFollowed / totalMeals) * 100 : 0;
  
  return {
    totalPlannedCalories,
    totalConsumedCalories,
    mealsFollowed,
    totalMeals,
    caloriesDifference,
    adherencePercentage,
  };
}