'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { daysOfWeek } from '@/lib/constants';
import { BaseProfileData, MealPlans } from '@/lib/schemas';
import { formatValue } from '@/lib/utils';
import { ChefHat, AlertTriangle } from 'lucide-react';

interface CoachMealPlanViewProps {
  mealPlan: MealPlans;
  profile: BaseProfileData;
}

export function CoachMealPlanView({
  mealPlan,
  profile,
}: CoachMealPlanViewProps) {
  const hasActiveMealPlan = mealPlan.meal_data.days.some((day) =>
    day.meals.some((meal) => meal.ingredients.length > 0)
  );

  return (
    <div className='space-y-6'>
      {/* Client Info Banner */}
      <Card className='border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5'>
        <CardHeader>
          <CardTitle className='text-lg text-primary'>
            {profile.name || 'Client'}'s Meal Plan
          </CardTitle>
          <CardDescription>
            Current goal: {profile.primary_diet_goal || 'Not specified'} •
            Activity: {profile.physical_activity_level || 'Not specified'}
          </CardDescription>
        </CardHeader>
      </Card>

      {!hasActiveMealPlan && (
        <Card className='border-amber-200 bg-amber-50'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-amber-800'>
              <AlertTriangle className='h-5 w-5' />
              <p className='font-medium'>
                This client hasn't created their meal plan yet.
              </p>
            </div>
            <p className='text-sm text-amber-700 mt-2'>
              Encourage them to use the meal planning tools to create their
              weekly schedule.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={daysOfWeek[0]} className='w-full'>
        <ScrollArea className='w-full whitespace-nowrap rounded-md'>
          <TabsList className='inline-flex h-auto'>
            {daysOfWeek.map((day) => (
              <TabsTrigger key={day} value={day} className='px-4 py-2 text-base'>
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        {mealPlan.meal_data.days.map((dayPlan, dayIndex) => (
          <TabsContent
            key={dayPlan.day_of_week}
            value={dayPlan.day_of_week}
            className='mt-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {dayPlan.meals.map((meal, mealIndex) => (
                <Card key={mealIndex} className='flex flex-col'>
                  <CardHeader>
                    <CardTitle className='text-xl flex items-center gap-2'>
                      <ChefHat className='h-5 w-5 text-accent' />
                      {meal.name}
                    </CardTitle>
                    {meal.custom_name && (
                      <CardDescription>{meal.custom_name}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className='flex-grow'>
                    {meal.ingredients.length > 0 ? (
                      <>
                        <ul className='space-y-1 text-sm text-muted-foreground mb-4'>
                          {meal.ingredients.map((ing, ingIndex) => (
                            <li key={ingIndex}>
                              {ing.name} - {formatValue(ing.quantity, ing.unit)}
                            </li>
                          ))}
                        </ul>
                        <div className='grid grid-cols-2 gap-2 text-xs'>
                          <div className='space-y-1'>
                            <p>
                              <span className='font-medium'>Calories:</span>{' '}
                              {formatValue(meal.total_calories?.toFixed(0))}
                            </p>
                            <p>
                              <span className='font-medium'>Protein:</span>{' '}
                              {formatValue(meal.total_protein?.toFixed(1), 'g')}
                            </p>
                          </div>
                          <div className='space-y-1'>
                            <p>
                              <span className='font-medium'>Carbs:</span>{' '}
                              {formatValue(meal.total_carbs?.toFixed(1), 'g')}
                            </p>
                            <p>
                              <span className='font-medium'>Fat:</span>{' '}
                              {formatValue(meal.total_fat?.toFixed(1), 'g')}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className='text-center py-8 text-muted-foreground'>
                        <ChefHat className='h-8 w-8 mx-auto mb-2 opacity-50' />
                        <p className='text-sm'>No meal planned</p>
                        <Badge variant='outline' className='mt-2'>
                          Empty
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}