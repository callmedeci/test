'use client';

import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { TrackedMeal } from '../types';
import { mockTrackedMeals } from '../lib/mockData';

export function useMealTracking() {
  const [trackedMeals, setTrackedMeals] = useState<TrackedMeal[]>(mockTrackedMeals);

  const getTrackedMealsForDate = useCallback((date: Date): TrackedMeal[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    return trackedMeals.filter(meal => meal.date === dateString);
  }, [trackedMeals]);

  const updateTrackedMeal = useCallback((data: Partial<TrackedMeal>) => {
    setTrackedMeals(prev => {
      const existingIndex = prev.findIndex(meal => 
        meal.id === data.id || 
        (meal.date === data.date && meal.mealType === data.mealType)
      );

      if (existingIndex >= 0) {
        // Update existing tracking
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...data } as TrackedMeal;
        return updated;
      } else {
        // Add new tracking
        return [...prev, data as TrackedMeal];
      }
    });
  }, []);

  const deleteTrackedMeal = useCallback((mealId: string) => {
    setTrackedMeals(prev => prev.filter(meal => meal.id !== mealId));
  }, []);

  return {
    trackedMeals,
    getTrackedMealsForDate,
    updateTrackedMeal,
    deleteTrackedMeal
  };
}