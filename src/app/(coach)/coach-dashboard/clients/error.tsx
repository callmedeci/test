
'use client';

import ErrorMessage from '@/components/ui/ErrorMessage';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CoachClientsError({ error, reset }: ErrorPageProps) {
  return (
    <ErrorMessage
      title="Clients Error"
      message={error.message || 'Something went wrong loading clients'}
      showRetry={true}
      onRetry={reset}
      showHomeLink={false}
    />
  );
}
