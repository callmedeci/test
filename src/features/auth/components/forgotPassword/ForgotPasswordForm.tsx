'use client';

import { useEffect, useState } from 'react';

import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { toast } from '@/hooks/use-toast';
import SubmitButton from '../../../../components/ui/SubmitButton';
import { forgotPasswordAction } from '../../actions/forgotPassword';
import { forgotPasswordSchema } from '../../schemas/authSchema';

type ForgotPasswordFormValues = {
  email: string;
};

function ForgotPasswordForm() {
  const [message, setMessage] = useState<string>('');
  const { formState, handleSubmit, register } =
    useForm<ForgotPasswordFormValues>({
      resolver: zodResolver(forgotPasswordSchema),
    });

  const isLoading = formState.isSubmitting;
  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (
    formData
  ) => {
    const { email } = formData;
    const { isSuccess, message, userError } = await forgotPasswordAction(email);

    if (message) setMessage(message);

    if (isSuccess)
      return toast({
        title: 'Reset Link Sent',
        description: 'Please check your email for password reset instructions.',
      });

    if (!isSuccess)
      return toast({
        title: 'Error',
        description: userError,
        variant: 'destructive',
      });
  };

  //Toasts for validation errors
  useEffect(
    function () {
      if (formState.errors.email)
        toast({
          title: 'Email Required',
          description: formState.errors.email.message,
          variant: 'destructive',
        });
    },
    [formState.errors, toast]
  );

  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            {...register('email')}
            id='email'
            type='email'
            placeholder='m@example.com'
            required
            disabled={isLoading}
          />
        </div>

        <SubmitButton
          isLoading={isLoading}
          icon={<Mail className='mr-2 h-4 w-4' />}
          loadingLabel='Sending...'
          label='Send Reset Link'
        />
      </form>
      {message && (
        <p className='mt-4 text-sm text-center text-muted-foreground bg-green-50 border border-green-200 p-3 rounded-md'>
          {message}
        </p>
      )}
    </CardContent>
  );
}

export default ForgotPasswordForm;
