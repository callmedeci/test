'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatMealTypeName } from '../lib/utils';
import { MealEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface DailyCalorieChartProps {
  meals: MealEntry[];
  date: string;
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
};

export default function DailyCalorieChart({ meals, date }: DailyCalorieChartProps) {
  const chartData = meals.map(meal => ({
    meal: formatMealTypeName(meal.type),
    target: meal.target.calories,
    consumed: meal.consumed.calories,
  }));

  const totalTarget = meals.reduce((sum, meal) => sum + meal.target.calories, 0);
  const totalConsumed = meals.reduce((sum, meal) => sum + meal.consumed.calories, 0);
  const difference = totalConsumed - totalTarget;

  return (
    <Card className='shadow-lg'>
      <CardHeader>
        <CardTitle className='text-xl flex items-center gap-2 text-primary'>
          📊 Daily Calorie Comparison
        </CardTitle>
        <div className='grid grid-cols-3 gap-4 text-center'>
          <div className='p-3 bg-primary/10 rounded-lg'>
            <div className='text-2xl font-bold text-primary'>{totalTarget}</div>
            <div className='text-sm text-muted-foreground'>Target kcal</div>
          </div>
          <div className='p-3 bg-chart-2/10 rounded-lg'>
            <div className='text-2xl font-bold text-chart-2'>{totalConsumed}</div>
            <div className='text-sm text-muted-foreground'>Consumed kcal</div>
          </div>
          <div className={`p-3 rounded-lg ${difference >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className={`text-2xl font-bold ${difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {difference >= 0 ? '+' : ''}{difference}
            </div>
            <div className='text-sm text-muted-foreground'>Difference</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-64 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
              <XAxis 
                dataKey='meal' 
                className='text-xs'
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor='end'
                height={80}
              />
              <YAxis className='text-xs' tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey='target' 
                fill='var(--color-target)' 
                name='Target'
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey='consumed' 
                fill='var(--color-consumed)' 
                name='Consumed'
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}