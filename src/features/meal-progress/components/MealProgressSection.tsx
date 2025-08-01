'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className='max-w-7xl mx-auto space-y-6'>
      <Card className='shadow-xl'>
        <SectionHeader
          icon={<Activity className='h-8 w-8 text-primary' />}
          className='text-2xl font-bold'
          title='Meal Progress Tracking'
          description="Track your daily meals and compare them to your nutrition plan. See how well you're following your personalized meal schedule."
        />

        <CardContent className='space-y-8'>
          {/* Date Picker */}
          <Card className='border-border/50'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-lg font-semibold text-primary'>
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                dayStatuses={dayStatuses}
              />
            </CardContent>
          </Card>

          {/* Status Overview */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
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
          <Card className='border-border/50'>
            <CardHeader>
              <CardTitle className='text-xl font-semibold text-primary'>
                Track Your Meals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MealProgressGrid
                plannedMeals={plannedMeals}
                dayProgress={selectedDayProgress}
                selectedDate={selectedDate}
                onUpdateProgress={addOrUpdateProgress}
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
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
