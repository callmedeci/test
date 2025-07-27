
import { PendingRequestsSection } from '@/features/coach/components/requests/PendingRequestsSection';
import { RequestsHeader } from '@/features/coach/components/requests/RequestsHeader';
import { Suspense } from 'react';
import PageLoadingSpinner from '@/components/ui/PageLoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default async function CoachRequestsPage() {
  try {
    return (
      <div className='space-y-8'>
        <Suspense fallback={<PageLoadingSpinner message="Loading requests header..." />}>
          <RequestsHeader />
        </Suspense>
        <PendingRequestsSection />
      </div>
    );
  } catch (error) {
    return (
      <ErrorMessage
        title="Requests Error"
        message={error instanceof Error ? error.message : 'Failed to load requests'}
        showRetry={true}
        onRetry={() => window.location.reload()}
      />
    );
  }
}
