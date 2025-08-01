'use client';

import { useState } from 'react';
import { MockMealTrackingData, DailyMealTracking, MealEntry } from '../types';
import { formatDate } from '../lib/utils';
import DateSelector from './DateSelector';
import DailyCalorieChart from './DailyCalorieChart';
import MealCard from './MealCard';

interface PlanTabProps {
  trackingData: MockMealTrackingData;
}

export default function PlanTab({ trackingData }: PlanTabProps) {
  const availableDates = trackingData.map(day => day.date).sort();
  const [selectedDate, setSelectedDate] = useState(new Date(availableDates[availableDates.length - 1]));
  
  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const dayData = trackingData.find(day => day.date === selectedDateString);

  const [localDayData, setLocalDayData] = useState<DailyMealTracking | undefined>(dayData);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    const newDateString = newDate.toISOString().split('T')[0];
    const newDayData = trackingData.find(day => day.date === newDateString);
    setLocalDayData(newDayData);
  };

  const handleMealUpdate = (updatedMeal: MealEntry) => {
    if (!localDayData) return;

    const updatedMeals = localDayData.meals.map(meal =>
      meal.type === updatedMeal.type ? updatedMeal : meal
    );

    setLocalDayData({
      ...localDayData,
      meals: updatedMeals,
    });
  };

  if (!localDayData) {
    return (
      <div className='text-center py-8'>
        <p className='text-muted-foreground'>No meal data available for this date.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Date Selection */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-foreground'>
            {formatDate(selectedDateString)}
          </h2>
          <p className='text-muted-foreground'>Track your daily meal adherence</p>
        </div>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          availableDates={availableDates}
        />
      </div>

      {/* Daily Calorie Chart */}
      <DailyCalorieChart meals={localDayData.meals} date={selectedDateString} />

      {/* Meal Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {localDayData.meals.map((meal) => (
          <MealCard
            key={meal.type}
            meal={meal}
            onUpdate={handleMealUpdate}
          />
        ))}
      </div>
    </div>
  );
}