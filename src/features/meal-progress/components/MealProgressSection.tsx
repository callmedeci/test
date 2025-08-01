'use client';

import { useState } from 'react';
import { DatePicker } from './DatePicker';
import { MealProgressChart } from './MealProgressChart';
import { MealCard } from './MealCard';
import { TrackingModal } from './TrackingModal';
import { DailySummaryCard } from './DailySummaryCard';
import { getMealDataForDate, getChartDataForDate, getWeeklySummaryForDate } from '../lib/utils';
import { DailyMealData } from '../types';

export function MealProgressSection() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [editingMeal, setEditingMeal] = useState<string | null>(null);

  const mealData = getMealDataForDate(selectedDate);
  const chartData = getChartDataForDate(selectedDate);
  const summary = getWeeklySummaryForDate(selectedDate);

  const editingMealData = editingMeal 
    ? mealData.find(m => m.meal_type === editingMeal) || null
    : null;

  const handleEditMeal = (mealType: string) => {
    setEditingMeal(mealType);
  };

  const handleCloseModal = () => {
    setEditingMeal(null);
  };

  return (
    <div className="space-y-6">
      {/* Date Picker and Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DatePicker 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <div className="lg:col-span-2">
          <DailySummaryCard 
            summary={summary}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {/* Progress Chart */}
      <MealProgressChart 
        data={chartData}
        selectedDate={selectedDate}
      />

      {/* Meal Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-primary">Daily Meal Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealData.map((meal) => (
            <MealCard
              key={meal.meal_type}
              mealData={meal}
              selectedDate={selectedDate}
              onEditClick={handleEditMeal}
            />
          ))}
        </div>
      </div>

      {/* Tracking Modal */}
      <TrackingModal
        isOpen={!!editingMeal}
        onClose={handleCloseModal}
        mealData={editingMealData}
        selectedDate={selectedDate}
      />
    </div>
  );
}