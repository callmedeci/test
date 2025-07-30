import { Card, CardContent } from '@/components/ui/card';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SectionHeader from '@/components/ui/SectionHeader';
import WorkoutPlannerSection from '@/features/tools/components/workout-planner/WorkoutPlannerSection';
import { Dumbbell } from 'lucide-react';
import { Suspense } from 'react';

export default function WorkoutPlannerPage() {
  return (
    <div className='container mx-auto py-8 space-y-6'>
      <Card className='shadow-xl'>
        <SectionHeader
          className='text-3xl font-bold'
          title='AI Exercise Planner'
          description='Create personalized workout plans powered by AI, tailored to your fitness level, goals, and preferences.'
          icon={<Dumbbell className='h-8 w-8 text-primary' />}
        />
        <CardContent>
          <Suspense fallback={<LoadingScreen loadingLabel='Loading your fitness profile...' />}>
            <WorkoutPlannerSection />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}