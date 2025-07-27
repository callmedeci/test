
import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/SectionHeader';
import { CoachClientDashboard } from '@/features/coach/components/client-dashboard/CoachClientDashboard';
import { checkCoachAccess } from '@/lib/supabase/database/coach-service';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PageLoadingSpinner from '@/components/ui/PageLoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface CoachClientDashboardPageProps {
  params: Promise<{ clientId: string }>;
}

export default async function CoachClientDashboardPage({
  params,
}: CoachClientDashboardPageProps) {
  try {
    const { clientId } = await params;
    const { hasAccess, isCoach } = await checkCoachAccess(clientId);

    if (!isCoach || !hasAccess) notFound();

    return (
      <div className='space-y-6'>
        <Card className='shadow-lg'>
          <SectionHeader
            className='text-3xl font-bold'
            title='Client Dashboard'
            description="Monitor your client's nutrition progress and meal plans"
          />
          <CardContent>
            <Suspense fallback={<PageLoadingSpinner message="Loading client dashboard..." />}>
              <CoachClientDashboard clientId={clientId} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    return (
      <ErrorMessage
        title="Client Dashboard Error"
        message={error instanceof Error ? error.message : 'Failed to load client dashboard'}
        showRetry={true}
        onRetry={() => window.location.reload()}
      />
    );
  }
}
