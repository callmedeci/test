import { useQuery } from '@tanstack/react-query';
import { getMealPlan } from '../lib/data-service';

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
