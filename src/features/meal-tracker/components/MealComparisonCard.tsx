'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Utensils } from 'lucide-react';
import { MealType, PlannedMeal, TrackedMeal } from '../types';

interface MealComparisonCardProps {
  mealType: MealType;
  plannedMeal?: PlannedMeal;
  trackedMeal?: TrackedMeal;
}

export default function MealComparisonCard({
  mealType,
  plannedMeal,
  trackedMeal,
}: MealComparisonCardProps) {
  if (!trackedMeal || trackedMeal.followed) {
    return null; // Only show comparison for modified meals
  }

  return (
    <Card className='bg-orange-50 border-orange-200'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm flex items-center gap-2'>
          <Utensils className='h-4 w-4 text-orange-600' />
          Meal Comparison
        </CardTitle>
      </CardHeader>
      
      <CardContent className='space-y-3'>
        <div className='grid grid-cols-1 gap-3'>
          {/* Planned */}
          <div className='p-2 bg-background rounded border'>
            <div className='flex items-center justify-between mb-1'>
              <span className='text-xs font-medium text-muted-foreground'>PLANNED</span>
              <Badge variant='outline' size='sm'>
                {plannedMeal?.calories || 0} kcal
              </Badge>
            </div>
            <p className='text-sm'>{plannedMeal?.name || 'No meal planned'}</p>
          </div>

          {/* Arrow */}
          <div className='flex justify-center'>
            <ArrowRight className='h-4 w-4 text-muted-foreground' />
          </div>

          {/* Actual */}
          <div className='p-2 bg-background rounded border'>
            <div className='flex items-center justify-between mb-1'>
              <span className='text-xs font-medium text-muted-foreground'>ACTUAL</span>
              <Badge variant='outline' size='sm'>
                {trackedMeal.calories || 0} kcal
              </Badge>
            </div>
            <p className='text-sm'>{trackedMeal.consumedMeal}</p>
            {trackedMeal.quantity && (
              <p className='text-xs text-muted-foreground'>{trackedMeal.quantity}</p>
            )}
          </div>
        </div>

        {/* Calorie difference */}
        {plannedMeal && trackedMeal.calories && (
          <div className='text-center pt-2 border-t'>
            <p className='text-xs text-muted-foreground'>
              Calorie difference: 
              <span className={
                trackedMeal.calories > plannedMeal.calories 
                  ? 'text-red-600 font-medium' 
                  : trackedMeal.calories < plannedMeal.calories
                  ? 'text-green-600 font-medium'
                  : 'text-muted-foreground'
              }>
                {trackedMeal.calories > plannedMeal.calories ? '+' : ''}
                {trackedMeal.calories - plannedMeal.calories} kcal
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}