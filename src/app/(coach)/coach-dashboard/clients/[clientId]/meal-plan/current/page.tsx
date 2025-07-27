import { Card, CardContent } from '@/components/ui/card';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SectionHeader from '@/components/ui/SectionHeader';
import { CoachClientMealPlan } from '@/features/coach/components/client-dashboard/CoachClientMealPlan';
import { checkCoachAccess } from '@/lib/utils/access-control';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface CoachClientMealPlanPageProps {
  params: Promise<{ clientId: string }>;
}

export default async function CoachClientMealPlanPage({
  params,
}: CoachClientMealPlanPageProps) {
  const { clientId } = await params;

  // Verify coach has access to this client
  const { hasAccess, isCoach } = await checkCoachAccess(clientId);

  if (!isCoach || !hasAccess) {
    notFound();
  }

  return (
    <div className='container mx-auto py-8'>
      <Card className='shadow-xl'>
        <SectionHeader
          className='text-3xl font-bold'
          title="Client's Current Meal Plan"
          description='View and monitor your client's weekly meal schedule'
        />
        <CardContent>
          <Suspense fallback={<LoadingScreen />}>
            <CoachClientMealPlan clientId={clientId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}