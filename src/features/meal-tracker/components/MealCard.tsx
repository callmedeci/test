'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Camera, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { formatMealTypeName } from '../lib/utils';
import { MealEntry } from '../types';

interface MealCardProps {
  meal: MealEntry;
  onUpdate: (updatedMeal: MealEntry) => void;
}

export default function MealCard({ meal, onUpdate }: MealCardProps) {
  const [isEditing, setIsEditing] = useState(!meal.followed);
  const [localMeal, setLocalMeal] = useState(meal);

  const handleFollowedChange = (followed: boolean) => {
    const updatedMeal = {
      ...localMeal,
      followed,
      consumed: followed ? meal.target : localMeal.consumed,
      reason: followed ? undefined : localMeal.reason,
    };
    setLocalMeal(updatedMeal);
    onUpdate(updatedMeal);
    setIsEditing(!followed);
  };

  const handleConsumedFoodChange = (food: string) => {
    const updatedMeal = { ...localMeal, consumed: { ...localMeal.consumed, food } };
    setLocalMeal(updatedMeal);
    onUpdate(updatedMeal);
  };

  const handleConsumedCaloriesChange = (calories: number) => {
    const updatedMeal = { ...localMeal, consumed: { ...localMeal.consumed, calories } };
    setLocalMeal(updatedMeal);
    onUpdate(updatedMeal);
  };

  const handleReasonChange = (reason: string) => {
    const updatedMeal = { ...localMeal, reason };
    setLocalMeal(updatedMeal);
    onUpdate(updatedMeal);
  };

  const caloriesDifference = localMeal.consumed.calories - localMeal.target.calories;

  return (
    <Card className={`shadow-md transition-all duration-200 ${
      localMeal.followed 
        ? 'border-green-200 bg-green-50/30' 
        : 'border-orange-200 bg-orange-50/30'
    }`}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold'>
            {formatMealTypeName(localMeal.type)}
          </CardTitle>
          <div className='flex items-center gap-2'>
            {localMeal.followed ? (
              <CheckCircle className='h-5 w-5 text-green-600' />
            ) : (
              <XCircle className='h-5 w-5 text-orange-600' />
            )}
            <Badge variant={localMeal.followed ? 'default' : 'secondary'}>
              {localMeal.followed ? 'Followed' : 'Modified'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Target Meal */}
        <div className='p-3 bg-primary/5 rounded-lg border border-primary/20'>
          <Label className='text-sm font-medium text-primary'>Planned Meal</Label>
          <div className='mt-1'>
            <p className='text-sm font-medium'>{localMeal.target.food}</p>
            <p className='text-xs text-muted-foreground'>{localMeal.target.calories} kcal</p>
          </div>
        </div>

        {/* Follow Toggle */}
        <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
          <Label htmlFor={`followed-${localMeal.type}`} className='text-sm font-medium'>
            Did you follow this meal plan?
          </Label>
          <Switch
            id={`followed-${localMeal.type}`}
            checked={localMeal.followed}
            onCheckedChange={handleFollowedChange}
          />
        </div>

        {/* Consumed Meal (when not followed) */}
        {!localMeal.followed && (
          <div className='space-y-3 p-3 bg-orange-50/50 rounded-lg border border-orange-200'>
            <Label className='text-sm font-medium text-orange-700'>What did you actually eat?</Label>
            
            <div className='space-y-2'>
              <Input
                placeholder='Describe what you ate...'
                value={localMeal.consumed.food}
                onChange={(e) => handleConsumedFoodChange(e.target.value)}
                className='text-sm'
              />
              
              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  placeholder='Calories'
                  value={localMeal.consumed.calories || ''}
                  onChange={(e) => handleConsumedCaloriesChange(Number(e.target.value) || 0)}
                  className='text-sm w-24'
                  min='0'
                />
                <span className='text-xs text-muted-foreground'>kcal</span>
                
                {caloriesDifference !== 0 && (
                  <Badge variant={caloriesDifference > 0 ? 'destructive' : 'default'} className='text-xs'>
                    {caloriesDifference > 0 ? '+' : ''}{caloriesDifference} kcal
                  </Badge>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-xs text-muted-foreground'>Reason for change (optional)</Label>
              <Textarea
                placeholder='Why did you eat something different?'
                value={localMeal.reason || ''}
                onChange={(e) => handleReasonChange(e.target.value)}
                className='text-sm h-16 resize-none'
              />
            </div>

            {/* Mock Photo Upload Area */}
            <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center'>
              <Camera className='h-8 w-8 mx-auto text-muted-foreground/50 mb-2' />
              <p className='text-xs text-muted-foreground'>Add photo (coming soon)</p>
              <Button variant='ghost' size='sm' disabled className='mt-1'>
                Upload Photo
              </Button>
            </div>
          </div>
        )}

        {/* Consumed Meal (when followed) */}
        {localMeal.followed && (
          <div className='p-3 bg-green-50/50 rounded-lg border border-green-200'>
            <Label className='text-sm font-medium text-green-700'>Actual Consumption</Label>
            <div className='mt-1'>
              <p className='text-sm font-medium'>{localMeal.consumed.food}</p>
              <p className='text-xs text-muted-foreground'>{localMeal.consumed.calories} kcal</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}