import LoadingScreen from '@/components/ui/LoadingScreen';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { DashboardSection } from '@/features/dashboard/components/DashboardSection';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  if (error) redirect('/error');

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      <DashboardHeader />
      
      <Suspense fallback={<LoadingScreen loadingLabel='Loading your dashboard...' />}>
        <DashboardSection />
      </Suspense>
    </div>
  );
}
