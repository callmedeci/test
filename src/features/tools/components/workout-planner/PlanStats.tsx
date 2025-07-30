import { CardContent } from '@/components/ui/card';

function PlanStats({ generatedPlan }: { generatedPlan: any }) {
  return (
    <CardContent>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='text-center space-y-2'>
          <div className='text-3xl font-bold text-blue-600'>
            {generatedPlan.weeklyPlan
              ? Object.keys(generatedPlan.weeklyPlan).length
              : 0}
          </div>
          <p className='text-blue-700 font-medium'>Workout Days</p>
        </div>
        <div className='text-center space-y-2'>
          <div className='text-3xl font-bold text-green-600'>
            {generatedPlan.weeklyPlan
              ? Object.values(generatedPlan.weeklyPlan).reduce(
                  (total: number, day: any) => total + (day.duration || 0),
                  0
                )
              : 0}
          </div>
          <p className='text-green-700 font-medium'>Total Minutes</p>
        </div>
        <div className='text-center space-y-2'>
          <div className='text-3xl font-bold text-purple-600'>
            {generatedPlan.weeklyPlan &&
            Object.keys(generatedPlan.weeklyPlan).length > 0
              ? Math.round(
                  Object.values(generatedPlan.weeklyPlan).reduce(
                    (total: number, day: any) => total + (day.duration || 0),
                    0
                  ) / Object.keys(generatedPlan.weeklyPlan).length
                )
              : 0}
          </div>
          <p className='text-purple-700 font-medium'>Avg Session</p>
        </div>
      </div>
    </CardContent>
  );
}

export default PlanStats;
