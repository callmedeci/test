'use client';

import { Badge } from '@/components/ui/badge';
import GeneratedPlanDisplay from '@/features/tools/components/workout-planner/GeneratedPlanDisplay';
import { BarChart3, Calendar, User, Zap } from 'lucide-react';

type GeneratedPlanSectionProps = {
  generatedPlan: any;
  expandedDays: any;
  onClick: (value: string) => void;
};

function GeneratedPlanSection({
  generatedPlan,
  expandedDays,
  onClick,
}: GeneratedPlanSectionProps) {
  if (!generatedPlan) return null;

  return (
    <div className='mt-12 space-y-8'>
      <div className='text-center space-y-4 bg-gradient-to-r from-green-600 to-blue-600 text-white py-12 px-8 rounded-2xl shadow-2xl'>
        <div className='flex items-center justify-center gap-3 mb-4'>
          <div className='p-3 bg-white/20 backdrop-blur-sm rounded-full'>
            <Zap className='w-8 h-8 text-white' />
          </div>
          <h2 className='text-4xl font-bold'>
            Your Personalized Exercise Plan
          </h2>
        </div>
        <p className='text-xl text-white/90 max-w-3xl mx-auto'>
          AI-generated workout plan based on your preferences and goals -
          designed specifically for your fitness journey
        </p>
        <div className='flex flex-wrap justify-center gap-4 mt-6'>
          <Badge
            variant='secondary'
            className='bg-white/20 text-white border-white/30 px-4 py-2 text-base'
          >
            <Calendar className='w-4 h-4 mr-2' />
            Full Week Plan
          </Badge>
          <Badge
            variant='secondary'
            className='bg-white/20 text-white border-white/30 px-4 py-2 text-base'
          >
            <User className='w-4 h-4 mr-2' />
            Personalized
          </Badge>
          <Badge
            variant='secondary'
            className='bg-white/20 text-white border-white/30 px-4 py-2 text-base'
          >
            <BarChart3 className='w-4 h-4 mr-2' />
            Progress Tracking
          </Badge>
        </div>
      </div>

      <GeneratedPlanDisplay
        expandedDays={expandedDays}
        generatedPlan={generatedPlan}
        handleClick={onClick}
      />
    </div>
  );
}

export default GeneratedPlanSection;
