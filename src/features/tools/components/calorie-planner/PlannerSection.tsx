import { getUserPlan, getUserProfile } from '@/lib/supabase/data-service';
import PlannerForm from './PlannerForm';

async function PlannerSection() {
  try {
    const profile = await getUserProfile();
    const plan = await getUserPlan();

    return <PlannerForm profile={profile} plan={plan} />;
  } catch {
    return <p>Error...</p>;
  }
}

export default PlannerSection;
