
import { AcceptedClientsSection } from '@/features/coach/components/clients/AcceptedClientsSection';
import { ClientsHeader } from '@/features/coach/components/clients/ClientsHeader';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default async function CoachClientsPage() {
  try {
    return (
      <div className='space-y-8'>
        <ClientsHeader />
        <AcceptedClientsSection />
      </div>
    );
  } catch (error) {
    return (
      <ErrorMessage
        title="Clients Error"
        message={error instanceof Error ? error.message : 'Failed to load clients'}
        showRetry={true}
        onRetry={() => window.location.reload()}
      />
    );
  }
}
