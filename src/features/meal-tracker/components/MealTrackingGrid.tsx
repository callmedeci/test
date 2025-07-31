'use client';

import { mealNames } from '@/lib/constants';
import { DayMealData, MealType } from '../types';
import MealTrackingCard from './MealTrackingCard';

interface MealTrackingGridProps {
  dayData: DayMealData;
}

export default function MealTrackingGrid({ dayData }: MealTrackingGridProps) {
  const today = new Date().toISOString().split('T')[0];
  const isToday = dayData.date === today;
  const isFuture = dayData.date > today;

  return (
    <div className='space-y-4'>
      <h3 className='text-xl font-semibold text-primary'>
        Meals for {isToday ? 'Today' : new Date(dayData.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })}
      </h3>
      
      <div className='grid gap-4'>
        {mealNames.map((mealName) => {
          const plannedMeal = dayData.plannedMeals.find(
            p => p.mealType === mealName
          );
          const trackedMeal = dayData.trackedMeals.find(
            t => t.mealType === mealName
          );

          return (
            <MealTrackingCard
              key={mealName}
              mealType={mealName as MealType}
              plannedMeal={plannedMeal}
              trackedMeal={trackedMeal}
              date={dayData.date}
              disabled={isFuture}
            />
          );
        })}
      </div>
    </div>
  );
}