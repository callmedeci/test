'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Edit, 
  Calendar,
  Utensils,
  Target,
  Flame
} from 'lucide-react';
import { DailyTracking } from '../types';
import { canEditMeal } from '../lib/mockData';

interface DailyMealTrackingTableProps {
  dailyData: DailyTracking[];
  onEditMeal: (dayIndex: number, mealIndex: number) => void;
}

export function DailyMealTrackingTable({ dailyData, onEditMeal }: DailyMealTrackingTableProps) {
  return (
    <div className='space-y-6'>
      {dailyData.map((day, dayIndex) => (
        <Card key={day.date} className='shadow-md'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-primary' />
                {day.day_of_week} - {new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </CardTitle>
              <div className='flex items-center gap-3'>
                <Badge 
                  variant={day.meals_followed === day.total_meals ? 'default' : 'secondary'}
                  className='text-xs'
                >
                  {day.meals_followed}/{day.total_meals} followed
                </Badge>
                <div className='text-sm text-muted-foreground'>
                  {day.total_actual_calories} / {day.total_planned_calories} kcal
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3'>
              {day.meals.map((meal, mealIndex) => (
                <div 
                  key={meal.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    meal.followed_plan 
                      ? 'border-green-200 bg-green-50/50' 
                      : 'border-red-200 bg-red-50/50'
                  }`}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 space-y-2'>
                      {/* Meal Header */}
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-2'>
                          {meal.followed_plan ? (
                            <CheckCircle className='h-4 w-4 text-green-600' />
                          ) : (
                            <XCircle className='h-4 w-4 text-red-600' />
                          )}
                          <span className='font-medium text-foreground'>
                            {meal.meal_type}
                          </span>
                        </div>
                        <Badge 
                          variant={meal.followed_plan ? 'default' : 'destructive'}
                          className='text-xs'
                        >
                          {meal.followed_plan ? 'Followed' : 'Modified'}
                        </Badge>
                      </div>

                      {/* Planned vs Actual */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-2'>
                            <Target className='h-3 w-3 text-primary' />
                            <span className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                              Planned
                            </span>
                          </div>
                          <p className='text-sm font-medium'>{meal.planned_meal}</p>
                          <p className='text-xs text-muted-foreground'>
                            {meal.planned_calories} kcal
                          </p>
                        </div>

                        <div className='space-y-1'>
                          <div className='flex items-center gap-2'>
                            <Flame className='h-3 w-3 text-chart-2' />
                            <span className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                              Actual
                            </span>
                          </div>
                          <p className='text-sm font-medium'>
                            {meal.actual_meal || 'Not recorded'}
                          </p>
                          <div className='flex items-center gap-2'>
                            <p className='text-xs text-muted-foreground'>
                              {meal.actual_calories || 0} kcal
                            </p>
                            {meal.actual_quantity && (
                              <span className='text-xs text-muted-foreground'>
                                • {meal.actual_quantity}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {meal.notes && (
                        <div className='mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground'>
                          <span className='font-medium'>Note:</span> {meal.notes}
                        </div>
                      )}
                    </div>

                    {/* Edit Button */}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onEditMeal(dayIndex, mealIndex)}
                      disabled={!canEditMeal(day.date)}
                      className='ml-4 gap-2'
                    >
                      <Edit className='h-3 w-3' />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Summary */}
            <div className='mt-4 pt-4 border-t border-border/50'>
              <div className='flex items-center justify-between text-sm'>
                <div className='flex items-center gap-4'>
                  <span className='font-medium'>
                    Daily Total: {day.total_actual_calories} / {day.total_planned_calories} kcal
                  </span>
                  <span className={`font-medium ${
                    day.total_actual_calories > day.total_planned_calories 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {day.total_actual_calories > day.total_planned_calories ? '+' : ''}
                    {day.total_actual_calories - day.total_planned_calories} kcal
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Utensils className='h-4 w-4 text-muted-foreground' />
                  <span className='text-muted-foreground'>
                    {((day.meals_followed / day.total_meals) * 100).toFixed(0)}% adherence
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}