import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Dumbbell, Zap } from 'lucide-react';

interface WorkoutPlan {
  currentFitnessLevel: string;
  targetFitnessLevel: string;
  dailyActivity: number;
  dailyActivityGoal: number;
  workoutDaysPerWeek: number;
  workoutDaysGoal: number;
  strengthLevel: number;
  strengthTarget: number;
  enduranceLevel: number;
  enduranceTarget: number;
  fitnessGoalProgress: number;
  weeklyTargets: {
    cardio: number;
    strength: number;
    flexibility: number;
  };
}

interface WeeklyWorkoutTargetsProps {
  workoutPlan: WorkoutPlan;
}

export function WeeklyWorkoutTargets({
  workoutPlan,
}: WeeklyWorkoutTargetsProps) {
  const workoutTypes = [
    {
      name: 'Cardio',
      value: workoutPlan?.weeklyTargets.cardio || 0,
      icon: Activity,
    },
    {
      name: 'Strength',
      value: workoutPlan?.weeklyTargets.strength || 0,
      icon: Dumbbell,
    },
    {
      name: 'Flexibility',
      value: workoutPlan?.weeklyTargets.flexibility || 0,
      icon: Zap,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Weekly Workout Targets
        </CardTitle>
        <p className='text-sm text-muted-foreground'>
          Your personalized workout breakdown
        </p>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {workoutTypes.map((workout) => (
            <div key={workout.name} className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='p-2 rounded-lg'>
                    <workout.icon className='h-4 w-4 text-primary' />
                  </div>
                  <span className='text-primary font-medium text-sm'>
                    {workout.name}
                  </span>
                </div>
                <span className='text-primary font-bold text-sm'>
                  {workout.value} min
                </span>
              </div>
              <Progress value={(workout.value || 0) / 2} className='h-2' />
              <p className='text-xs text-muted-foreground'>Weekly target</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
