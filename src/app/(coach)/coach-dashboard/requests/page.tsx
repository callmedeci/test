import { PendingRequestsSection } from '@/features/coach/components/requests/PendingRequestsSection';
import { RequestsHeader } from '@/features/coach/components/requests/RequestsHeader';
import { PotentialClientsSection } from '@/features/coach/components/requests/PotentialClientsSection';

export default function CoachRequestsPage() {
  return (
    <div className='space-y-8'>
      <RequestsHeader />
      <PendingRequestsSection />
      <PotentialClientsSection />
    </div>
  );
}
