'use client';

import { useState, useMemo } from 'react';
import { MealProgress, PlannedMeal, MealType } from '../types';
import { mockMealProgress, mockPlannedMeals, generateMockDayStatuses } from '../lib/mockData';
import { getMealProgressForDate, generateChartData, calculateDayTotals } from '../lib/utils';

export function useMealProgress() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [mealProgress, setMealProgress] = useState<MealProgress[]>(mockMealProgress);
  const [plannedMeals] = useState<PlannedMeal[]>(mockPlannedMeals);

  const dayStatuses = useMemo(() => generateMockDayStatuses(), []);

  const selectedDayProgress = useMemo(() => 
    getMealProgressForDate(mealProgress, selectedDate),
    [mealProgress, selectedDate]
  );

  const chartData = useMemo(() => 
    generateChartData(plannedMeals, selectedDayProgress),
    [plannedMeals, selectedDayProgress]
  );

  const dayTotals = useMemo(() => 
    calculateDayTotals(plannedMeals, selectedDayProgress),
    [plannedMeals, selectedDayProgress]
  );

  const addOrUpdateProgress = (newProgress: Omit<MealProgress, 'id' | 'user_id'>) => {
    const existingIndex = mealProgress.findIndex(
      p => p.date === newProgress.date && p.meal_type === newProgress.meal_type
    );

    if (existingIndex >= 0) {
      // Update existing
      const updated = [...mealProgress];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...newProgress,
      };
      setMealProgress(updated);
    } else {
      // Add new
      const newEntry: MealProgress = {
        id: `progress-${Date.now()}`,
        user_id: 'user-1',
        ...newProgress,
      };
      setMealProgress([...mealProgress, newEntry]);
    }
  };

  const getMealProgressByType = (mealType: MealType): MealProgress | undefined => {
    return selectedDayProgress.find(p => p.meal_type === mealType);
  };

  const getPlannedMealByType = (mealType: MealType): PlannedMeal | undefined => {
    return plannedMeals.find(meal => meal.meal_type === mealType);
  };

  return {
    selectedDate,
    setSelectedDate,
    plannedMeals,
    selectedDayProgress,
    chartData,
    dayTotals,
    dayStatuses,
    addOrUpdateProgress,
    getMealProgressByType,
    getPlannedMealByType,
  };
}