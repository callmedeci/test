import { WeeklyTracking, WeekOption } from '../types';

// Helper function to get week dates
function getWeekDates(weeksAgo: number = 0) {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + 1 - (weeksAgo * 7));
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}

// Generate week options
export function getAvailableWeeks(): WeekOption[] {
  const weeks: WeekOption[] = [];
  
  for (let i = 0; i < 8; i++) {
    const { start, end } = getWeekDates(i);
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    
    weeks.push({
      value: `${start}_${end}`,
      label: i === 0 ? 'This Week' : i === 1 ? 'Last Week' : `${i} Weeks Ago`,
      week_start: start,
      week_end: end,
      is_current: i === 0,
      is_future: startDate > today,
    });
  }
  
  return weeks;
}

// Mock weekly tracking data
export const mockWeeklyTracking: WeeklyTracking[] = [
  // This week (current)
  {
    week_start: getWeekDates(0).start,
    week_end: getWeekDates(0).end,
    week_label: 'This Week',
    days: [
      {
        date: getWeekDates(0).start,
        day_of_week: 'Monday',
        meals: [
          {
            id: 'mon_breakfast',
            meal_type: 'Breakfast',
            planned_meal: 'Protein Oatmeal with Berries',
            planned_calories: 350,
            followed_plan: true,
            actual_meal: 'Protein Oatmeal with Berries',
            actual_quantity: '1 bowl',
            actual_calories: 350,
          },
          {
            id: 'mon_morning_snack',
            meal_type: 'Morning Snack',
            planned_meal: 'Greek Yogurt with Almonds',
            planned_calories: 180,
            followed_plan: false,
            actual_meal: 'Chocolate Bar',
            actual_quantity: '1 bar',
            actual_calories: 250,
            notes: 'Had a craving, will do better tomorrow',
          },
          {
            id: 'mon_lunch',
            meal_type: 'Lunch',
            planned_meal: 'Grilled Chicken Salad',
            planned_calories: 420,
            followed_plan: true,
            actual_meal: 'Grilled Chicken Salad',
            actual_quantity: '1 large bowl',
            actual_calories: 420,
          },
          {
            id: 'mon_afternoon_snack',
            meal_type: 'Afternoon Snack',
            planned_meal: 'Apple with Peanut Butter',
            planned_calories: 200,
            followed_plan: true,
            actual_meal: 'Apple with Peanut Butter',
            actual_quantity: '1 apple + 2 tbsp',
            actual_calories: 200,
          },
          {
            id: 'mon_dinner',
            meal_type: 'Dinner',
            planned_meal: 'Salmon with Quinoa',
            planned_calories: 480,
            followed_plan: false,
            actual_meal: 'Pizza',
            actual_quantity: '3 slices',
            actual_calories: 720,
            notes: 'Ordered takeout with friends',
          },
          {
            id: 'mon_evening_snack',
            meal_type: 'Evening Snack',
            planned_meal: 'Cottage Cheese',
            planned_calories: 120,
            followed_plan: true,
            actual_meal: 'Cottage Cheese',
            actual_quantity: '1/2 cup',
            actual_calories: 120,
          },
        ],
        total_planned_calories: 1750,
        total_actual_calories: 2060,
        meals_followed: 4,
        total_meals: 6,
      },
      {
        date: new Date(new Date(getWeekDates(0).start).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        day_of_week: 'Tuesday',
        meals: [
          {
            id: 'tue_breakfast',
            meal_type: 'Breakfast',
            planned_meal: 'Scrambled Eggs with Toast',
            planned_calories: 320,
            followed_plan: true,
            actual_meal: 'Scrambled Eggs with Toast',
            actual_quantity: '2 eggs + 1 slice',
            actual_calories: 320,
          },
          {
            id: 'tue_morning_snack',
            meal_type: 'Morning Snack',
            planned_meal: 'Banana',
            planned_calories: 100,
            followed_plan: true,
            actual_meal: 'Banana',
            actual_quantity: '1 medium',
            actual_calories: 100,
          },
          {
            id: 'tue_lunch',
            meal_type: 'Lunch',
            planned_meal: 'Turkey Sandwich',
            planned_calories: 380,
            followed_plan: false,
            actual_meal: 'Burger and Fries',
            actual_quantity: '1 burger + small fries',
            actual_calories: 650,
            notes: 'Lunch meeting at restaurant',
          },
          {
            id: 'tue_afternoon_snack',
            meal_type: 'Afternoon Snack',
            planned_meal: 'Mixed Nuts',
            planned_calories: 160,
            followed_plan: true,
            actual_meal: 'Mixed Nuts',
            actual_quantity: '1 oz',
            actual_calories: 160,
          },
          {
            id: 'tue_dinner',
            meal_type: 'Dinner',
            planned_meal: 'Chicken Stir-fry',
            planned_calories: 450,
            followed_plan: true,
            actual_meal: 'Chicken Stir-fry',
            actual_quantity: '1 serving',
            actual_calories: 450,
          },
          {
            id: 'tue_evening_snack',
            meal_type: 'Evening Snack',
            planned_meal: 'Herbal Tea',
            planned_calories: 0,
            followed_plan: true,
            actual_meal: 'Herbal Tea',
            actual_quantity: '1 cup',
            actual_calories: 0,
          },
        ],
        total_planned_calories: 1410,
        total_actual_calories: 1680,
        meals_followed: 5,
        total_meals: 6,
      },
    ],
    weekly_summary: {
      total_planned_calories: 3160,
      total_actual_calories: 3740,
      total_meals_followed: 9,
      total_meals: 12,
      adherence_percentage: 75,
    },
  },
  // Last week
  {
    week_start: getWeekDates(1).start,
    week_end: getWeekDates(1).end,
    week_label: 'Last Week',
    days: [
      {
        date: getWeekDates(1).start,
        day_of_week: 'Monday',
        meals: [
          {
            id: 'last_mon_breakfast',
            meal_type: 'Breakfast',
            planned_meal: 'Smoothie Bowl',
            planned_calories: 300,
            followed_plan: true,
            actual_meal: 'Smoothie Bowl',
            actual_quantity: '1 bowl',
            actual_calories: 300,
          },
          {
            id: 'last_mon_morning_snack',
            meal_type: 'Morning Snack',
            planned_meal: 'Protein Bar',
            planned_calories: 200,
            followed_plan: true,
            actual_meal: 'Protein Bar',
            actual_quantity: '1 bar',
            actual_calories: 200,
          },
          {
            id: 'last_mon_lunch',
            meal_type: 'Lunch',
            planned_meal: 'Quinoa Buddha Bowl',
            planned_calories: 450,
            followed_plan: false,
            actual_meal: 'Fast Food Burger',
            actual_quantity: '1 large burger',
            actual_calories: 680,
            notes: 'Was running late, grabbed fast food',
          },
          {
            id: 'last_mon_afternoon_snack',
            meal_type: 'Afternoon Snack',
            planned_meal: 'Carrots with Hummus',
            planned_calories: 150,
            followed_plan: true,
            actual_meal: 'Carrots with Hummus',
            actual_quantity: '1 cup carrots + 2 tbsp hummus',
            actual_calories: 150,
          },
          {
            id: 'last_mon_dinner',
            meal_type: 'Dinner',
            planned_meal: 'Baked Cod with Vegetables',
            planned_calories: 400,
            followed_plan: true,
            actual_meal: 'Baked Cod with Vegetables',
            actual_quantity: '1 fillet + 1 cup veggies',
            actual_calories: 400,
          },
          {
            id: 'last_mon_evening_snack',
            meal_type: 'Evening Snack',
            planned_meal: 'Chamomile Tea',
            planned_calories: 0,
            followed_plan: true,
            actual_meal: 'Chamomile Tea',
            actual_quantity: '1 cup',
            actual_calories: 0,
          },
        ],
        total_planned_calories: 1500,
        total_actual_calories: 1730,
        meals_followed: 5,
        total_meals: 6,
      },
      {
        date: new Date(new Date(getWeekDates(1).start).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        day_of_week: 'Tuesday',
        meals: [
          {
            id: 'last_tue_breakfast',
            meal_type: 'Breakfast',
            planned_meal: 'Avocado Toast',
            planned_calories: 280,
            followed_plan: true,
            actual_meal: 'Avocado Toast',
            actual_quantity: '2 slices',
            actual_calories: 280,
          },
          {
            id: 'last_tue_morning_snack',
            meal_type: 'Morning Snack',
            planned_meal: 'Green Tea',
            planned_calories: 0,
            followed_plan: false,
            actual_meal: 'Donut',
            actual_quantity: '1 glazed donut',
            actual_calories: 260,
            notes: 'Office brought donuts',
          },
          {
            id: 'last_tue_lunch',
            meal_type: 'Lunch',
            planned_meal: 'Mediterranean Wrap',
            planned_calories: 380,
            followed_plan: true,
            actual_meal: 'Mediterranean Wrap',
            actual_quantity: '1 large wrap',
            actual_calories: 380,
          },
          {
            id: 'last_tue_afternoon_snack',
            meal_type: 'Afternoon Snack',
            planned_meal: 'Trail Mix',
            planned_calories: 180,
            followed_plan: true,
            actual_meal: 'Trail Mix',
            actual_quantity: '1/4 cup',
            actual_calories: 180,
          },
          {
            id: 'last_tue_dinner',
            meal_type: 'Dinner',
            planned_meal: 'Lean Beef with Sweet Potato',
            planned_calories: 520,
            followed_plan: true,
            actual_meal: 'Lean Beef with Sweet Potato',
            actual_quantity: '4oz beef + 1 medium potato',
            actual_calories: 520,
          },
          {
            id: 'last_tue_evening_snack',
            meal_type: 'Evening Snack',
            planned_meal: 'Casein Protein Shake',
            planned_calories: 140,
            followed_plan: true,
            actual_meal: 'Casein Protein Shake',
            actual_quantity: '1 scoop',
            actual_calories: 140,
          },
        ],
        total_planned_calories: 1500,
        total_actual_calories: 1760,
        meals_followed: 5,
        total_meals: 6,
      },
    ],
    weekly_summary: {
      total_planned_calories: 3000,
      total_actual_calories: 3490,
      total_meals_followed: 10,
      total_meals: 12,
      adherence_percentage: 83,
    },
  },
];

export function getWeeklyTrackingData(weekValue: string): WeeklyTracking | null {
  return mockWeeklyTracking.find(week => 
    `${week.week_start}_${week.week_end}` === weekValue
  ) || null;
}

export function canEditMeal(date: string): boolean {
  const mealDate = new Date(date);
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);
  
  // Can edit if date is today or within the past week, but not future
  return mealDate <= today && mealDate >= oneWeekAgo;
}