'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TrendingUp, BarChart3 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Line,
  LineChart,
} from 'recharts';
import { WeeklyTracking } from '../types';

interface WeeklyChartProps {
  weekData: WeeklyTracking;
}

const chartConfig = {
  planned: {
    label: 'Planned Calories',
    color: 'hsl(var(--primary))',
  },
  actual: {
    label: 'Actual Calories',
    color: 'hsl(var(--chart-2))',
  },
  adherence: {
    label: 'Adherence %',
    color: 'hsl(var(--chart-3))',
  },
};

export function WeeklyChart({ weekData }: WeeklyChartProps) {
  const chartData = weekData.days.map((day) => ({
    day: day.day_of_week.substring(0, 3),
    planned: day.total_planned_calories,
    actual: day.total_actual_calories,
    adherence: Math.round((day.meals_followed / day.total_meals) * 100),
    difference: day.total_actual_calories - day.total_planned_calories,
  }));

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Calorie Comparison Chart */}
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2 text-primary'>
            <BarChart3 className='h-5 w-5' />
            Daily Calories: Planned vs Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-64 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis 
                  dataKey='day' 
                  className='text-xs'
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className='text-xs'
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => `${value}`}
                />
                <Bar 
                  dataKey='planned' 
                  fill='var(--color-planned)' 
                  radius={[2, 2, 0, 0]}
                  name='Planned'
                />
                <Bar 
                  dataKey='actual' 
                  fill='var(--color-actual)' 
                  radius={[2, 2, 0, 0]}
                  name='Actual'
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Adherence Trend Chart */}
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2 text-primary'>
            <TrendingUp className='h-5 w-5' />
            Daily Meal Plan Adherence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-64 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis 
                  dataKey='day' 
                  className='text-xs'
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  className='text-xs'
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => `${value}`}
                  formatter={(value) => [`${value}%`, 'Adherence']}
                />
                <Line
                  type='monotone'
                  dataKey='adherence'
                  stroke='var(--color-adherence)'
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-adherence)', strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: 'var(--color-adherence)',
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}