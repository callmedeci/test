'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { MockMealTrackingData, TimeRange } from '../types';
import {
  calculateOverallAdherence,
  generateProgressData,
  getMostSkippedMealTypes,
} from '../lib/utils';
import ProgressCharts from './ProgressCharts';
import AdherenceStats from './AdherenceStats';
import SkippedMealsChart from './SkippedMealsChart';

interface ProgressTabProps {
  trackingData: MockMealTrackingData;
}

export default function ProgressTab({ trackingData }: ProgressTabProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const progressData = generateProgressData(trackingData, timeRange);
  const overallAdherence = calculateOverallAdherence(trackingData);
  const skippedMealTypes = getMostSkippedMealTypes(trackingData);

  return (
    <div className='space-y-6'>
      {/* Header with Time Range Selector */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-foreground'>Progress Analytics</h2>
          <p className='text-muted-foreground'>Track your meal adherence over time</p>
        </div>
        
        <div className='flex items-center gap-2'>
          <label className='text-sm font-medium'>Time Range:</label>
          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='day'>Last 7 Days</SelectItem>
              <SelectItem value='week'>Last 4 Weeks</SelectItem>
              <SelectItem value='month'>Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overall Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Overall Adherence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>{overallAdherence}%</div>
            <p className='text-xs text-muted-foreground'>of meals followed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Days Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>{trackingData.length}</div>
            <p className='text-xs text-muted-foreground'>total days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Most Skipped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>
              {skippedMealTypes[0]?.type || 'None'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {skippedMealTypes[0]?.skips || 0} times skipped
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <ProgressCharts progressData={progressData} timeRange={timeRange} />

      {/* Adherence Stats */}
      <AdherenceStats trackingData={trackingData} />

      {/* Skipped Meals Analysis */}
      <SkippedMealsChart skippedMealTypes={skippedMealTypes} />
    </div>
  );
}