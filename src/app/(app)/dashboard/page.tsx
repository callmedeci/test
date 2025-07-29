import LoadingScreen from '@/components/ui/LoadingScreen';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { DashboardSection } from '@/features/dashboard/components/DashboardSection';
import { QuickActionsSection } from '@/features/dashboard/components/QuickActionsSection';
import { createClient } from '@/lib/supabase/server';
import { Dumbbell, Heart } from 'lucide-react';
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

      <Tabs defaultValue='nutrition' className='w-full'>
        <TabsList className='grid w-full grid-cols-2 bg-card backdrop-blur-sm shadow-sm border border-border/50'>
          <TabsTrigger
            value='nutrition'
            className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200'
          >
            <Heart className='w-4 h-4 mr-2' />
            Nutrition Plan
          </TabsTrigger>
          <TabsTrigger
            value='workout'
            className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200'
          >
            <Dumbbell className='w-4 h-4 mr-2' />
            Workout Plan
          </TabsTrigger>
        </TabsList>

        <Suspense
          fallback={<LoadingScreen loadingLabel='Loading your dashboard...' />}
        >
          <DashboardSection />
        </Suspense>
      </Tabs>

      {/* Quick Actions - shown on both tabs */}
      <div className='mt-8'>
        <QuickActionsSection />
      </div>
    </div>
  );
}
