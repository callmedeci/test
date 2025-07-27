import ErrorMessage from '@/components/ui/ErrorMessage';
import { getMealPlan, getProfileById } from '@/lib/supabase/data-service';
import { CoachMealPlanView } from './CoachMealPlanView';

interface CoachClientMealPlanProps {
  clientId: string;
}

export async function CoachClientMealPlan({
  clientId,
}: CoachClientMealPlanProps) {
  try {
    const mealPlan = await getMealPlan(clientId);
    const profile = await getProfileById(clientId, 'client');

    return <CoachMealPlanView mealPlan={mealPlan} profile={profile} />;
  } catch (error: any) {
    return (
      <ErrorMessage
        title='Meal Plan Unavailable'
        message={
          error?.message ||
          "We couldn't load this client's meal plan. The client may not have created one yet."
        }
      />
    );
  }
}