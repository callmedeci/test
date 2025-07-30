'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { BaseProfileData } from '@/lib/schemas';
import { Loader2, Wand2 } from 'lucide-react';
import { useTransition } from 'react';
import { ExercisePlan } from '../../types/exerciseTypes';

interface PlanGeneratorFormProps {
  profile: BaseProfileData;
  onPlanGenerated: (plan: ExercisePlan) => void;
}

export default function PlanGeneratorForm({ profile, onPlanGenerated }: PlanGeneratorFormProps) {
  const [isGenerating, startGenerating] = useTransition();

  const generateWorkoutPlan = async () => {
    if (!profile) {
      toast({
        title: 'Profile Required',
        description: 'Please complete your profile first to generate a personalized workout plan.',
        variant: 'destructive',
      });
      return;
    }

    startGenerating(async () => {
      try {
        // Prepare preferences based on profile
        const preferences = {
          fitness_level: mapActivityToFitnessLevel(profile.physical_activity_level),
          exercise_experience: profile.preferred_exercise_types || ['Mixed'],
          primary_goal: mapDietGoalToExerciseGoal(profile.primary_diet_goal),
          exercise_days_per_week: mapFrequencyToDays(profile.exercise_frequency),
          available_time_per_session: 45, // Default
          exercise_location: 'Gym', // Default
          available_equipment: profile.equipment_access || ['Dumbbells'],
          existing_medical_conditions: profile.medical_conditions || [],
          injuries_or_limitations: profile.injuries?.join(', ') || '',
          job_type: mapActivityToJobType(profile.physical_activity_level),
          preferred_difficulty_level: 'Medium', // Default
          sleep_quality: 'Good', // Default
          preferred_time_of_day: 'Morning', // Default
          space_availability: 'Gym space', // Default
          doctor_clearance: true,
          want_to_track_progress: true,
          weekly_checkins_enabled: false,
          accountability_support: false,
          goal_timeline_weeks: 12,
          muscle_groups_focus: ['Full Body'],
          machines_access: true,
        };

        // Save preferences
        const preferencesResponse = await fetch('/api/exercise-planner/save-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferences),
        });

        if (!preferencesResponse.ok) {
          throw new Error('Failed to save preferences');
        }

        // Generate AI exercise plan
        const generateResponse = await fetch('/api/exercise-planner/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `Generate a comprehensive workout plan for:
            - Age: ${profile.age || 25}
            - Activity Level: ${profile.physical_activity_level || 'Moderate'}
            - Goal: ${profile.primary_diet_goal || 'General fitness'}
            - Experience: ${profile.exercise_frequency || 'Beginner'}`,
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
            title: 'Workout Plan Generated!',
            description: 'Your personalized AI workout plan is ready.',
          });
        } else {
          throw new Error('Invalid plan format received');
        }
      } catch (error: any) {
        console.error('Error generating workout plan:', error);
        toast({
          title: 'Generation Failed',
          description: error?.message || 'Failed to generate workout plan. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className='text-center space-y-6'>
      <div className='space-y-2'>
        <p className='text-muted-foreground'>
          Generate a personalized weekly workout plan powered by artificial intelligence,
          tailored to your fitness level and goals based on your profile information.
        </p>
        {!profile.age && (
          <p className='text-sm text-destructive'>
            Please complete your profile first to get personalized recommendations.
          </p>
        )}
      </div>
      
      <Button
        onClick={generateWorkoutPlan}
        disabled={isGenerating || !profile.age}
        size='lg'
        className='px-8'
      >
        {isGenerating ? (
          <>
            <Loader2 className='h-5 w-5 mr-2 animate-spin' />
            Generating Your Plan...
          </>
        ) : (
          <>
            <Wand2 className='h-5 w-5 mr-2' />
            Generate AI Exercise Plan
          </>
        )}
      </Button>
    </div>
  );
}

// Helper functions to map profile data to exercise preferences
function mapActivityToFitnessLevel(activityLevel?: string | null): 'Beginner' | 'Intermediate' | 'Advanced' {
  switch (activityLevel) {
    case 'sedentary':
    case 'light':
      return 'Beginner';
    case 'moderate':
    case 'active':
      return 'Intermediate';
    case 'extra_active':
      return 'Advanced';
    default:
      return 'Beginner';
  }
}

function mapDietGoalToExerciseGoal(dietGoal?: string | null): 'Lose fat' | 'Build muscle' | 'General fitness' {
  switch (dietGoal) {
    case 'fat_loss':
      return 'Lose fat';
    case 'muscle_gain':
    case 'recomp':
      return 'Build muscle';
    default:
      return 'General fitness';
  }
}

function mapFrequencyToDays(frequency?: string | null): number {
  switch (frequency) {
    case '1-2_days':
      return 2;
    case '3-4_days':
      return 4;
    case '5-6_days':
      return 5;
    case 'daily':
      return 7;
    default:
      return 3;
  }
}

function mapActivityToJobType(activityLevel?: string | null): 'Desk job' | 'Active job' | 'Standing job' {
  switch (activityLevel) {
    case 'sedentary':
      return 'Desk job';
    case 'light':
    case 'moderate':
      return 'Standing job';
    case 'active':
    case 'extra_active':
      return 'Active job';
    default:
      return 'Desk job';
  }
}