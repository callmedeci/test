import { Card } from '@/components/ui/card';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { MealProgressSection } from '@/features/meal-progress/components/MealProgressSection';
import { Suspense } from 'react';

export default function MealProgressPage() {
  return (
    <div className='container mx-auto py-8'>
      <Suspense fallback={<LoadingScreen loadingLabel='Loading meal progress...' />}>
        <MealProgressSection />
      </Suspense>
    </div>
  );
}