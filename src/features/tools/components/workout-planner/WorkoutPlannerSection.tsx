
import { getUserProfile } from '@/lib/supabase/data-service';
import WorkoutPlannerContainer from './WorkoutPlannerContainer';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default async function WorkoutPlannerSection() {
  try {
    const profile = await getUserProfile();
    
    return <WorkoutPlannerContainer profile={profile} />;
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
