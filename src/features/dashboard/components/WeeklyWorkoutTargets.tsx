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

export function WeeklyWorkoutTargets({ workoutPlan }: WeeklyWorkoutTargetsProps) {
  const workoutTypes = [
    {
      name: 'Cardio',
      value: workoutPlan?.weeklyTargets.cardio || 0,
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      progressColor: 'bg-red-500',
    },
    {
      name: 'Strength',
      value: workoutPlan?.weeklyTargets.strength || 0,
      icon: Dumbbell,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progressColor: 'bg-blue-500',
    },
    {
      name: 'Flexibility',
      value: workoutPlan?.weeklyTargets.flexibility || 0,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progressColor: 'bg-purple-500',
    },
  ];

  return (
    <Card className='border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-md transition-shadow duration-200'>
      <CardHeader>
        <CardTitle className='text-emerald-800 flex items-center gap-2'>
          Weekly Workout Targets
        </CardTitle>
        <p className='text-sm text-emerald-600'>
          Your personalized workout breakdown
        </p>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {workoutTypes.map((workout) => (
            <div key={workout.name} className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className={`p-2 rounded-lg ${workout.bgColor}`}>
                    <workout.icon className={`h-4 w-4 ${workout.color}`} />
                  </div>
                  <span className='text-emerald-700 font-medium text-sm'>
                    {workout.name}
                  </span>
                </div>
                <span className='text-emerald-700 font-bold text-sm'>
                  {workout.value} min
                </span>
              </div>
              <Progress
                value={(workout.value || 0) / 2}
                className='h-2'
              />
              <p className='text-xs text-emerald-600'>Weekly target</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}