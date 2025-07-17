import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { resetProfile as resetProfileApi } from '../actions/apiUserProfile';

export function useResetProfile() {
  const { toast } = useToast();

  const query = useQueryClient();
  const router = useRouter();

  const { mutateAsync: resetProfile, isPending: isReseting } = useMutation({
    mutationKey: ['userProfile'],
    mutationFn: resetProfileApi,

    onSuccess() {
      toast({
        title: 'Profile Reset',
        description: 'Your profile has been reset successfully.',
        variant: 'default',
      });

      query.invalidateQueries({ queryKey: ['userProfile'] });
      router.push('/onboarding');
    },

    onError() {
      toast({
        title: 'Reset Failed',
        description: 'Unable to reset your profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return { resetProfile, isReseting };
}
