
import { CoachDashboardHeader } from '@/features/coach/components/dashboard/CoachDashboardHeader';
import { CoachStatsCards } from '@/features/coach/components/dashboard/CoachStatsCards';
import { QuickActionsSection } from '@/features/coach/components/dashboard/QuickActionsSection';
import { RecentActivitySection } from '@/features/coach/components/dashboard/RecentActivitySection';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default async function CoachDashboardPage() {
  try {
    return (
      <div className='space-y-8'>
        <CoachDashboardHeader />
        <CoachStatsCards />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <RecentActivitySection />
          <QuickActionsSection />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <ErrorMessage
        title="Dashboard Error"
        message={error instanceof Error ? error.message : 'Failed to load dashboard'}
        showRetry={true}
        onRetry={() => window.location.reload()}
      />
    );
  }
}
