import { getMealPlan } from '@/lib/supabase/data-service';
import { useQuery } from '@tanstack/react-query';

export function useGetMealPlan() {
  const {
    data: mealPlan,
    isLoading: isLoadingMealPlan,
    error: mealPlanError,
  } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: getMealPlan,
  });

  return { mealPlan, isLoadingMealPlan, mealPlanError };
}
