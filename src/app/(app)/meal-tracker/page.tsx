import LoadingScreen from '@/components/ui/LoadingScreen';
import MealTracker from '@/features/meal-tracker/components/MealTracker';
import { Suspense } from 'react';

export default function MealTrackerPage() {
  return (
    <Suspense fallback={<LoadingScreen loadingLabel='Loading meal tracker...' />}>
      <MealTracker />
    </Suspense>
  );
}