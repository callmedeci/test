import { Suspense } from 'react';
import { RequestsList } from './RequestsList';
import PageLoadingSpinner from '@/components/ui/PageLoadingSpinner';

export function PendingRequestsSection() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<PageLoadingSpinner message="Loading pending requests..." />}>
        <RequestsList />
      </Suspense>
    </div>
  );
}