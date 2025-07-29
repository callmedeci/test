import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseProfileData, UserPlanType } from '@/lib/schemas';
import { Dumbbell, Heart } from 'lucide-react';
import { MacronutrientTargets } from './MacronutrientTargets';
import { NutritionStatsCards } from './NutritionStatsCards';
import { ProgressSection } from './ProgressSection';
import { QuickActionsSection } from './QuickActionsSection';
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
    <Tabs defaultValue='nutrition' className='w-full'>
      <TabsList className='grid w-full grid-cols-2 bg-card backdrop-blur-sm shadow-sm border border-border/50'>
        <TabsTrigger
          value='nutrition'
          className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200'
        >
          <Heart className='w-4 h-4 mr-2' />
          Nutrition Plan
        </TabsTrigger>
        <TabsTrigger
          value='workout'
          className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200'
        >
          <Dumbbell className='w-4 h-4 mr-2' />
          Workout Plan
        </TabsTrigger>
      </TabsList>

      {/* Nutrition Tab */}
      <TabsContent value='nutrition' className='space-y-6 mt-6'>
        <NutritionStatsCards profile={profile} userPlan={userPlan} />
        <ProgressSection profile={profile} />
        <MacronutrientTargets userPlan={userPlan} />
      </TabsContent>

      {/* Workout Tab */}
      <TabsContent value='workout' className='space-y-6 mt-6'>
        <div className='bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4 mb-6'>
          <div className='flex items-center gap-2 mb-2'>
            <Badge variant='secondary' className='bg-emerald-100 text-emerald-800'>
              Coming Soon
            </Badge>
            <span className='text-sm font-medium text-emerald-800'>Enhanced Workout Tracking</span>
          </div>
          <p className='text-sm text-emerald-700'>
            Full workout tracking and progress monitoring features are in development. 
            Current data shows example fitness metrics.
          </p>
        </div>
        
        <WorkoutStatsCards workoutPlan={workoutPlan} />
        <WorkoutProgressCharts workoutPlan={workoutPlan} />
        <WeeklyWorkoutTargets workoutPlan={workoutPlan} />
      </TabsContent>

      {/* Quick Actions - shown on both tabs */}
      <div className='mt-8'>
        <QuickActionsSection />
      </div>
    </Tabs>
  );
}