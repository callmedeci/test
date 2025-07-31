'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

// Mock weekly data for chart placeholder
const mockWeeklyData = [
  { day: 'Mon', planned: 2000, consumed: 1950 },
  { day: 'Tue', planned: 2000, consumed: 2100 },
  { day: 'Wed', planned: 2000, consumed: 1850 },
  { day: 'Thu', planned: 2000, consumed: 2000 },
  { day: 'Fri', planned: 2000, consumed: 1900 },
  { day: 'Sat', planned: 2000, consumed: 2200 },
  { day: 'Sun', planned: 2000, consumed: 1950 },
];

export default function WeeklyMealChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg flex items-center gap-2'>
          <BarChart3 className='h-5 w-5 text-primary' />
          Weekly Calorie Tracking
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Chart Placeholder - Ready for real chart integration */}
        <div className='h-64 bg-muted/30 rounded-md border-2 border-dashed border-muted-foreground/20 flex items-center justify-center'>
          <div className='text-center space-y-2'>
            <BarChart3 className='h-12 w-12 text-muted-foreground/50 mx-auto' />
            <p className='text-sm text-muted-foreground'>
              Weekly Calorie Chart
            </p>
            <p className='text-xs text-muted-foreground'>
              Planned vs Consumed Calories
            </p>
          </div>
        </div>
        
        {/* Mock Data Display */}
        <div className='mt-4 grid grid-cols-7 gap-1 text-xs'>
          {mockWeeklyData.map((day) => (
            <div key={day.day} className='text-center p-2 bg-muted/20 rounded'>
              <p className='font-medium'>{day.day}</p>
              <p className='text-green-600'>{day.planned}</p>
              <p className='text-blue-600'>{day.consumed}</p>
            </div>
          ))}
        </div>
        
        <div className='mt-2 flex justify-center gap-4 text-xs'>
          <div className='flex items-center gap-1'>
            <div className='w-3 h-3 bg-green-500 rounded'></div>
            <span>Planned</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-3 h-3 bg-blue-500 rounded'></div>
            <span>Consumed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}