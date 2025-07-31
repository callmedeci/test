import { Suspense } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import MealTrackerSection from '@/features/meal-tracker/components/MealTrackerSection';

export default function MealTrackerPage() {
  return (
    <Suspense fallback={<LoadingScreen loadingLabel='Loading meal tracker...' />}>
      <MealTrackerSection />
    </Suspense>
  );
}