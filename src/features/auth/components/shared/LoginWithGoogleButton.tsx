'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Google from '../../../../public/google.svg';
import { useLoginWithGoogle } from '../../hooks/useLoginWithGoogle';

function LoginWithGoogleButton({ disabled }: { disabled: boolean }) {
  const { isLoggingIn, loginWithGoogle } = useLoginWithGoogle();

  return (
    <Button
      onClick={async () => await loginWithGoogle()}
      type='button'
      className='w-full'
      disabled={disabled || isLoggingIn}
    >
      {isLoggingIn ? (
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      ) : (
        <Image src={Google} alt='google' />
      )}{' '}
      Login with Google
    </Button>
  );
}

export default LoginWithGoogleButton;
