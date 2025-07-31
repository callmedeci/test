'use client';

import { useState } from 'react';
import { format, isToday, isBefore, startOfDay } from 'date-fns';
import { MealCard } from './MealCard';
import { TrackMealModal } from './TrackMealModal';
import { TrackedMeal, MealType, PlannedMeal } from '../types';
import { getMealTypeOrder, getPlannedMealForType, getTrackedMealForDateAndType } from '../lib/mockData';

interface MealTrackerGridProps {
  selectedDate: Date;
  trackedMeals: TrackedMeal[];
  onUpdateTracking: (data: Partial<TrackedMeal>) => void;
}

export function MealTrackerGrid({ 
  selectedDate, 
  trackedMeals, 
  onUpdateTracking 
}: MealTrackerGridProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mealType?: MealType;
    existingTracking?: TrackedMeal;
  }>({
    isOpen: false,
  });

  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const isSelectedDateToday = isToday(selectedDate);
  const isSelectedDatePast = isBefore(selectedDate, startOfDay(new Date()));

  const handleAddTracking = (mealType: MealType) => {
    setModalState({
      isOpen: true,
      mealType,
      existingTracking: undefined,
    });
  };

  const handleEditTracking = (trackedMeal: TrackedMeal) => {
    setModalState({
      isOpen: true,
      mealType: trackedMeal.mealType,
      existingTracking: trackedMeal,
    });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false });
  };

  const handleSaveTracking = (data: Partial<TrackedMeal>) => {
    onUpdateTracking(data);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getMealTypeOrder().map((mealType) => {
          const plannedMeal = getPlannedMealForType(mealType);
          const trackedMeal = getTrackedMealForDateAndType(dateString, mealType);

          return (
            <MealCard
              key={mealType}
              mealType={mealType}
              plannedMeal={plannedMeal}
              trackedMeal={trackedMeal}
              onAddTracking={handleAddTracking}
              onEditTracking={handleEditTracking}
              isToday={isSelectedDateToday}
              isPast={isSelectedDatePast}
            />
          );
        })}
      </div>

      {modalState.isOpen && modalState.mealType && (
        <TrackMealModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          mealType={modalState.mealType}
          existingTracking={modalState.existingTracking}
          date={dateString}
          onSave={handleSaveTracking}
        />
      )}
    </>
  );
}