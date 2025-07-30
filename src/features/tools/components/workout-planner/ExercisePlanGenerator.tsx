'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { BaseProfileData, ExercisePlannerFormData } from '@/lib/schemas';
import { Loader2, Zap } from 'lucide-react';
import { useState } from 'react';

interface ExercisePlanGeneratorProps {
  profile: BaseProfileData;
  preferences: ExercisePlannerFormData;
  onPlanGenerated: (plan: any) => void;
}

export default function ExercisePlanGenerator({
  profile,
  preferences,
  onPlanGenerated,
}: ExercisePlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWorkoutPlan = async () => {
    if (!profile) {
      toast({
        title: 'Profile Required',
        description: 'Please complete your profile first to generate a personalized workout plan.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      // First save preferences
      const preferencesResponse = await fetch('/api/exercise-planner/save-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!preferencesResponse.ok) {
        throw new Error('Failed to save preferences');
      }

      // Generate AI exercise plan
      const generateResponse = await fetch('/api/exercise-planner/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate a comprehensive 7-day English workout plan for:
          - Experience: ${preferences.fitness_level}
          - Goal: ${preferences.primary_goal}
          - Age: ${profile.age || 25}
          - Activity Level: ${profile.physical_activity_level || 'Moderate'}
          - Available Time: ${preferences.available_time_per_session} minutes
          - Exercise Days: ${preferences.exercise_days_per_week} days per week`,
          preferences,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate workout plan');
      }

      const result = await generateResponse.json();

      if (result.plan?.weekly_plan?.parsed_plan) {
        onPlanGenerated(result.plan.weekly_plan.parsed_plan);
        toast({
          title: 'Plan Generated',
          description: 'Your personalized workout plan has been created successfully!',
        });
      } else {
        throw new Error('Invalid plan format received');
      }
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast({
        title: 'Generation Failed',
        description: 'Error generating workout plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-3">
          <Zap className="w-6 h-6" />
          Generate Your AI Workout Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-green-600">
          Ready to create your personalized workout plan? Our AI will generate a comprehensive
          weekly routine based on your preferences and fitness goals.
        </p>
        
        <div className="flex justify-center">
          <Button
            onClick={generateWorkoutPlan}
            disabled={isGenerating}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Your Plan...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate AI Workout Plan
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}