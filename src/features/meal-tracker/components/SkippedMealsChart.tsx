'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatMealTypeName } from '../lib/utils';

interface SkippedMealsChartProps {
  skippedMealTypes: Array<{ type: string; skips: number }>;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--destructive))',
];

const chartConfig = {
  skips: {
    label: 'Times Skipped',
  },
};

export default function SkippedMealsChart({ skippedMealTypes }: SkippedMealsChartProps) {
  const chartData = skippedMealTypes.map((item, index) => ({
    name: formatMealTypeName(item.type),
    value: item.skips,
    fill: COLORS[index % COLORS.length],
  }));

  const totalSkips = skippedMealTypes.reduce((sum, item) => sum + item.skips, 0);

  if (totalSkips === 0) {
    return (
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2 text-primary'>
            🍩 Most Skipped Meals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <div className='text-4xl mb-2'>🎉</div>
            <p className='text-lg font-semibold text-green-600'>Perfect Adherence!</p>
            <p className='text-sm text-muted-foreground'>You haven't skipped any meals</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='shadow-lg'>
      <CardHeader>
        <CardTitle className='text-lg flex items-center gap-2 text-primary'>
          🍩 Most Skipped Meals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Pie Chart */}
          <div className='flex justify-center'>
            <ChartContainer config={chartConfig} className='h-64 w-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    dataKey='value'
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Legend and Stats */}
          <div className='space-y-3'>
            <h4 className='font-semibold text-foreground'>Breakdown</h4>
            {chartData.map((item, index) => (
              <div key={item.name} className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className='text-sm font-medium'>{item.name}</span>
                </div>
                <div className='text-sm text-muted-foreground'>
                  {item.value} times ({Math.round((item.value / totalSkips) * 100)}%)
                </div>
              </div>
            ))}
            <div className='pt-2 border-t border-border'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-semibold'>Total Skipped</span>
                <span className='text-sm font-semibold'>{totalSkips} meals</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}