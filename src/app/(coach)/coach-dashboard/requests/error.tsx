
'use client';

import ErrorMessage from '@/components/ui/ErrorMessage';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CoachRequestsError({ error, reset }: ErrorPageProps) {
  return (
    <ErrorMessage
      title="Requests Error"
      message={error.message || 'Something went wrong loading requests'}
      showRetry={true}
      onRetry={reset}
      showHomeLink={false}
    />
  );
}
