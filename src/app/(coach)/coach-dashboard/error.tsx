
'use client';

import ErrorMessage from '@/components/ui/ErrorMessage';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CoachDashboardError({ error, reset }: ErrorPageProps) {
  return (
    <ErrorMessage
      title="Dashboard Error"
      message={error.message || 'Something went wrong with the dashboard'}
      showRetry={true}
      onRetry={reset}
      showHomeLink={false}
    />
  );
}
