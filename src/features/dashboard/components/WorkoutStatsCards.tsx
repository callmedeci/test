import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Dumbbell, Target, TrendingUp } from 'lucide-react';

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

interface WorkoutStatsCardsProps {
  workoutPlan: WorkoutPlan;
}

export function WorkoutStatsCards({ workoutPlan }: WorkoutStatsCardsProps) {
  const statsData = [
    {
      title: 'Fitness Level',
      value: workoutPlan?.currentFitnessLevel || 'Not set',
      subtitle: `Target: ${workoutPlan?.targetFitnessLevel || 'Not set'}`,
      icon: Target,
    },
    {
      title: 'Daily Activity',
      value: `${workoutPlan?.dailyActivity || 0} min`,
      subtitle: `Goal: ${workoutPlan?.dailyActivityGoal || 0} min`,
      icon: Activity,
    },
    {
      title: 'Weekly Workouts',
      value: `${workoutPlan?.workoutDaysPerWeek || 0} days`,
      subtitle: `Goal: ${workoutPlan?.workoutDaysGoal || 0} days`,
      icon: Dumbbell,
    },
    {
      title: 'Progress',
      value: `${workoutPlan?.fitnessGoalProgress || 0}%`,
      subtitle: 'Overall fitness progress',
      icon: TrendingUp,
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {statsData.map((stat, index) => (
        <Card key={index} className='transition-all duration-200'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              {stat.title}
            </CardTitle>
            <div className='p-2 rounded-lg'>
              <stat.icon className='h-4 w-4' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary mb-1'>
              {stat.value}
            </div>
            <p className='text-xs text-muted-foreground'>{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
