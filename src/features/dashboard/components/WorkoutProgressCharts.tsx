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

export function WorkoutProgressCharts({ workoutPlan }: WorkoutProgressChartsProps) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <Card className='border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-md transition-shadow duration-200'>
        <CardHeader>
          <CardTitle className='text-emerald-800 flex items-center gap-2'>
            Workout Progress
          </CardTitle>
          <p className='text-sm text-emerald-600'>
            Progress towards your 1-month fitness goal
          </p>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between text-sm'>
            <span className='text-emerald-700 font-medium'>Current Progress</span>
            <span className='text-emerald-700 font-bold'>
              {workoutPlan?.fitnessGoalProgress || 0}%
            </span>
          </div>
          <Progress
            value={workoutPlan?.fitnessGoalProgress || 0}
            className='h-3'
          />
          <p className='text-xs text-emerald-600'>
            Long-term goal: Monthly fitness improvement
          </p>
        </CardContent>
      </Card>

      <Card className='border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-shadow duration-200'>
        <CardHeader>
          <CardTitle className='text-blue-800 flex items-center gap-2'>
            Fitness Composition
          </CardTitle>
          <p className='text-sm text-blue-600'>
            Strength and endurance targets
          </p>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            <div className='flex justify-between text-sm'>
              <span className='text-blue-700 font-medium'>Strength Level</span>
              <span className='text-blue-700 font-bold'>
                {workoutPlan?.strengthLevel || 0}% / {workoutPlan?.strengthTarget || 0}%
              </span>
            </div>
            <Progress
              value={workoutPlan?.strengthLevel || 0}
              className='h-2'
            />
          </div>
          <div className='space-y-3'>
            <div className='flex justify-between text-sm'>
              <span className='text-blue-700 font-medium'>Endurance Level</span>
              <span className='text-blue-700 font-bold'>
                {workoutPlan?.enduranceLevel || 0}% / {workoutPlan?.enduranceTarget || 0}%
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