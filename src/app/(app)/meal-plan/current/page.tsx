'use client';

import { adjustMealIngredients } from '@/ai/flows/adjust-meal-ingredients';
import { Card, CardContent } from '@/components/ui/card';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import SectionHeader from '@/components/ui/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditMealDialog from '@/features/meal-plan/components/current/EditMealDialog';
import MealCardItem from '@/features/meal-plan/components/current/MealCardItem';
import { useGetMealPlan } from '@/features/meal-plan/hooks/useGetMealPlan';
import { editMealPlan } from '@/features/meal-plan/lib/data-service';
import { getAdjustedMealInput } from '@/features/meal-plan/lib/utils';
import { useGetPlan } from '@/features/profile/hooks/useGetPlan';
import { useGetProfile } from '@/features/profile/hooks/useGetProfile';
import { useToast } from '@/hooks/use-toast';
import { useQueryParams } from '@/hooks/useQueryParams';
import { daysOfWeek } from '@/lib/constants';
import { useState } from 'react';

export default function CurrentMealPlanPage() {
  const { toast } = useToast();
  const { getQueryParams, updateAndRemoveQueryParams } = useQueryParams();
  const { mealPlan, isLoadingMealPlan } = useGetMealPlan();
  const { userProfile } = useGetProfile();
  const { userPlan } = useGetPlan();

  const [optimizingMealKey, setOptimizingMealKey] = useState<string | null>(
    null
  );

  async function handleOptimizeMeal(dayIndex: number, mealIndex: number) {
    if (!mealPlan) return;

    const { meal_data } = mealPlan;

    const mealToOptimize = meal_data.days[dayIndex].meals[mealIndex];
    const mealKey = `${meal_data.days[dayIndex].day_of_week}-${mealToOptimize.name}-${mealIndex}`;
    setOptimizingMealKey(mealKey);

    if (isLoadingMealPlan || !userPlan || !userProfile) {
      toast({
        title: 'Profile Data Loading',
        description:
          'User profile data is still loading. Please wait a moment and try again.',
        variant: 'default',
      });
      setOptimizingMealKey(null);
      return;
    }

    try {
      const dailyTargets = {
        targetCalories:
          userPlan.custom_total_calories ?? userPlan.target_daily_calories,
        targetProtein: userPlan.custom_protein_g ?? userPlan.target_protein_g,
        targetCarbs: userPlan.custom_carbs_g ?? userPlan.target_carbs_g,
        targetFat: userPlan.custom_fat_g ?? userPlan.target_fat_g,
      };

      if (
        !dailyTargets.targetCalories ||
        !dailyTargets.targetProtein ||
        !dailyTargets.targetCarbs ||
        !dailyTargets.targetFat
      ) {
        toast({
          title: 'Calculation Error',
          description:
            'Could not calculate daily targets from profile. Ensure profile is complete. This might happen if some values are zero or invalid.',
          variant: 'destructive',
        });
        setOptimizingMealKey(null);
        return;
      }

      const aiInput = getAdjustedMealInput(
        userProfile,
        dailyTargets,
        mealToOptimize
      );

      const result = await adjustMealIngredients(aiInput);
      if (!result.adjustedMeal)
        throw new Error(
          'AI did not return an adjusted meal or an unexpected format was received.'
        );

      console.log(result);

      const newWeeklyPlan = JSON.parse(JSON.stringify(meal_data));
      const updatedMealData = {
        ...result.adjustedMeal,
        id: mealToOptimize.id,
        totalCalories: result.adjustedMeal.total_calories
          ? Number(result.adjustedMeal.total_calories)
          : null,
        totalProtein: result.adjustedMeal.total_protein
          ? Number(result.adjustedMeal.total_protein)
          : null,
        totalCarbs: result.adjustedMeal.total_carbs
          ? Number(result.adjustedMeal.total_carbs)
          : null,
        totalFat: result.adjustedMeal.total_fat
          ? Number(result.adjustedMeal.total_fat)
          : null,
        ingredients: result.adjustedMeal.ingredients.map((ing) => ({
          ...ing,
          quantity: ing.quantity ? Number(ing.quantity) : 0,
          calories: ing.calories ? Number(ing.calories) : null,
          protein: ing.protein ? Number(ing.protein) : null,
          carbs: ing.carbs ? Number(ing.carbs) : null,
          fat: ing.fat ? Number(ing.fat) : null,
        })),
      };

      newWeeklyPlan.days[dayIndex].meals[mealIndex] = updatedMealData;
      // setWeeklyPlan(newWeeklyPlan);

      await editMealPlan({ meal_data: newWeeklyPlan });

      toast({
        title: `Meal Optimized: ${mealToOptimize.name}`,
        description: result.explanation || 'AI has adjusted the ingredients.',
      });
    } catch (error: any) {
      console.error('Error optimizing meal:', error);
      console.error('Full AI error object:', error);
      const errorMessage =
        error.message || 'Unknown error during optimization.';
      toast({
        title: 'Optimization Failed',
        description: `Could not optimize meal: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setOptimizingMealKey(null);
    }
  }

  if (isLoadingMealPlan) return <LoadingScreen />;

  return (
    <div className='container mx-auto py-8'>
      <Card className='shadow-xl'>
        <SectionHeader
          className='text-3xl font-bold'
          title='Your Current Weekly Meal Plan'
          description='View and manage your meals for the week. Click on a meal to edit or
          optimize with AI.'
        />
        <CardContent>
          <Tabs
            defaultValue={getQueryParams('selected_day') ?? daysOfWeek[0]}
            className='w-full'
          >
            <ScrollArea className='w-full whitespace-nowrap rounded-md'>
              <TabsList className='inline-flex h-auto'>
                {daysOfWeek.map((day) => (
                  <TabsTrigger
                    onClick={() => {
                      updateAndRemoveQueryParams({ selected_day: day }, [
                        'selected_meal',
                        'is_edit',
                      ]);
                    }}
                    key={day}
                    value={day}
                    className='px-4 py-2 text-base'
                  >
                    {day}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>

            {mealPlan?.meal_data.days.map((dayPlan, dayIndex) => (
              <TabsContent
                key={dayPlan.day_of_week}
                value={dayPlan.day_of_week}
                className='mt-6'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {dayPlan.meals.map((meal, mealIndex) => (
                    <MealCardItem
                      key={mealIndex}
                      meal={meal}
                      dayPlan={dayPlan}
                      mealIndex={mealIndex}
                      dayIndex={dayIndex}
                      disabled={isLoadingMealPlan}
                      optimizingKey={optimizingMealKey}
                      onOptimizeMeal={handleOptimizeMeal}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {getQueryParams('is_edit') && <EditMealDialog />}
    </div>
  );
}
