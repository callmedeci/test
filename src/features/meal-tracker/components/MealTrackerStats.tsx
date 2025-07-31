'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react';
import { mockWeekData, calculateMealStats } from '../lib/mockData';

export default function MealTrackerStats() {
  // Calculate weekly stats
  const weeklyStats = mockWeekData.reduce((acc, dayData) => {
    const dayStats = calculateMealStats(dayData);
    return {
      totalPlannedCalories: acc.totalPlannedCalories + dayStats.totalPlannedCalories,
      totalConsumedCalories: acc.totalConsumedCalories + dayStats.totalConsumedCalories,
      mealsFollowed: acc.mealsFollowed + dayStats.mealsFollowed,
      totalMeals: acc.totalMeals + dayStats.totalMeals,
    };
  }, {
    totalPlannedCalories: 0,
    totalConsumedCalories: 0,
    mealsFollowed: 0,
    totalMeals: 0,
  });

  const weeklyAdherence = weeklyStats.totalMeals > 0 
    ? (weeklyStats.mealsFollowed / weeklyStats.totalMeals) * 100 
    : 0;

  const avgDailyCalories = weeklyStats.totalConsumedCalories / 7;
  const avgPlannedCalories = weeklyStats.totalPlannedCalories / 7;

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm flex items-center gap-2'>
            <Target className='h-4 w-4 text-primary' />
            Weekly Adherence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='text-2xl font-bold text-primary'>
              {weeklyAdherence.toFixed(0)}%
            </div>
            <Progress value={weeklyAdherence} className='h-2' />
            <p className='text-xs text-muted-foreground'>
              {weeklyStats.mealsFollowed} of {weeklyStats.totalMeals} meals followed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm flex items-center gap-2'>
            <Zap className='h-4 w-4 text-primary' />
            Avg Daily Calories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='text-2xl font-bold text-primary'>
              {avgDailyCalories.toFixed(0)}
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-muted-foreground'>Target:</span>
              <Badge variant='outline' className='text-xs'>
                {avgPlannedCalories.toFixed(0)} kcal
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm flex items-center gap-2'>
            <TrendingUp className='h-4 w-4 text-primary' />
            Weekly Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='text-2xl font-bold text-primary'>
              {weeklyAdherence >= 80 ? '📈' : weeklyAdherence >= 60 ? '📊' : '📉'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {weeklyAdherence >= 80 ? 'Excellent progress!' : 
               weeklyAdherence >= 60 ? 'Good consistency' : 
               'Room for improvement'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}