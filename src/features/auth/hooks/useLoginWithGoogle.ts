import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginWithGoogle as loginWithGoogleApi } from '../actions/loginWithOAuth';
import { useToast } from '@/hooks/use-toast';

export function useLoginWithGoogle() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutateAsync: loginWithGoogle,
    isPending: isLoggingIn,
    error: loginError,
  } = useMutation({
    mutationFn: loginWithGoogleApi,

    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['user'] });

      toast({
        title: 'Success',
        description: 'You have successfully logged in with Google.',
        variant: 'default',
      });
    },

    onError() {
      toast({
        title: 'Error',
        description: 'Failed to log in with Google. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return { loginWithGoogle, isLoggingIn, loginError };
}
