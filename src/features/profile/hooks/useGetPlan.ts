import { useQuery } from '@tanstack/react-query';
import { getUserPlan } from '../lib/data-services';

export function useGetPlan() {
  const {
    data: userPlan,
    isLoading: isLoadingPlan,
    error: planError,
  } = useQuery({
    queryKey: ['userPlan'],
    queryFn: getUserPlan,
  });

  return { isLoadingPlan, userPlan, planError };
}
