import { getUser } from '@/features/profile/lib/data-services';
import { MealPlans, WeeklyMealPlan } from '@/lib/schemas';
import { createClient } from '@/lib/supabase/client';

export async function getMealPlan(): Promise<MealPlans> {
  const supabase = createClient();
  const user = await getUser();

  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', user?.id)
    .single();

  if (error) throw new Error('Failed to fetch meal plan data');

  return data as MealPlans;
}

export async function editMealPlan(mealPlan: {
  meal_data: WeeklyMealPlan;
}): Promise<MealPlans> {
  const supabase = createClient();
  const user = await getUser();

  const { data, error } = await supabase
    .from('meal_plans')
    .update(mealPlan)
    .eq('user_id', user?.id)
    .single();

  console.log(error);

  if (error) throw new Error('Failed to update meal plan data');

  return data as MealPlans;
}
