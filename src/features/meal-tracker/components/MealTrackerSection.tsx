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
            <div className='lg:col-span-2'>
              <MealTrackingGrid dayData={selectedDayData} />
            </div>
            
            <div className='space-y-6'>
              <CalorieSummaryCard dayData={selectedDayData} />
              <ProgressOverviewCard dayData={selectedDayData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
  )
}