'use client';

import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/SectionHeader';
import { BaseProfileData } from '@/lib/schemas';
import { Activity, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { ExercisePlan } from '../../types/exerciseTypes';
import ExercisePlanDisplay from './ExercisePlanDisplay';
import PlanGeneratorForm from './PlanGeneratorForm';
import ProfileSummaryCard from './ProfileSummaryCard';

interface WorkoutPlannerContentProps {
  profile: BaseProfileData;
}

export default function WorkoutPlannerContent({ profile }: WorkoutPlannerContentProps) {
  const [generatedPlan, setGeneratedPlan] = useState<ExercisePlan | null>(null);

  const handlePlanGenerated = (plan: ExercisePlan) => {
    setGeneratedPlan(plan);
  };

  return (
    <div className='space-y-8'>
      {/* Profile Summary */}
      <ProfileSummaryCard profile={profile} />

      {/* Plan Generator */}
      <Card className='shadow-lg'>
        <SectionHeader
          className='text-2xl font-semibold'
          title='Generate Your Workout Plan'
          description='Create a personalized exercise routine based on your fitness goals and preferences.'
          icon={<Target className='h-6 w-6 text-primary' />}
        />
        <CardContent>
          <PlanGeneratorForm 
            profile={profile} 
            onPlanGenerated={handlePlanGenerated}
          />
        </CardContent>
      </Card>

      {/* Generated Plan Display */}
      {generatedPlan && (
        <Card className='shadow-lg'>
          <SectionHeader
            className='text-2xl font-semibold'
            title='Your Personalized Exercise Plan'
            description='AI-generated workout plan tailored to your fitness level and goals.'
            icon={<Activity className='h-6 w-6 text-primary' />}
          />
          <CardContent>
            <ExercisePlanDisplay plan={generatedPlan} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}