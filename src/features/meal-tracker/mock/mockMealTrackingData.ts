import { MockMealTrackingData } from '../types';

export const mockMealTrackingData: MockMealTrackingData = [
  {
    date: '2025-01-31',
    meals: [
      {
        type: 'breakfast',
        target: { food: 'Protein-Rich Oatmeal with Berries and Almonds', calories: 450 },
        consumed: { food: 'Protein-Rich Oatmeal with Berries and Almonds', calories: 450 },
        followed: true,
      },
      {
        type: 'morningSnack',
        target: { food: 'Greek Yogurt with Honey and Walnuts', calories: 200 },
        consumed: { food: 'Apple and Peanut Butter', calories: 180 },
        followed: false,
        reason: 'Ran out of Greek yogurt, had apple instead',
      },
      {
        type: 'lunch',
        target: { food: 'Grilled Salmon with Quinoa and Roasted Vegetables', calories: 600 },
        consumed: { food: 'Grilled Salmon with Quinoa and Roasted Vegetables', calories: 600 },
        followed: true,
      },
      {
        type: 'afternoonSnack',
        target: { food: 'Apple Slices with Almond Butter', calories: 150 },
        consumed: { food: 'Protein Bar', calories: 220 },
        followed: false,
        reason: 'Grabbed a protein bar on the go',
      },
      {
        type: 'dinner',
        target: { food: 'Lean Beef Stir-fry with Brown Rice', calories: 500 },
        consumed: { food: 'Lean Beef Stir-fry with Brown Rice', calories: 500 },
        followed: true,
      },
      {
        type: 'eveningSnack',
        target: { food: 'Cottage Cheese with Cucumber Slices', calories: 100 },
        consumed: { food: 'Cottage Cheese with Cucumber Slices', calories: 100 },
        followed: true,
      },
    ],
  },
  {
    date: '2025-01-30',
    meals: [
      {
        type: 'breakfast',
        target: { food: 'Scrambled Eggs with Spinach and Whole Grain Toast', calories: 420 },
        consumed: { food: 'Scrambled Eggs with Spinach and Whole Grain Toast', calories: 420 },
        followed: true,
      },
      {
        type: 'morningSnack',
        target: { food: 'Mixed Nuts and Dried Fruit', calories: 180 },
        consumed: { food: 'Coffee only', calories: 5 },
        followed: false,
        reason: 'Skipped snack, not hungry',
      },
      {
        type: 'lunch',
        target: { food: 'Chicken Caesar Salad with Croutons', calories: 550 },
        consumed: { food: 'Chicken Caesar Salad with Croutons', calories: 550 },
        followed: true,
      },
      {
        type: 'afternoonSnack',
        target: { food: 'Banana with Peanut Butter', calories: 200 },
        consumed: { food: 'Banana with Peanut Butter', calories: 200 },
        followed: true,
      },
      {
        type: 'dinner',
        target: { food: 'Baked Chicken Breast with Sweet Potato', calories: 480 },
        consumed: { food: 'Pizza (2 slices)', calories: 640 },
        followed: false,
        reason: 'Ordered pizza with friends',
      },
      {
        type: 'eveningSnack',
        target: { food: 'Herbal Tea with Honey', calories: 50 },
        consumed: { food: 'Ice cream', calories: 250 },
        followed: false,
        reason: 'Craved something sweet',
      },
    ],
  },
  {
    date: '2025-01-29',
    meals: [
      {
        type: 'breakfast',
        target: { food: 'Smoothie Bowl with Protein Powder and Fruits', calories: 380 },
        consumed: { food: 'Smoothie Bowl with Protein Powder and Fruits', calories: 380 },
        followed: true,
      },
      {
        type: 'morningSnack',
        target: { food: 'Whole Grain Crackers with Hummus', calories: 160 },
        consumed: { food: 'Whole Grain Crackers with Hummus', calories: 160 },
        followed: true,
      },
      {
        type: 'lunch',
        target: { food: 'Turkey and Avocado Wrap with Side Salad', calories: 520 },
        consumed: { food: 'Turkey and Avocado Wrap with Side Salad', calories: 520 },
        followed: true,
      },
      {
        type: 'afternoonSnack',
        target: { food: 'Protein Smoothie with Berries', calories: 180 },
        consumed: { food: 'Protein Smoothie with Berries', calories: 180 },
        followed: true,
      },
      {
        type: 'dinner',
        target: { food: 'Grilled Fish with Steamed Broccoli and Rice', calories: 460 },
        consumed: { food: 'Grilled Fish with Steamed Broccoli and Rice', calories: 460 },
        followed: true,
      },
      {
        type: 'eveningSnack',
        target: { food: 'Chamomile Tea', calories: 0 },
        consumed: { food: 'Chamomile Tea', calories: 0 },
        followed: true,
      },
    ],
  },
  {
    date: '2025-01-28',
    meals: [
      {
        type: 'breakfast',
        target: { food: 'Avocado Toast with Poached Egg', calories: 400 },
        consumed: { food: 'Cereal with Milk', calories: 320 },
        followed: false,
        reason: 'Ran out of avocados, had cereal instead',
      },
      {
        type: 'morningSnack',
        target: { food: 'Trail Mix', calories: 170 },
        consumed: { food: 'Trail Mix', calories: 170 },
        followed: true,
      },
      {
        type: 'lunch',
        target: { food: 'Quinoa Buddha Bowl with Chickpeas', calories: 580 },
        consumed: { food: 'Sandwich and Chips', calories: 650 },
        followed: false,
        reason: 'Ate out with colleagues',
      },
      {
        type: 'afternoonSnack',
        target: { food: 'Carrot Sticks with Hummus', calories: 120 },
        consumed: { food: 'Carrot Sticks with Hummus', calories: 120 },
        followed: true,
      },
      {
        type: 'dinner',
        target: { food: 'Lemon Herb Chicken with Asparagus', calories: 440 },
        consumed: { food: 'Lemon Herb Chicken with Asparagus', calories: 440 },
        followed: true,
      },
      {
        type: 'eveningSnack',
        target: { food: 'Dark Chocolate Square', calories: 80 },
        consumed: { food: 'Dark Chocolate Square', calories: 80 },
        followed: true,
      },
    ],
  },
  {
    date: '2025-01-27',
    meals: [
      {
        type: 'breakfast',
        target: { food: 'Chia Pudding with Mango and Coconut', calories: 350 },
        consumed: { food: 'Chia Pudding with Mango and Coconut', calories: 350 },
        followed: true,
      },
      {
        type: 'morningSnack',
        target: { food: 'Green Tea and Almonds', calories: 140 },
        consumed: { food: 'Coffee and Donut', calories: 280 },
        followed: false,
        reason: 'Office meeting had donuts',
      },
      {
        type: 'lunch',
        target: { food: 'Mediterranean Chickpea Salad', calories: 490 },
        consumed: { food: 'Mediterranean Chickpea Salad', calories: 490 },
        followed: true,
      },
      {
        type: 'afternoonSnack',
        target: { food: 'Protein Bar', calories: 190 },
        consumed: { food: 'Skipped', calories: 0 },
        followed: false,
        reason: 'Too busy, forgot to eat',
      },
      {
        type: 'dinner',
        target: { food: 'Vegetable Curry with Brown Rice', calories: 520 },
        consumed: { food: 'Vegetable Curry with Brown Rice', calories: 520 },
        followed: true,
      },
      {
        type: 'eveningSnack',
        target: { food: 'Herbal Tea with Honey', calories: 60 },
        consumed: { food: 'Herbal Tea with Honey', calories: 60 },
        followed: true,
      },
    ],
  },
];

export const getMealTrackingForDate = (date: string) => {
  return mockMealTrackingData.find(day => day.date === date);
};

export const getAllMealTrackingData = () => {
  return mockMealTrackingData;
};