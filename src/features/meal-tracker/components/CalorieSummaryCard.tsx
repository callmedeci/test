'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { DayMealData } from '../types';
import { calculateMealStats } from '../lib/mockData';

interface CalorieSummaryCardProps {
  dayData: DayMealData;
}

export default function CalorieSummaryCard({ dayData }: CalorieSummaryCardProps) {
  const stats = calculateMealStats(dayData);
  
  const calorieProgress = stats.totalPlannedCalories > 0 
    ? (stats.totalConsumedCalories / stats.totalPlannedCalories) * 100 
    : 0;

  const isOverTarget = stats.caloriesDifference > 0;
  const isUnderTarget = stats.caloriesDifference < 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Zap className='h-5 w-5 text-primary' />
          Calorie Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className='space-y-4'>
        {/* Calorie Progress Bar */}
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>Consumed</span>
            <span>{stats.totalConsumedCalories} / {stats.totalPlannedCalories} kcal</span>
          </div>
          <Progress 
            value={Math.min(calorieProgress, 100)} 
            className={cn(
              'h-3',
              calorieProgress > 110 && 'bg-red-100',
              calorieProgress < 80 && 'bg-orange-100'
            )}
          />
          <p className='text-xs text-muted-foreground text-center'>
            {calorieProgress.toFixed(0)}% of planned calories
          </p>
        </div>

        {/* Calorie Difference */}
        <div className='p-3 rounded-md border bg-muted/30'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Difference:</span>
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              isOverTarget && 'text-red-600',
              isUnderTarget && 'text-orange-600',
              !isOverTarget && !isUnderTarget && 'text-green-600'
            )}>
              {isOverTarget && <TrendingUp className='h-4 w-4' />}
              {isUnderTarget && <TrendingDown className='h-4 w-4' />}
              {!isOverTarget && !isUnderTarget && <Zap className='h-4 w-4' />}
              
              {stats.caloriesDifference === 0 ? (
                'Perfect!'
              ) : (
                `${Math.abs(stats.caloriesDifference)} kcal ${isOverTarget ? 'over' : 'under'}`
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-2 gap-3 text-center'>
          <div className='p-2 bg-primary/5 rounded-md'>
            <p className='text-lg font-bold text-primary'>{stats.totalPlannedCalories}</p>
            <p className='text-xs text-muted-foreground'>Planned</p>
          </div>
          <div className='p-2 bg-secondary/5 rounded-md'>
            <p className='text-lg font-bold text-secondary-foreground'>{stats.totalConsumedCalories}</p>
            <p className='text-xs text-muted-foreground'>Consumed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}