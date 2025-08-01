'use client';

import { useState } from 'react';
import { MealProgress, MealType, PlannedMeal } from '../types';
import { MealCard } from './MealCard';
import { TrackMealModal } from './TrackMealModal';

interface MealProgressGridProps {
  plannedMeals: PlannedMeal[];
  dayProgress: MealProgress[];
  selectedDate: string;
  onUpdateProgress: (data: Omit<MealProgress, 'id' | 'user_id'>) => void;
}

const mealTypes: MealType[] = [
  'breakfast',
  'morningSnack', 
  'lunch',
  'afternoonSnack',
  'dinner',
  'eveningSnack'
];

export function MealProgressGrid({
  plannedMeals,
  dayProgress,
  selectedDate,
  onUpdateProgress,
}: MealProgressGridProps) {
  const [trackingMeal, setTrackingMeal] = useState<MealType | null>(null);

  const getPlannedMeal = (mealType: MealType) => {
    return plannedMeals.find(meal => meal.meal_type === mealType);
  };

  const getMealProgress = (mealType: MealType) => {
    return dayProgress.find(progress => progress.meal_type === mealType);
  };

  const handleTrackMeal = (mealType: MealType) => {
    setTrackingMeal(mealType);
  };

  const handleCloseModal = () => {
    setTrackingMeal(null);
  };

  const handleSaveProgress = (data: Omit<MealProgress, 'id' | 'user_id'>) => {
    onUpdateProgress(data);
    setTrackingMeal(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mealTypes.map((mealType) => (
          <MealCard
            key={mealType}
            mealType={mealType}
            plannedMeal={getPlannedMeal(mealType)}
            progress={getMealProgress(mealType)}
            selectedDate={selectedDate}
            onTrackMeal={handleTrackMeal}
          />
        ))}
      </div>

      {/* Track Meal Modal */}
      {trackingMeal && (
        <TrackMealModal
          isOpen={!!trackingMeal}
          onClose={handleCloseModal}
          mealType={trackingMeal}
          plannedMeal={getPlannedMeal(trackingMeal)}
          existingProgress={getMealProgress(trackingMeal)}
          selectedDate={selectedDate}
          onSave={handleSaveProgress}
        />
      )}
    </>
  );
}