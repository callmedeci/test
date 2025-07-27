import { Card, CardContent } from '@/components/ui/card';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SectionHeader from '@/components/ui/SectionHeader';
import { CoachClientProfile } from '@/features/coach/components/client-dashboard/CoachClientProfile';
import { checkCoachAccess } from '@/lib/utils/access-control';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface CoachClientProfilePageProps {
  params: Promise<{ clientId: string }>;
}

export default async function CoachClientProfilePage({
  params,
}: CoachClientProfilePageProps) {
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
          title="Client's Profile"
          description='View your client's health profile and nutrition goals'
        />
        <CardContent>
          <Suspense fallback={<LoadingScreen />}>
            <CoachClientProfile clientId={clientId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
  )
}