'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ChartData } from '../types';
import { formatMealType } from '../lib/utils';

interface MealProgressChartProps {
  data: ChartData[];
  selectedDate: string;
}

const chartConfig = {
  target_calories: {
    label: 'Target Calories',
    color: 'hsl(var(--primary))',
  },
  consumed_calories: {
    label: 'Consumed Calories', 
    color: 'hsl(var(--chart-2))',
  },
};

export function MealProgressChart({ data, selectedDate }: MealProgressChartProps) {
  const chartData = data.map(item => ({
    meal: formatMealType(item.meal_type),
    target: item.target_calories,
    consumed: item.consumed_calories,
  }));

  // Add total summary bar
  const totalTarget = data.reduce((sum, item) => sum + item.target_calories, 0);
  const totalConsumed = data.reduce((sum, item) => sum + item.consumed_calories, 0);
  
  chartData.push({
    meal: 'Total',
    target: totalTarget,
    consumed: totalConsumed,
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <TrendingUp className="h-5 w-5" />
          Daily Meal Progress - {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="meal" 
                className="text-xs"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="target" 
                fill="var(--color-target_calories)" 
                name="Target"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="consumed" 
                fill="var(--color-consumed_calories)" 
                name="Consumed"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span>Target Calories</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-chart-2 rounded"></div>
            <span>Consumed Calories</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}