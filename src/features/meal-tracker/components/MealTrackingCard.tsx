'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Edit, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { MealType, PlannedMeal, TrackedMeal } from '../types';
import TrackMealModal from './TrackMealModal';
import MealComparisonCard from './MealComparisonCard';

interface MealTrackingCardProps {
  mealType: MealType;
  plannedMeal?: PlannedMeal;
  trackedMeal?: TrackedMeal;
  date: string;
  disabled?: boolean;
}

export default function MealTrackingCard({
  mealType,
  plannedMeal,
  trackedMeal,
  date,
  disabled = false,
}: MealTrackingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusInfo = () => {
    if (!trackedMeal) {
      return {
        status: 'missing',
        badge: <Badge variant='outline' className='text-muted-foreground'>Not Tracked</Badge>,
        icon: null,
        bgColor: 'bg-muted/20',
      };
    }

    if (trackedMeal.followed) {
      return {
        status: 'followed',
        badge: <Badge className='bg-green-100 text-green-800 border-green-200'>Followed Plan</Badge>,
        icon: <Check className='h-4 w-4 text-green-600' />,
        bgColor: 'bg-green-50 border-green-200',
      };
    }

    return {
      status: 'not-followed',
      badge: <Badge variant='outline' className='bg-orange-100 text-orange-800 border-orange-200'>Different Meal</Badge>,
      icon: <X className='h-4 w-4 text-orange-600' />,
      bgColor: 'bg-orange-50 border-orange-200',
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <Card className={cn('transition-colors', statusInfo.bgColor)}>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg font-medium'>{mealType}</CardTitle>
            <div className='flex items-center gap-2'>
              {statusInfo.icon}
              {statusInfo.badge}
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Planned Meal */}
          <div className='space-y-2'>
            <h4 className='text-sm font-medium text-muted-foreground'>Planned Meal:</h4>
            {plannedMeal ? (
              <div className='p-3 bg-background rounded-md border'>
                <p className='font-medium text-sm'>{plannedMeal.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {plannedMeal.calories} kcal • {plannedMeal.protein}g protein • {plannedMeal.carbs}g carbs • {plannedMeal.fat}g fat
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  {plannedMeal.ingredients.join(', ')}
                </p>
              </div>
            ) : (
              <p className='text-sm text-muted-foreground italic'>No meal planned</p>
            )}
          </div>

          {/* Tracked Meal */}
          {trackedMeal && (
            <div className='space-y-2'>
              <h4 className='text-sm font-medium text-muted-foreground'>What You Had:</h4>
              <div className='p-3 bg-background rounded-md border'>
                {trackedMeal.followed ? (
                  <p className='text-sm font-medium text-green-700'>Followed the planned meal</p>
                ) : (
                  <>
                    <p className='font-medium text-sm'>{trackedMeal.consumedMeal}</p>
                    <p className='text-xs text-muted-foreground'>
                      {trackedMeal.quantity} • {trackedMeal.calories} kcal
                    </p>
                    {trackedMeal.notes && (
                      <p className='text-xs text-muted-foreground mt-1 italic'>
                        "{trackedMeal.notes}"
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className='pt-2'>
            <Button
              variant={trackedMeal ? 'outline' : 'default'}
              size='sm'
              onClick={() => setIsModalOpen(true)}
              disabled={disabled}
              className='w-full'
            >
              {trackedMeal ? (
                <>
                  <Edit className='h-4 w-4 mr-2' />
                  Edit Tracking
                </>
              ) : (
                <>
                  <Plus className='h-4 w-4 mr-2' />
                  Track Meal
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Show comparison card for modified meals */}
      {trackedMeal && !trackedMeal.followed && (
        <MealComparisonCard
          mealType={mealType}
          plannedMeal={plannedMeal}
          trackedMeal={trackedMeal}
        />
      )}

      <TrackMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mealType={mealType}
        plannedMeal={plannedMeal}
        existingTracking={trackedMeal}
        date={date}
      />
    </>
  );
}