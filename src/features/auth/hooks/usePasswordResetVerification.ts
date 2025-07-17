import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isNotValidURL } from '../lib/authUtils';

export function usePasswordResetVerification() {
  const searchParams = useSearchParams();

  const [isValidCode, setIsValidCode] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  const token = searchParams.get('token_hash') ?? null;
  const type = searchParams.get('type') ?? null;
  const next = searchParams.get('next') ?? null;

  useEffect(() => {
    if (isNotValidURL(next, token, type)) {
      setIsValidCode(false);
      setVerificationError(
        'Invalid or expired password reset link. Please request a new one.'
      );
    } else {
      setIsValidCode(true);
      setVerificationError(null);
    }
  }, [next, token, type]);

  return { isValidCode, verificationError };
}
