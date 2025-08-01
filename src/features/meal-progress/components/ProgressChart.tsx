'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart3 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartData } from '../types';

interface ProgressChartProps {
  chartData: ChartData[];
  totalConsumed: number;
  totalTarget: number;
}

const chartConfig = {
  consumed_calories: {
    label: 'Consumed',
    color: 'hsl(var(--primary))',
  },
  target_calories: {
    label: 'Target',
    color: 'hsl(var(--muted-foreground))',
  },
};

export function ProgressChart({ chartData, totalConsumed, totalTarget }: ProgressChartProps) {
  // Add total row to chart data
  const chartDataWithTotal = [
    ...chartData,
    {
      meal_type: 'Total',
      consumed_calories: totalConsumed,
      target_calories: totalTarget,
    },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <BarChart3 className="h-5 w-5" />
          Daily Calorie Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartDataWithTotal}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="meal_type"
                className="text-xs"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                className="text-xs"
                tick={{ fontSize: 11 }}
                label={{ value: 'Calories', angle: -90, position: 'insideLeft' }}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `${value}`}
              />
              <Bar
                dataKey="target_calories"
                fill="var(--color-target_calories)"
                name="Target"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="consumed_calories"
                fill="var(--color-consumed_calories)"
                name="Consumed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Target Calories</p>
            <p className="text-xl font-bold text-primary">{totalTarget}</p>
          </div>
          <div className="p-3 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Consumed Calories</p>
            <p className="text-xl font-bold text-secondary">{totalConsumed}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}