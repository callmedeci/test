import { getUserProfile } from '@/features/profile/lib/data-services';
import { useQuery } from '@tanstack/react-query';

export function useGetProfile() {
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  return { isLoadingProfile, userProfile, profileError };
}
