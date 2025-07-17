import { useQuery } from '@tanstack/react-query';
import { getUser } from '../lib/data-services';

export function useGetUser() {
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });

  return { isLoadingUser, user, userError };
}
