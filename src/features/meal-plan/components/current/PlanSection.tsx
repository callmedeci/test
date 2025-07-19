import {
  getMealPlan,
  getUserPlan,
  getUserProfile,
} from '@/lib/supabase/data-service';
import EditMealDialog from './EditMealDialog';
import WeeklyMealPlanTabs from './WeeklyMealPlanTabs';

async function PlanSection({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const profile = await getUserProfile();
    const plan = await getUserPlan();
    const mealPlan = await getMealPlan();

    const params = await searchParams;
    const isEditing = params.is_edit;

    return (
      <>
        <WeeklyMealPlanTabs profile={profile} plan={plan} mealPlan={mealPlan} />
        {isEditing && <EditMealDialog mealPlan={mealPlan} />}
      </>
    );
  } catch (error: any) {
    return <p>{error}</p>;
  }
}

export default PlanSection;
