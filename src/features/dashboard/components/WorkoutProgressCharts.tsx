import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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

interface WorkoutProgressChartsProps {
  workoutPlan: WorkoutPlan;
}

export function WorkoutProgressCharts({
  workoutPlan,
}: WorkoutProgressChartsProps) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <Card className='transition-shadow duration-200'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            Workout Progress
          </CardTitle>
          <p className='text-sm text-muted-foreground'>
            Progress towards your 1-month fitness goal
          </p>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between text-sm'>
            <span className='text-primary font-medium'>Current Progress</span>
            <span className='text-primary font-bold'>
              {workoutPlan?.fitnessGoalProgress || 0}%
            </span>
          </div>
          <Progress
            value={workoutPlan?.fitnessGoalProgress || 0}
            className='h-2'
          />
          <p className='text-xs text-muted-foreground'>
            Long-term goal: Monthly fitness improvement
          </p>
        </CardContent>
      </Card>

      <Card className='transition-shadow duration-200'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            Fitness Composition
          </CardTitle>
          <p className='text-sm text-muted-foreground'>
            Strength and endurance targets
          </p>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            <div className='flex justify-between text-sm'>
              <span className='text-primary font-medium'>Strength Level</span>
              <span className='text-primary font-bold'>
                {workoutPlan?.strengthLevel || 0}% /{' '}
                {workoutPlan?.strengthTarget || 0}%
              </span>
            </div>
            <Progress value={workoutPlan?.strengthLevel || 0} className='h-2' />
          </div>
          <div className='space-y-3'>
            <div className='flex justify-between text-sm'>
              <span className='text-primary font-medium'>Endurance Level</span>
              <span className='text-primary font-bold'>
                {workoutPlan?.enduranceLevel || 0}% /{' '}
                {workoutPlan?.enduranceTarget || 0}%
              </span>
            </div>
            <Progress
              value={workoutPlan?.enduranceLevel || 0}
              className='h-2'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
