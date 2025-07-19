import { getMealPlan, getUserProfile } from '@/lib/supabase/data-service';
import { AlertTriangle } from 'lucide-react';
import MealPlanGenerator from './MealPlanGenerator';

async function AiPlanSection() {
  try {
    const mealPlan = await getMealPlan();
    const profile = await getUserProfile();

    return <MealPlanGenerator mealPlan={mealPlan} profile={profile} />;
  } catch (error: any) {
    <p className='text-destructive text-center py-4'>
      <AlertTriangle className='inline mr-2' />
      {error}
    </p>;
  }
}

export default AiPlanSection;
