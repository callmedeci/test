import { generatePersonalizedMealPlan } from '@/ai/flows/generate-meal-plan';
import { editAiPlan } from '@/features/meal-plan/lib/data-service';
import { useGetProfile } from '@/features/profile/hooks/useGetProfile';
import { useToast } from '@/hooks/use-toast';
import { GeneratePersonalizedMealPlanOutput } from '@/lib/schemas';
import { useEffect, useState } from 'react';
import { mapProfileToMealPlanInput } from '../lib/utils';
import { useGetMealPlan } from './useGetMealPlan';

export function useOptimizedMealPlan() {
  const { userProfile, isLoadingProfile } = useGetProfile();
  const { mealPlan } = useGetMealPlan();

  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [mealPlanState, setMealPlanState] =
    useState<GeneratePersonalizedMealPlanOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mealPlan) return;

    setMealPlanState(mealPlan.ai_plan);
  }, [toast, userProfile, mealPlan]);

  async function handleGeneratePlan() {
    if (!userProfile || Object.keys(userProfile).length === 0) {
      toast({
        title: 'Profile Incomplete',
        description:
          'Please complete your onboarding profile before generating an AI meal plan.',
        variant: 'destructive',
      });
      return;
    }

    // Map FullProfileType to GeneratePersonalizedMealPlanInput
    const input = mapProfileToMealPlanInput(userProfile);

    setIsLoading(true);
    setError(null);
    try {
      const result = await generatePersonalizedMealPlan(input);
      setMealPlanState(result);
      if (!result) return;
      await editAiPlan({ ai_plan: result });
      toast({
        title: 'Meal Plan Generated!',
        description: 'Your AI-optimized weekly meal plan is ready.',
      });
    } catch (err: any) {
      console.error('Error generating meal plan:', err);
      console.error('Full AI error object:', err); // Log the full error object
      const errorMessage = err.message || 'An unknown error occurred.';
      setError(`Failed to generate meal plan: ${errorMessage}`);
      toast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return {
    handleGeneratePlan,
    isLoadingProfile,
    isLoading,
    mealPlan: mealPlanState,
    error,
  };
}
