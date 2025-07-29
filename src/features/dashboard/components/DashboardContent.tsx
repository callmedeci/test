import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { BaseProfileData, UserPlanType } from '@/lib/schemas';
import { MacronutrientTargets } from './MacronutrientTargets';
import { NutritionStatsCards } from './NutritionStatsCards';
import { ProgressSection } from './ProgressSection';
import { WeeklyWorkoutTargets } from './WeeklyWorkoutTargets';
import { WorkoutProgressCharts } from './WorkoutProgressCharts';
import { WorkoutStatsCards } from './WorkoutStatsCards';

interface DashboardContentProps {
  profile: BaseProfileData;
  userPlan: UserPlanType;
}

// Mock workout data - in a real app, this would come from your workout service
const workoutPlan = {
  currentFitnessLevel: 'Intermediate',
  targetFitnessLevel: 'Advanced',
  dailyActivity: 45,
  dailyActivityGoal: 60,
  workoutDaysPerWeek: 4,
  workoutDaysGoal: 5,
  strengthLevel: 65,
  strengthTarget: 80,
  enduranceLevel: 70,
  enduranceTarget: 85,
  fitnessGoalProgress: 72,
  weeklyTargets: {
    cardio: 150,
    strength: 120,
    flexibility: 45,
  },
};

export function DashboardContent({ profile, userPlan }: DashboardContentProps) {
  return (
    <>
      {/* Nutrition Tab */}
      <TabsContent value='nutrition' className='space-y-6 mt-6'>
        <NutritionStatsCards profile={profile} userPlan={userPlan} />
        <ProgressSection profile={profile} />
        <MacronutrientTargets userPlan={userPlan} />
      </TabsContent>

      {/* Workout Tab */}
      <TabsContent value='workout' className='space-y-6 mt-6'>
        <div className='border border-primary rounded-lg p-4 mb-6'>
          <div className='flex items-center gap-2 mb-2'>
            <Badge variant='secondary'>Coming Soon</Badge>
            <span className='text-sm font-medium text-emerald-800'>
              Enhanced Workout Tracking
            </span>
          </div>
          <p className='text-sm text-primary'>
            Full workout tracking and progress monitoring features are in
            development. Current data shows example fitness metrics.
          </p>
        </div>

        <WorkoutStatsCards workoutPlan={workoutPlan} />
        <WorkoutProgressCharts workoutPlan={workoutPlan} />
        <WeeklyWorkoutTargets workoutPlan={workoutPlan} />
      </TabsContent>
    </>
  );
}
