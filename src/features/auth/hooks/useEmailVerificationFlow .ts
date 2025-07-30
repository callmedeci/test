import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useEmailVerificationFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  );
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!oobCode) {
      setMessage('Invalid verification link. Code is missing.');
      setStatus('error');
      return;
    }
  }, [oobCode, router]);

  return { status, message, oobCode };
}
