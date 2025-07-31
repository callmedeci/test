'use client';

import { useState } from 'react';
import { format, startOfDay } from 'date-fns';
import { DateSelector } from './DateSelector';
import { MealTrackerGrid } from './MealTrackerGrid';
import { CalorieSummary } from './CalorieSummary';
import { TrackingStatus } from './TrackingStatus';
import { TrackedMeal, CalorieSummary as CalorieSummaryType, MealTrackingStatus } from '../types';
import { mockTrackedMeals, getMealTypeOrder, getPlannedMealForType, getTrackedMealsForDate } from '../lib/mockData';

export function MealTrackerSection() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [trackedMeals, setTrackedMeals] = useState<TrackedMeal[]>(mockTrackedMeals);

  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const dayTrackedMeals = getTrackedMealsForDate(dateString);

  const handleUpdateTracking = (data: Partial<TrackedMeal>) => {
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
  };

  // Calculate calorie summary
  const calculateCalorieSummary = (): CalorieSummaryType => {
    let plannedCalories = 0;
    let consumedCalories = 0;

    getMealTypeOrder().forEach(mealType => {
      const plannedMeal = getPlannedMealForType(mealType);
      const trackedMeal = dayTrackedMeals.find(meal => meal.mealType === mealType);

      if (plannedMeal?.total_calories) {
        plannedCalories += plannedMeal.total_calories;
      }

      if (trackedMeal) {
        if (trackedMeal.followed && plannedMeal?.total_calories) {
          consumedCalories += plannedMeal.total_calories;
        } else if (!trackedMeal.followed && trackedMeal.calories) {
          consumedCalories += trackedMeal.calories;
        }
      }
    });

    const difference = consumedCalories - plannedCalories;
    const percentage = plannedCalories > 0 ? (consumedCalories / plannedCalories) * 100 : 0;

    return {
      planned: plannedCalories,
      consumed: consumedCalories,
      difference,
      percentage
    };
  };

  // Calculate tracking status
  const calculateTrackingStatus = (): MealTrackingStatus => {
    const totalMeals = getMealTypeOrder().length;
    const trackedMealsCount = dayTrackedMeals.length;
    const followedMeals = dayTrackedMeals.filter(meal => meal.followed).length;
    
    // Calculate percentage based on tracked meals that followed the plan
    const percentage = trackedMealsCount > 0 ? (followedMeals / trackedMealsCount) * 100 : 0;

    return {
      totalMeals: trackedMealsCount,
      followedMeals,
      percentage
    };
  };

  const calorieSummary = calculateCalorieSummary();
  const trackingStatus = calculateTrackingStatus();

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <DateSelector 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrackingStatus 
          status={trackingStatus} 
          date={dateString} 
        />
        <CalorieSummary 
          summary={calorieSummary} 
          date={dateString} 
        />
      </div>

      {/* Meals Grid */}
      <MealTrackerGrid
        selectedDate={selectedDate}
        trackedMeals={dayTrackedMeals}
        onUpdateTracking={handleUpdateTracking}
      />
    </div>
  );
}