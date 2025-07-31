'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Utensils,
  Flame
} from 'lucide-react';
import { WeeklyTracking } from '../types';

interface WeeklySummaryCardProps {
  weekData: WeeklyTracking;
}

export function WeeklySummaryCard({ weekData }: WeeklySummaryCardProps) {
  const { weekly_summary } = weekData;
  const calorieDifference = weekly_summary.total_actual_calories - weekly_summary.total_planned_calories;
  const isOverCalories = calorieDifference > 0;

  return (
    <Card className='shadow-lg border-primary/20'>
      <CardHeader>
        <CardTitle className='text-xl flex items-center gap-2 text-primary'>
          <Target className='h-5 w-5' />
          Weekly Summary - {weekData.week_label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          {/* Adherence Rate */}
          <div className='text-center p-4 bg-primary/5 rounded-lg'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <CheckCircle className='h-4 w-4 text-primary' />
              <span className='text-sm font-medium text-muted-foreground'>Adherence Rate</span>
            </div>
            <div className='text-2xl font-bold text-primary'>
              {weekly_summary.adherence_percentage}%
            </div>
            <div className='text-xs text-muted-foreground'>
              {weekly_summary.total_meals_followed}/{weekly_summary.total_meals} meals
            </div>
          </div>

          {/* Planned Calories */}
          <div className='text-center p-4 bg-chart-1/10 rounded-lg'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <Target className='h-4 w-4 text-chart-1' />
              <span className='text-sm font-medium text-muted-foreground'>Planned</span>
            </div>
            <div className='text-2xl font-bold text-chart-1'>
              {weekly_summary.total_planned_calories.toLocaleString()}
            </div>
            <div className='text-xs text-muted-foreground'>calories</div>
          </div>

          {/* Actual Calories */}
          <div className='text-center p-4 bg-chart-2/10 rounded-lg'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <Flame className='h-4 w-4 text-chart-2' />
              <span className='text-sm font-medium text-muted-foreground'>Actual</span>
            </div>
            <div className='text-2xl font-bold text-chart-2'>
              {weekly_summary.total_actual_calories.toLocaleString()}
            </div>
            <div className='text-xs text-muted-foreground'>calories</div>
          </div>

          {/* Calorie Difference */}
          <div className={`text-center p-4 rounded-lg ${
            isOverCalories ? 'bg-destructive/10' : 'bg-green-100'
          }`}>
            <div className='flex items-center justify-center gap-2 mb-2'>
              {isOverCalories ? (
                <AlertTriangle className='h-4 w-4 text-destructive' />
              ) : (
                <TrendingUp className='h-4 w-4 text-green-600' />
              )}
              <span className='text-sm font-medium text-muted-foreground'>Difference</span>
            </div>
            <div className={`text-2xl font-bold ${
              isOverCalories ? 'text-destructive' : 'text-green-600'
            }`}>
              {isOverCalories ? '+' : ''}{calorieDifference.toLocaleString()}
            </div>
            <div className='text-xs text-muted-foreground'>calories</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className='space-y-4'>
          <div>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm font-medium'>Meal Plan Adherence</span>
              <Badge 
                variant={weekly_summary.adherence_percentage >= 80 ? 'default' : 'secondary'}
                className='text-xs'
              >
                {weekly_summary.adherence_percentage >= 80 ? 'Great!' : 'Keep Going!'}
              </Badge>
            </div>
            <Progress 
              value={weekly_summary.adherence_percentage} 
              className='h-3'
            />
          </div>

          <div>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm font-medium'>Calorie Target Progress</span>
              <span className='text-xs text-muted-foreground'>
                {((weekly_summary.total_actual_calories / weekly_summary.total_planned_calories) * 100).toFixed(0)}% of planned
              </span>
            </div>
            <Progress 
              value={Math.min(100, (weekly_summary.total_actual_calories / weekly_summary.total_planned_calories) * 100)}
              className='h-3'
            />
          </div>
        </div>

        {/* Quick Insights */}
        <div className='mt-6 p-4 bg-muted/50 rounded-lg'>
          <h4 className='font-medium text-sm mb-2 flex items-center gap-2'>
            <Utensils className='h-4 w-4' />
            Quick Insights
          </h4>
          <div className='text-sm text-muted-foreground space-y-1'>
            {weekly_summary.adherence_percentage >= 90 && (
              <p className='text-green-600'>🎉 Excellent adherence! You're crushing your meal plan!</p>
            )}
            {weekly_summary.adherence_percentage >= 70 && weekly_summary.adherence_percentage < 90 && (
              <p className='text-primary'>👍 Good job staying on track with most meals!</p>
            )}
            {weekly_summary.adherence_percentage < 70 && (
              <p className='text-amber-600'>💪 Room for improvement - try meal prepping for better adherence!</p>
            )}
            {Math.abs(calorieDifference) > 500 && (
              <p className='text-muted-foreground'>
                📊 {isOverCalories ? 'Consider' : 'Great job'} managing portion sizes this week.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}