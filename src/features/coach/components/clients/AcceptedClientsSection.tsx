
import { Suspense } from 'react';
import { ClientsList } from './ClientsList';
import { ClientsStatsCards } from './ClientsStatsCards';
import PageLoadingSpinner from '@/components/ui/PageLoadingSpinner';

export function AcceptedClientsSection() {
  return (
    <div className='space-y-6'>
      <Suspense fallback={<PageLoadingSpinner message="Loading client stats..." />}>
        <ClientsStatsCards />
      </Suspense>
      
      <Suspense fallback={<PageLoadingSpinner message="Loading clients..." />}>
        <ClientsList />
      </Suspense>
    </div>
  );
}
