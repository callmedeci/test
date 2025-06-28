'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { resetPasswordAction } from '../../actions/resetPasswordAction';
import { newPasswordSchema } from '../../schemas/authSchema';
import SubmitButton from '../shared/SubmitButton';

function ResetPasswordForn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { toast } = useToast();
  const { handleSubmit, formState, register } = useForm({
    resolver: zodResolver(newPasswordSchema),
  });

  const oobCode = searchParams.get('oobCode');
  const isLoading = formState.isSubmitting;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!oobCode)
      return toast({
        title: 'Error',
        description: 'Password reset code is missing.',
        variant: 'destructive',
      });

    const { newPassword } = data;
    const { isSuccess, userError } = await resetPasswordAction({
      oobCode,
      newPassword,
    });

    if (isSuccess) {
      toast({
        title: 'Password Reset Successful',
        description:
          'Your password has been changed. Please log in with your new password.',
        variant: 'default',
      });
      router.push('/login');
    }

    if (!isSuccess)
      toast({
        title: 'Password Reset Failed',
        description: userError,
        variant: 'destructive',
      });
  };

  useEffect(
    function () {
      const { confirmNewPassword, newPassword } = formState.errors;

      if (confirmNewPassword)
        toast({
          title: 'Error',
          description: confirmNewPassword.message,
          variant: 'destructive',
        });

      if (newPassword)
        toast({
          title: 'Error',
          description: newPassword.message,
          variant: 'destructive',
        });
    },
    [formState.errors]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='new-password'>New Password</Label>
        <Input
          {...register('newPassword')}
          id='new-password'
          type='password'
          required
          disabled={isLoading}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='confirm-new-password'>Confirm New Password</Label>
        <Input
          {...register('confirmNewPassword')}
          id='confirm-new-password'
          type='password'
          required
          disabled={isLoading}
        />
      </div>

      <SubmitButton
        icon={<KeyRound className='mr-2 h-4 w-4' />}
        loadingLabel='Resetting...'
        label='Reset Password'
        isLoading={isLoading}
      />
    </form>
  );
}

export default ResetPasswordForn;
