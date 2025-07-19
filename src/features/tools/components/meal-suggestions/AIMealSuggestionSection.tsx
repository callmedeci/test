import { getUserPlan, getUserProfile } from '@/lib/supabase/data-service';
import AIMealSuggestionGenerator from './AIMealSuggestionGenerator';

async function AIMealSuggestionSection() {
  try {
    const profile = await getUserProfile();
    const plan = await getUserPlan();

    return <AIMealSuggestionGenerator plan={plan} profile={profile} />;
  } catch (error: any) {
    <p>{error}</p>;
  }
}

export default AIMealSuggestionSection;
