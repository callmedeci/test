import { MealProgress, PlannedMeal, DayStatus } from '../types';

// Mock planned meals for the week
export const mockPlannedMeals: PlannedMeal[] = [
  {
    id: 'planned-breakfast-1',
    meal_type: 'breakfast',
    name: 'Protein-Rich Oatmeal with Berries',
    ingredients: [
      { name: 'Rolled oats', quantity: '50g' },
      { name: 'Greek yogurt', quantity: '100g' },
      { name: 'Mixed berries', quantity: '80g' },
      { name: 'Almonds', quantity: '15g' },
    ],
    calories: 420,
    protein: 22,
    fat: 12,
    carbs: 58,
  },
  {
    id: 'planned-morning-snack-1',
    meal_type: 'morningSnack',
    name: 'Apple with Almond Butter',
    ingredients: [
      { name: 'Apple', quantity: '1 medium' },
      { name: 'Almond butter', quantity: '15g' },
    ],
    calories: 180,
    protein: 4,
    fat: 8,
    carbs: 28,
  },
  {
    id: 'planned-lunch-1',
    meal_type: 'lunch',
    name: 'Grilled Chicken with Quinoa Salad',
    ingredients: [
      { name: 'Chicken breast', quantity: '150g' },
      { name: 'Quinoa', quantity: '80g' },
      { name: 'Mixed vegetables', quantity: '100g' },
      { name: 'Olive oil', quantity: '10ml' },
    ],
    calories: 580,
    protein: 45,
    fat: 18,
    carbs: 42,
  },
  {
    id: 'planned-afternoon-snack-1',
    meal_type: 'afternoonSnack',
    name: 'Greek Yogurt with Nuts',
    ingredients: [
      { name: 'Greek yogurt', quantity: '150g' },
      { name: 'Walnuts', quantity: '20g' },
    ],
    calories: 220,
    protein: 18,
    fat: 14,
    carbs: 12,
  },
  {
    id: 'planned-dinner-1',
    meal_type: 'dinner',
    name: 'Salmon with Sweet Potato',
    ingredients: [
      { name: 'Salmon fillet', quantity: '120g' },
      { name: 'Sweet potato', quantity: '150g' },
      { name: 'Broccoli', quantity: '100g' },
      { name: 'Olive oil', quantity: '8ml' },
    ],
    calories: 520,
    protein: 35,
    fat: 20,
    carbs: 45,
  },
  {
    id: 'planned-evening-snack-1',
    meal_type: 'eveningSnack',
    name: 'Cottage Cheese with Cucumber',
    ingredients: [
      { name: 'Cottage cheese', quantity: '100g' },
      { name: 'Cucumber', quantity: '50g' },
    ],
    calories: 120,
    protein: 14,
    fat: 4,
    carbs: 6,
  },
];

// Mock meal progress data
export const mockMealProgress: MealProgress[] = [
  {
    id: 'progress-1',
    user_id: 'user-1',
    date: '2025-01-27',
    meal_type: 'breakfast',
    followed_plan: true,
    consumed_calories: 420,
    consumed_protein: 22,
    consumed_carbs: 58,
    consumed_fat: 12,
  },
  {
    id: 'progress-2',
    user_id: 'user-1',
    date: '2025-01-27',
    meal_type: 'lunch',
    followed_plan: false,
    consumed_calories: 650,
    consumed_protein: 40,
    consumed_carbs: 60,
    consumed_fat: 25,
    custom_ingredients: [
      { name: 'Chicken breast', quantity: '150g' },
      { name: 'Rice', quantity: '100g' },
      { name: 'Mixed vegetables', quantity: '100g' },
    ],
    note: "Didn't have quinoa so replaced it with rice.",
  },
  {
    id: 'progress-3',
    user_id: 'user-1',
    date: '2025-01-27',
    meal_type: 'afternoonSnack',
    followed_plan: true,
    consumed_calories: 220,
    consumed_protein: 18,
    consumed_carbs: 12,
    consumed_fat: 14,
  },
  {
    id: 'progress-4',
    user_id: 'user-1',
    date: '2025-01-26',
    meal_type: 'breakfast',
    followed_plan: false,
    consumed_calories: 380,
    consumed_protein: 20,
    consumed_carbs: 45,
    consumed_fat: 15,
    custom_ingredients: [
      { name: 'Scrambled eggs', quantity: '2 eggs' },
      { name: 'Toast', quantity: '2 slices' },
      { name: 'Avocado', quantity: '50g' },
    ],
    note: 'Felt like having eggs instead of oatmeal.',
  },
  {
    id: 'progress-5',
    user_id: 'user-1',
    date: '2025-01-26',
    meal_type: 'lunch',
    followed_plan: true,
    consumed_calories: 580,
    consumed_protein: 45,
    consumed_carbs: 42,
    consumed_fat: 18,
  },
  {
    id: 'progress-6',
    user_id: 'user-1',
    date: '2025-01-26',
    meal_type: 'dinner',
    followed_plan: false,
    consumed_calories: 480,
    consumed_protein: 30,
    consumed_carbs: 35,
    consumed_fat: 22,
    custom_ingredients: [
      { name: 'Grilled chicken', quantity: '120g' },
      { name: 'Quinoa', quantity: '60g' },
      { name: 'Green salad', quantity: '100g' },
    ],
    note: 'Smaller portion than planned.',
  },
];

// Generate day status based on meal progress
export function generateDayStatus(date: string): DayStatus {
  const dayProgress = mockMealProgress.filter(p => p.date === date);
  const dayPlanned = mockPlannedMeals;
  
  if (dayProgress.length === 0) {
    return {
      date,
      status: 'no-data',
      consumed_calories: 0,
      target_calories: dayPlanned.reduce((sum, meal) => sum + meal.calories, 0),
    };
  }
  
  const consumed = dayProgress.reduce((sum, p) => sum + p.consumed_calories, 0);
  const target = dayPlanned.reduce((sum, meal) => sum + meal.calories, 0);
  
  let status: DayStatus['status'];
  if (consumed >= target * 0.95 && consumed <= target * 1.05) {
    status = 'success';
  } else if (consumed > target * 1.05) {
    status = 'failure';
  } else {
    status = 'undereaten';
  }
  
  return {
    date,
    status,
    consumed_calories: consumed,
    target_calories: target,
  };
}

// Generate mock data for the last 30 days
export function generateMockDayStatuses(): DayStatus[] {
  const statuses: DayStatus[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    statuses.push(generateDayStatus(dateString));
  }
  
  return statuses.reverse();
}