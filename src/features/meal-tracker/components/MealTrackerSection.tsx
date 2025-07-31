'use client';

import { useState } from 'react';
import { WeekSelector } from './WeekSelector';
import { WeeklySummaryCard } from './WeeklySummaryCard';
import { WeeklyChart } from './WeeklyChart';
import { DailyMealTrackingTable } from './DailyMealTrackingTable';
import { EditMealModal } from './EditMealModal';
import { getAvailableWeeks, getWeeklyTrackingData } from '../lib/mockData';
import { TrackedMeal } from '../types';

export function MealTrackerSection() {
  const availableWeeks = getAvailableWeeks();
  const [selectedWeek, setSelectedWeek] = useState(availableWeeks[0]?.value || '');
  const [editingMeal, setEditingMeal] = useState<{
    meal: TrackedMeal;
    dayName: string;
  } | null>(null);

  const weekData = getWeeklyTrackingData(selectedWeek);

  const handleEditMeal = (dayIndex: number, mealIndex: number) => {
    if (!weekData) return;
    
    const day = weekData.days[dayIndex];
    const meal = day?.meals[mealIndex];
    
    if (meal && day) {
      setEditingMeal({
        meal,
        dayName: day.day_of_week,
      });
    }
  };

  const handleCloseModal = () => {
    setEditingMeal(null);
  };

  if (!weekData) {
    return (
      <div className='text-center py-8'>
        <p className='text-muted-foreground'>No tracking data available for the selected week.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Week Selector */}
      <WeekSelector
        weeks={availableWeeks}
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
      />

      {/* Weekly Summary */}
      <WeeklySummaryCard weekData={weekData} />

      {/* Charts */}
      <WeeklyChart weekData={weekData} />

      {/* Daily Tracking Table */}
      <DailyMealTrackingTable
        dailyData={weekData.days}
        onEditMeal={handleEditMeal}
      />

      {/* Edit Meal Modal */}
      <EditMealModal
        isOpen={!!editingMeal}
        onClose={handleCloseModal}
        meal={editingMeal?.meal || null}
        dayName={editingMeal?.dayName || ''}
      />
    </div>
  );
}