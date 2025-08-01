import { MealPlan, MealProgress, DateStatus } from '../types';

export const mockMealPlan: MealPlan = {
  user_id: 'user-123',
  meal_data: [
    {
      meal_type: 'breakfast',
      name: 'Protein Oatmeal Bowl',
      ingredients: [
        { name: 'Rolled oats', quantity: '50g' },
        { name: 'Protein powder', quantity: '30g' },
        { name: 'Banana', quantity: '1 medium' },
        { name: 'Almond butter', quantity: '15g' },
      ],
      calories: 420,
      protein: 28,
      fat: 12,
      carbs: 52,
    },
    {
      meal_type: 'morning_snack',
      name: 'Greek Yogurt with Berries',
      ingredients: [
        { name: 'Greek yogurt', quantity: '150g' },
        { name: 'Mixed berries', quantity: '80g' },
        { name: 'Honey', quantity: '10g' },
      ],
      calories: 180,
      protein: 15,
      fat: 3,
      carbs: 22,
    },
    {
      meal_type: 'lunch',
      name: 'Grilled Chicken Salad',
      ingredients: [
        { name: 'Chicken breast', quantity: '150g' },
        { name: 'Mixed greens', quantity: '100g' },
        { name: 'Cherry tomatoes', quantity: '80g' },
        { name: 'Olive oil', quantity: '10ml' },
        { name: 'Quinoa', quantity: '60g' },
      ],
      calories: 520,
      protein: 42,
      fat: 18,
      carbs: 35,
    },
    {
      meal_type: 'afternoon_snack',
      name: 'Apple with Almonds',
      ingredients: [
        { name: 'Apple', quantity: '1 medium' },
        { name: 'Almonds', quantity: '20g' },
      ],
      calories: 200,
      protein: 6,
      fat: 12,
      carbs: 25,
    },
    {
      meal_type: 'dinner',
      name: 'Salmon with Sweet Potato',
      ingredients: [
        { name: 'Salmon fillet', quantity: '120g' },
        { name: 'Sweet potato', quantity: '150g' },
        { name: 'Broccoli', quantity: '100g' },
        { name: 'Olive oil', quantity: '8ml' },
      ],
      calories: 480,
      protein: 35,
      fat: 16,
      carbs: 42,
    },
    {
      meal_type: 'evening_snack',
      name: 'Cottage Cheese Bowl',
      ingredients: [
        { name: 'Cottage cheese', quantity: '100g' },
        { name: 'Cucumber', quantity: '50g' },
        { name: 'Cherry tomatoes', quantity: '30g' },
      ],
      calories: 120,
      protein: 14,
      fat: 2,
      carbs: 8,
    },
  ],
};

export const mockMealProgress: MealProgress[] = [
  // Today's tracking (partial)
  {
    date: '2025-01-27',
    meal_type: 'breakfast',
    followed_plan: true,
    consumed_calories: 420,
    consumed_protein: 28,
    consumed_carbs: 52,
    consumed_fat: 12,
    custom_ingredients: [
      { name: 'Rolled oats', quantity: '50g' },
      { name: 'Protein powder', quantity: '30g' },
      { name: 'Banana', quantity: '1 medium' },
      { name: 'Almond butter', quantity: '15g' },
    ],
  },
  {
    date: '2025-01-27',
    meal_type: 'morning_snack',
    followed_plan: false,
    consumed_calories: 250,
    consumed_protein: 8,
    consumed_carbs: 35,
    consumed_fat: 8,
    custom_ingredients: [
      { name: 'Chocolate muffin', quantity: '1 piece' },
      { name: 'Coffee', quantity: '1 cup' },
    ],
    note: 'Had a craving for something sweet',
  },
  {
    date: '2025-01-27',
    meal_type: 'lunch',
    followed_plan: true,
    consumed_calories: 520,
    consumed_protein: 42,
    consumed_carbs: 35,
    consumed_fat: 18,
    custom_ingredients: [
      { name: 'Chicken breast', quantity: '150g' },
      { name: 'Mixed greens', quantity: '100g' },
      { name: 'Cherry tomatoes', quantity: '80g' },
      { name: 'Olive oil', quantity: '10ml' },
      { name: 'Quinoa', quantity: '60g' },
    ],
  },
  
  // Yesterday's tracking (complete)
  {
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
      { name: 'Butter', quantity: '10g' },
    ],
    note: 'Ran out of oats, made eggs instead',
  },
  {
    date: '2025-01-26',
    meal_type: 'morning_snack',
    followed_plan: true,
    consumed_calories: 180,
    consumed_protein: 15,
    consumed_carbs: 22,
    consumed_fat: 3,
    custom_ingredients: [
      { name: 'Greek yogurt', quantity: '150g' },
      { name: 'Mixed berries', quantity: '80g' },
      { name: 'Honey', quantity: '10g' },
    ],
  },
  {
    date: '2025-01-26',
    meal_type: 'lunch',
    followed_plan: false,
    consumed_calories: 680,
    consumed_protein: 35,
    consumed_carbs: 55,
    consumed_fat: 28,
    custom_ingredients: [
      { name: 'Burger', quantity: '1 piece' },
      { name: 'French fries', quantity: '100g' },
      { name: 'Soda', quantity: '330ml' },
    ],
    note: 'Lunch meeting at restaurant',
  },
  {
    date: '2025-01-26',
    meal_type: 'afternoon_snack',
    followed_plan: true,
    consumed_calories: 200,
    consumed_protein: 6,
    consumed_carbs: 25,
    consumed_fat: 12,
    custom_ingredients: [
      { name: 'Apple', quantity: '1 medium' },
      { name: 'Almonds', quantity: '20g' },
    ],
  },
  {
    date: '2025-01-26',
    meal_type: 'dinner',
    followed_plan: true,
    consumed_calories: 480,
    consumed_protein: 35,
    consumed_carbs: 42,
    consumed_fat: 16,
    custom_ingredients: [
      { name: 'Salmon fillet', quantity: '120g' },
      { name: 'Sweet potato', quantity: '150g' },
      { name: 'Broccoli', quantity: '100g' },
      { name: 'Olive oil', quantity: '8ml' },
    ],
  },
  {
    date: '2025-01-26',
    meal_type: 'evening_snack',
    followed_plan: true,
    consumed_calories: 120,
    consumed_protein: 14,
    consumed_carbs: 8,
    consumed_fat: 2,
    custom_ingredients: [
      { name: 'Cottage cheese', quantity: '100g' },
      { name: 'Cucumber', quantity: '50g' },
      { name: 'Cherry tomatoes', quantity: '30g' },
    ],
  },

  // Day before yesterday (mixed results)
  {
    date: '2025-01-25',
    meal_type: 'breakfast',
    followed_plan: true,
    consumed_calories: 420,
    consumed_protein: 28,
    consumed_carbs: 52,
    consumed_fat: 12,
    custom_ingredients: [
      { name: 'Rolled oats', quantity: '50g' },
      { name: 'Protein powder', quantity: '30g' },
      { name: 'Banana', quantity: '1 medium' },
      { name: 'Almond butter', quantity: '15g' },
    ],
  },
  {
    date: '2025-01-25',
    meal_type: 'morning_snack',
    followed_plan: false,
    consumed_calories: 120,
    consumed_protein: 8,
    consumed_carbs: 15,
    consumed_fat: 2,
    custom_ingredients: [
      { name: 'Green tea', quantity: '1 cup' },
      { name: 'Rice cakes', quantity: '2 pieces' },
    ],
    note: 'Felt full from breakfast',
  },
  {
    date: '2025-01-25',
    meal_type: 'lunch',
    followed_plan: true,
    consumed_calories: 520,
    consumed_protein: 42,
    consumed_carbs: 35,
    consumed_fat: 18,
    custom_ingredients: [
      { name: 'Chicken breast', quantity: '150g' },
      { name: 'Mixed greens', quantity: '100g' },
      { name: 'Cherry tomatoes', quantity: '80g' },
      { name: 'Olive oil', quantity: '10ml' },
      { name: 'Quinoa', quantity: '60g' },
    ],
  },
  {
    date: '2025-01-25',
    meal_type: 'afternoon_snack',
    followed_plan: false,
    consumed_calories: 150,
    consumed_protein: 4,
    consumed_carbs: 20,
    consumed_fat: 8,
    custom_ingredients: [
      { name: 'Granola bar', quantity: '1 piece' },
    ],
    note: 'Grabbed something quick',
  },
  {
    date: '2025-01-25',
    meal_type: 'dinner',
    followed_plan: true,
    consumed_calories: 480,
    consumed_protein: 35,
    consumed_carbs: 42,
    consumed_fat: 16,
    custom_ingredients: [
      { name: 'Salmon fillet', quantity: '120g' },
      { name: 'Sweet potato', quantity: '150g' },
      { name: 'Broccoli', quantity: '100g' },
      { name: 'Olive oil', quantity: '8ml' },
    ],
  },
  {
    date: '2025-01-25',
    meal_type: 'evening_snack',
    followed_plan: true,
    consumed_calories: 120,
    consumed_protein: 14,
    consumed_carbs: 8,
    consumed_fat: 2,
    custom_ingredients: [
      { name: 'Cottage cheese', quantity: '100g' },
      { name: 'Cucumber', quantity: '50g' },
      { name: 'Cherry tomatoes', quantity: '30g' },
    ],
  },
];

export const mockDateStatuses: DateStatus[] = [
  {
    date: '2025-01-27',
    status: 'neutral', // Partial tracking, some overeating
    total_target: 1920,
    total_consumed: 1190, // Only 3 meals tracked so far
  },
  {
    date: '2025-01-26',
    status: 'failure', // Overeaten due to burger lunch
    total_target: 1920,
    total_consumed: 2040,
  },
  {
    date: '2025-01-25',
    status: 'neutral', // Undereaten due to light snack
    total_target: 1920,
    total_consumed: 1810,
  },
  {
    date: '2025-01-24',
    status: 'success', // Perfect adherence
    total_target: 1920,
    total_consumed: 1920,
  },
  {
    date: '2025-01-23',
    status: 'untracked', // No tracking data
    total_target: 1920,
    total_consumed: 0,
  },
  {
    date: '2025-01-22',
    status: 'failure', // Overeaten
    total_target: 1920,
    total_consumed: 2150,
  },
  {
    date: '2025-01-21',
    status: 'success', // Good adherence
    total_target: 1920,
    total_consumed: 1900,
  },
];

export const mealTypes = [
  'breakfast',
  'morning_snack', 
  'lunch',
  'afternoon_snack',
  'dinner',
  'evening_snack'
];

export const mealTypeLabels: Record<string, string> = {
  breakfast: 'Breakfast',
  morning_snack: 'Morning Snack',
  lunch: 'Lunch', 
  afternoon_snack: 'Afternoon Snack',
  dinner: 'Dinner',
  evening_snack: 'Evening Snack',
};