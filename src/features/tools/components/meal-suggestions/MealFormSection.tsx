import { getUserProfile } from '@/lib/supabase/data-service';
import MealForm from './MealForm';

async function MealFormSection() {
  try {
    const profile = await getUserProfile();

    return <MealForm profile={profile} />;
  } catch {
    return <div>Could not load profile data.</div>;
  }
}

export default MealFormSection;
