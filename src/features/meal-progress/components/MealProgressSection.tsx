'use client';

import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/SectionHeader';
import { Activity } from 'lucide-react';
import { useMealProgress } from '../hooks/useMealProgress';
import { CalorieSummary } from './CalorieSummary';
import { DatePicker } from './DatePicker';
import { MealProgressGrid } from './MealProgressGrid';
import { ProgressChart } from './ProgressChart';
import { TrackingStatus } from './TrackingStatus';

export function MealProgressSection() {
  const {
    selectedDate,
    setSelectedDate,
    plannedMeals,
    selectedDayProgress,
    chartData,
    dayTotals,
    dayStatuses,
    addOrUpdateProgress,
  } = useMealProgress();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="shadow-xl">
        <SectionHeader
          icon={<Activity className="h-8 w-8 text-primary" />}
          className="text-3xl font-bold"
          title="Meal Progress Tracking"
          description="Track your daily meals and compare them to your nutrition plan. See how well you're following your personalized meal schedule."
        />

        <CardContent className="space-y-6">
          {/* Date Picker */}
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            dayStatuses={dayStatuses}
          />

          {/* Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrackingStatus
              plannedMeals={plannedMeals}
              dayProgress={selectedDayProgress}
              selectedDate={selectedDate}
            />
            <CalorieSummary
              totalTarget={dayTotals.totalTarget}
              totalConsumed={dayTotals.totalConsumed}
              difference={dayTotals.difference}
              percentage={dayTotals.percentage}
            />
          </div>

          {/* Progress Chart */}
          <ProgressChart
            chartData={chartData}
            totalConsumed={dayTotals.totalConsumed}
            totalTarget={dayTotals.totalTarget}
          />

          {/* Meal Cards Grid */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">
              Track Your Meals
            </h3>
            <MealProgressGrid
              plannedMeals={plannedMeals}
              dayProgress={selectedDayProgress}
              selectedDate={selectedDate}
              onUpdateProgress={addOrUpdateProgress}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}