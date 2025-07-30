'use client';

import { Card } from '@/components/ui/card';
import ErrorMessage from '@/components/ui/ErrorMessage';
import SectionHeader from '@/components/ui/SectionHeader';
import PlanStats from '@/features/tools/components/workout-planner/PlanStats';
import PlanTipsSection from '@/features/tools/components/workout-planner/PlanTipsSection';
import WeeklyWorkoutList from '@/features/tools/components/workout-planner/WeeklyWorkoutList';
import { Calendar } from 'lucide-react';

type GeneratedPlanDisplayProps = {
  generatedPlan: any;
  expandedDays: any;
  handleClick: (value: string) => void;
};

function GeneratedPlanDisplay({
  generatedPlan,
  expandedDays,
  handleClick,
}: GeneratedPlanDisplayProps) {
  if (generatedPlan.error) return;
  <ErrorMessage title='Fetch Failed' message={generatedPlan.error} />;

  if (!generatedPlan.weeklyPlan) return null;

  return (
    <div className='space-y-8'>
      <Card className='border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
        <SectionHeader
          className='text-2xl  flex items-center gap-2'
          title='Weekly Schedule Overview'
          icon={<Calendar className='w-6 h-6' />}
        />
        <PlanStats generatedPlan={generatedPlan} />
      </Card>

      <WeeklyWorkoutList
        generatedPlan={generatedPlan}
        expandedDays={expandedDays}
        onClick={handleClick}
      />

      <PlanTipsSection generatedPlan={generatedPlan} />
    </div>
  );
}

export default GeneratedPlanDisplay;
