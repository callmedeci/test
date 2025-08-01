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
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
          <BarChart3 className="h-5 w-5" />
          Daily Calorie Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartDataWithTotal}
              margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis
                dataKey="meal_type"
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                className="text-xs fill-muted-foreground"
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
                radius={[0, 0, 6, 6]}
              />
              <Bar
                dataKey="consumed_calories"
                fill="var(--color-consumed_calories)"
                name="Consumed"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground font-medium">Target Calories</p>
            <p className="text-xl font-bold text-primary">{totalTarget}</p>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-sm text-muted-foreground font-medium">Consumed Calories</p>
            <p className="text-xl font-bold text-secondary">{totalConsumed}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}