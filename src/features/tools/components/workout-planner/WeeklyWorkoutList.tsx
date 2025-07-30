import { Card } from '@/components/ui/card';
import WorkoutDayDetails from '@/features/tools/components/workout-planner/WorkoutDayDetails';
import WorkoutDayHeader from '@/features/tools/components/workout-planner/WorkoutDayHeader';

type WeeklyWorkoutListProps = {
  generatedPlan: any;
  expandedDays: any;
  onClick: (value: string) => void;
};

function WeeklyWorkoutList({
  generatedPlan,
  expandedDays,
  onClick,
}: WeeklyWorkoutListProps) {
  return (
    <div className='space-y-6'>
      {generatedPlan.weeklyPlan &&
        Object.entries(generatedPlan.weeklyPlan).map(
          ([dayKey, dayPlan]: [string, any]) => (
            <Card
              key={dayKey}
              className='border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden'
            >
              <WorkoutDayHeader
                expandedDays={expandedDays}
                dayPlan={dayPlan}
                dayKey={dayKey}
                handleClick={onClick}
              />

              {expandedDays[dayKey] && (
                <WorkoutDayDetails dayPlan={dayPlan} dayKey={dayKey} />
              )}
            </Card>
          )
        )}
    </div>
  );
}

export default WeeklyWorkoutList;
