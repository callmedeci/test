import ErrorMessage from '@/components/ui/ErrorMessage';
import { getUserProfile } from '@/lib/supabase/data-service';
import WorkoutPlannerContent from './WorkoutPlannerContent';

export default async function WorkoutPlannerSection() {
  try {
    const profile = await getUserProfile();
    
    return <WorkoutPlannerContent profile={profile} />;
  } catch (error: any) {
    return (
      <ErrorMessage
        title='Unable to Load Profile Data'
        message={
          error?.message ||
          "We couldn't load your profile data. Please complete your profile setup first."
        }
      />
    );
  }
}