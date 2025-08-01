'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { ProgressData, TimeRange } from '../types';

interface ProgressChartsProps {
  progressData: ProgressData[];
  timeRange: TimeRange;
}

const chartConfig = {
  target: {
    label: 'Target Calories',
    color: 'hsl(var(--primary))',
  },
  consumed: {
    label: 'Consumed Calories',
    color: 'hsl(var(--chart-2))',
  },
  adherence: {
    label: 'Adherence %',
    color: 'hsl(var(--chart-3))',
  },
};

export default function ProgressCharts({ progressData, timeRange }: ProgressChartsProps) {
  const chartData = progressData.map(data => ({
    ...data,
    formattedDate: format(new Date(data.date), timeRange === 'month' ? 'MMM dd' : 'MMM dd'),
  }));

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Calorie Tracking Chart */}
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2 text-primary'>
            📈 Calorie Tracking Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-64 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis 
                  dataKey='formattedDate' 
                  className='text-xs'
                  tick={{ fontSize: 12 }}
                />
                <YAxis className='text-xs' tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type='monotone'
                  dataKey='targetCalories'
                  stroke='var(--color-target)'
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-target)', strokeWidth: 2, r: 4 }}
                  name='Target'
                />
                <Line
                  type='monotone'
                  dataKey='consumedCalories'
                  stroke='var(--color-consumed)'
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-consumed)', strokeWidth: 2, r: 4 }}
                  name='Consumed'
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Adherence Trend Chart */}
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2 text-primary'>
            🎯 Adherence Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-64 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis 
                  dataKey='formattedDate' 
                  className='text-xs'
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className='text-xs' 
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`${value}%`, 'Adherence']}
                />
                <Line
                  type='monotone'
                  dataKey='adherencePercentage'
                  stroke='var(--color-adherence)'
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-adherence)', strokeWidth: 2, r: 5 }}
                  name='Adherence %'
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}