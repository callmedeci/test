import { getUserPlan, getUserProfile } from '@/lib/supabase/data-service';
import CustomizePlanForm from './CustomizePlanForm';

async function CustomizePlanSection() {
  try {
    const profile = await getUserProfile();
    const plan = await getUserPlan();

    return <CustomizePlanForm plan={plan} profile={profile} />;
  } catch {
    <p>Error...</p>;
  }
}

export default CustomizePlanSection;
