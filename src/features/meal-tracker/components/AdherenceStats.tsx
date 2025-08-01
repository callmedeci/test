'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { calculateDayTotals, formatMealTypeName } from '../lib/utils';
import { MockMealTrackingData } from '../types';

interface AdherenceStatsProps {
  trackingData: MockMealTrackingData;
}

export default function AdherenceStats({ trackingData }: AdherenceStatsProps) {
  // Calculate adherence by meal type
  const mealTypeStats: Record<string, { followed: number; total: number }> = {};

  trackingData.forEach(day => {
    day.meals.forEach(meal => {
      if (!mealTypeStats[meal.type]) {
        mealTypeStats[meal.type] = { followed: 0, total: 0 };
      }
      mealTypeStats[meal.type].total++;
      if (meal.followed) {
        mealTypeStats[meal.type].followed++;
      }
    });
  });

  const mealTypeAdherence = Object.entries(mealTypeStats).map(([type, stats]) => ({
    type,
    adherence: Math.round((stats.followed / stats.total) * 100),
    followed: stats.followed,
    total: stats.total,
  }));

  // Calculate weekly averages
  const weeklyData = trackingData.map(day => {
    const totals = calculateDayTotals(day.meals);
    return {
      date: day.date,
      adherence: totals.adherencePercentage,
      calorieAccuracy: Math.round(
        100 - Math.abs(totals.consumedTotal - totals.targetTotal) / totals.targetTotal * 100
      ),
    };
  });

  const avgAdherence = Math.round(
    weeklyData.reduce((sum, day) => sum + day.adherence, 0) / weeklyData.length
  );

  const avgCalorieAccuracy = Math.round(
    weeklyData.reduce((sum, day) => sum + day.calorieAccuracy, 0) / weeklyData.length
  );

  return (
    <Card className='shadow-lg'>
      <CardHeader>
        <CardTitle className='text-lg flex items-center gap-2 text-primary'>
          🍽️ Meal Type Adherence Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Overall Averages */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='p-4 bg-primary/5 rounded-lg border border-primary/20'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>{avgAdherence}%</div>
              <div className='text-sm text-muted-foreground'>Average Meal Adherence</div>
            </div>
          </div>
          <div className='p-4 bg-chart-2/10 rounded-lg border border-chart-2/20'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-chart-2'>{avgCalorieAccuracy}%</div>
              <div className='text-sm text-muted-foreground'>Average Calorie Accuracy</div>
            </div>
          </div>
        </div>

        {/* Meal Type Breakdown */}
        <div className='space-y-4'>
          <h4 className='font-semibold text-foreground'>Adherence by Meal Type</h4>
          <div className='space-y-3'>
            {mealTypeAdherence
              .sort((a, b) => b.adherence - a.adherence)
              .map(({ type, adherence, followed, total }) => (
                <div key={type} className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium'>
                      {formatMealTypeName(type)}
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      {followed}/{total} ({adherence}%)
                    </span>
                  </div>
                  <Progress value={adherence} className='h-2' />
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}