'use client';

import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/SectionHeader';
import { CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { ViewMode } from '../types';
import { mockWeekData } from '../lib/mockData';
import DateSelector from './DateSelector';
import MealTrackingGrid from './MealTrackingGrid';
import CalorieSummaryCard from './CalorieSummaryCard';
import ProgressOverviewCard from './ProgressOverviewCard';
import WeeklyMealChart from './WeeklyMealChart';
import MealTimelineView from './MealTimelineView';

export default function MealTrackerSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const selectedDayData = mockWeekData.find(d => d.date === selectedDate) || mockWeekData[mockWeekData.length - 1];

  return (
    <div className='container mx-auto py-8 space-y-6'>
      <Card className='shadow-xl'>
        <SectionHeader
          icon={<CalendarDays className='h-8 w-8 text-primary' />}
          className='text-3xl font-bold'
          title='Meal Tracker'
          description='Track your daily meals and see how well you're following your nutrition plan.'
        />

        <CardContent className='space-y-6'>
          <DateSelector
            viewMode={viewMode}
            selectedDate={selectedDate}
            onViewModeChange={setViewMode}
            onDateChange={setSelectedDate}
          />

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              {viewMode === 'day' ? (
                <>
                  <MealTrackingGrid dayData={selectedDayData} />
                  <MealTimelineView dayData={selectedDayData} />
                </>
              ) : (
                <div className='space-y-4'>
                  <h3 className='text-xl font-semibold text-primary'>Weekly Overview</h3>
                  <div className='grid gap-4'>
                    {mockWeekData.slice(-7).map((dayData) => (
                      <Card key={dayData.date} className='p-4'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <h4 className='font-medium'>
                              {new Date(dayData.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </h4>
                            <p className='text-sm text-muted-foreground'>
                              {dayData.trackedMeals.filter(t => t.followed).length} / {dayData.plannedMeals.length} meals followed
                            </p>
                          </div>
                          <div className='flex gap-2'>
                            {dayData.plannedMeals.map((meal) => {
                              const tracked = dayData.trackedMeals.find(t => t.mealType === meal.mealType);
                              return (
                                <div
                                  key={meal.mealType}
                                  className={cn(
                                    'w-3 h-3 rounded-full',
                                    tracked?.followed && 'bg-green-500',
                                    tracked && !tracked.followed && 'bg-orange-500',
                                    !tracked && 'bg-muted-foreground/30'
                                  )}
                                  title={meal.mealType}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className='space-y-6'>
              <CalorieSummaryCard dayData={selectedDayData} />
              <ProgressOverviewCard dayData={selectedDayData} />
              {viewMode === 'week' && <WeeklyMealChart />}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
  )
}