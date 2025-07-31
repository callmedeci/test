import { TrackedMeal, DayMealPlan, MealType } from '../types';

export const mockPlannedMeals: DayMealPlan[] = [
  {
    day_of_week: 'Monday',
    meals: [
      {
        name: 'Breakfast',
        custom_name: 'Protein Oatmeal Bowl',
        ingredients: [
          { name: 'Oats', quantity: 50, unit: 'g', calories: 190, protein: 6.5, carbs: 32, fat: 3.5 },
          { name: 'Greek Yogurt', quantity: 100, unit: 'g', calories: 100, protein: 10, carbs: 6, fat: 0 },
          { name: 'Blueberries', quantity: 80, unit: 'g', calories: 45, protein: 0.6, carbs: 11, fat: 0.2 }
        ],
        total_calories: 335,
        total_protein: 17.1,
        total_carbs: 49,
        total_fat: 3.7
      },
      {
        name: 'Morning Snack',
        custom_name: 'Apple with Almond Butter',
        ingredients: [
          { name: 'Apple', quantity: 150, unit: 'g', calories: 78, protein: 0.4, carbs: 21, fat: 0.2 },
          { name: 'Almond Butter', quantity: 15, unit: 'g', calories: 89, protein: 3.3, carbs: 3.2, fat: 8.2 }
        ],
        total_calories: 167,
        total_protein: 3.7,
        total_carbs: 24.2,
        total_fat: 8.4
      },
      {
        name: 'Lunch',
        custom_name: 'Grilled Chicken Salad',
        ingredients: [
          { name: 'Chicken Breast', quantity: 120, unit: 'g', calories: 198, protein: 37, carbs: 0, fat: 4.3 },
          { name: 'Mixed Greens', quantity: 100, unit: 'g', calories: 20, protein: 2.2, carbs: 3.6, fat: 0.3 },
          { name: 'Cherry Tomatoes', quantity: 100, unit: 'g', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 }
        ],
        total_calories: 236,
        total_protein: 40.1,
        total_carbs: 7.5,
        total_fat: 4.8
      },
      {
        name: 'Afternoon Snack',
        custom_name: 'Protein Smoothie',
        ingredients: [
          { name: 'Protein Powder', quantity: 30, unit: 'g', calories: 120, protein: 25, carbs: 2, fat: 1 },
          { name: 'Banana', quantity: 100, unit: 'g', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 }
        ],
        total_calories: 209,
        total_protein: 26.1,
        total_carbs: 25,
        total_fat: 1.3
      },
      {
        name: 'Dinner',
        custom_name: 'Salmon with Quinoa',
        ingredients: [
          { name: 'Salmon Fillet', quantity: 150, unit: 'g', calories: 231, protein: 31, carbs: 0, fat: 11 },
          { name: 'Quinoa', quantity: 80, unit: 'g', calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
          { name: 'Broccoli', quantity: 100, unit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 }
        ],
        total_calories: 385,
        total_protein: 38.2,
        total_carbs: 29,
        total_fat: 13.3
      },
      {
        name: 'Evening Snack',
        custom_name: 'Greek Yogurt with Nuts',
        ingredients: [
          { name: 'Greek Yogurt', quantity: 100, unit: 'g', calories: 100, protein: 10, carbs: 6, fat: 0 },
          { name: 'Almonds', quantity: 15, unit: 'g', calories: 87, protein: 3.2, carbs: 3.3, fat: 7.5 }
        ],
        total_calories: 187,
        total_protein: 13.2,
        total_carbs: 9.3,
        total_fat: 7.5
      }
    ]
  }
];

export const mockTrackedMeals: TrackedMeal[] = [
  {
    id: 'track_001',
    date: '2025-01-27',
    mealType: 'Breakfast',
    followed: true
  },
  {
    id: 'track_002',
    date: '2025-01-27',
    mealType: 'Morning Snack',
    followed: false,
    consumedMeal: 'Coffee and Donut',
    quantity: '1 donut, 1 large coffee',
    calories: 350,
    notes: 'Had a meeting, grabbed something quick'
  },
  {
    id: 'track_003',
    date: '2025-01-27',
    mealType: 'Lunch',
    followed: true
  },
  {
    id: 'track_004',
    date: '2025-01-27',
    mealType: 'Afternoon Snack',
    followed: false,
    consumedMeal: 'Protein Bar',
    quantity: '1 bar',
    calories: 200,
    notes: 'Forgot to prepare smoothie'
  },
  {
    id: 'track_005',
    date: '2025-01-26',
    mealType: 'Breakfast',
    followed: true
  },
  {
    id: 'track_006',
    date: '2025-01-26',
    mealType: 'Lunch',
    followed: false,
    consumedMeal: 'Pizza Slice',
    quantity: '2 slices',
    calories: 560,
    notes: 'Team lunch at office'
  }
];

export const getMealTypeOrder = (): MealType[] => [
  'Breakfast',
  'Morning Snack', 
  'Lunch',
  'Afternoon Snack',
  'Dinner',
  'Evening Snack'
];

export const getPlannedMealForType = (mealType: MealType) => {
  return mockPlannedMeals[0].meals.find(meal => meal.name === mealType);
};

export const getTrackedMealsForDate = (date: string): TrackedMeal[] => {
  return mockTrackedMeals.filter(meal => meal.date === date);
};

export const getTrackedMealForDateAndType = (date: string, mealType: MealType): TrackedMeal | undefined => {
  return mockTrackedMeals.find(meal => meal.date === date && meal.mealType === mealType);
};