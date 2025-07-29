import ErrorMessage from '@/components/ui/ErrorMessage';
import { getUserPlan, getUserProfile } from '@/lib/supabase/data-service';
import { DashboardContent } from './DashboardContent';

export async function DashboardSection() {
  try {
    const profile = await getUserProfile();
    const userPlan = await getUserPlan();

    return <DashboardContent profile={profile} userPlan={userPlan} />;
  } catch (error: any) {
    return (
      <ErrorMessage
        title='Dashboard Data Unavailable'
        message={
          error?.message ||
          "We couldn't load your dashboard data. Please ensure your profile is complete and try again."
        }
      />
    );
  }
}