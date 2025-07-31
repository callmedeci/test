'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { DayMealData, MealType } from '../types';
import MealStatusIndicator from './MealStatusIndicator';

interface MealTimelineViewProps {
  dayData: DayMealData;
}

const mealTimes = {
  'Breakfast': '8:00 AM',
  'Morning Snack': '10:30 AM',
  'Lunch': '12:30 PM',
  'Afternoon Snack': '3:00 PM',
  'Dinner': '6:30 PM',
  'Evening Snack': '8:30 PM',
};

export default function MealTimelineView({ dayData }: MealTimelineViewProps) {
  const today = new Date().toISOString().split('T')[0];
  const isToday = dayData.date === today;

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-primary flex items-center gap-2'>
            <Clock className='h-5 w-5' />
            Meal Timeline
          </h3>
          
          <div className='relative'>
            {/* Timeline line */}
            <div className='absolute left-6 top-0 bottom-0 w-0.5 bg-border'></div>
            
            <div className='space-y-6'>
              {Object.entries(mealTimes).map(([mealType, time], index) => {
                const plannedMeal = dayData.plannedMeals.find(
                  p => p.mealType === mealType as MealType
                );
                const trackedMeal = dayData.trackedMeals.find(
                  t => t.mealType === mealType as MealType
                );

                return (
                  <div key={mealType} className='relative flex items-start gap-4'>
                    {/* Timeline dot */}
                    <div className={cn(
                      'relative z-10 w-3 h-3 rounded-full border-2 bg-background',
                      trackedMeal?.followed && 'border-green-500 bg-green-500',
                      trackedMeal && !trackedMeal.followed && 'border-orange-500 bg-orange-500',
                      !trackedMeal && 'border-muted-foreground'
                    )}></div>
                    
                    {/* Meal content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-2'>
                        <div>
                          <h4 className='font-medium text-sm'>{mealType}</h4>
                          <p className='text-xs text-muted-foreground'>{time}</p>
                        </div>
                        <MealStatusIndicator trackedMeal={trackedMeal} size='sm' />
                      </div>
                      
                      <div className='text-xs space-y-1'>
                        {plannedMeal && (
                          <p className='text-muted-foreground'>
                            Planned: {plannedMeal.name} ({plannedMeal.calories} kcal)
                          </p>
                        )}
                        
                        {trackedMeal && !trackedMeal.followed && (
                          <p className='text-foreground'>
                            Had: {trackedMeal.consumedMeal} ({trackedMeal.calories} kcal)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}