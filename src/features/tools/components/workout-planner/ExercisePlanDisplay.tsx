'use client';

import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Calendar } from 'lucide-react';
import { ExercisePlan } from '../../types/exerciseTypes';
import PlanStatsCard from './PlanStatsCard';
import PlanTipsGrid from './PlanTipsGrid';
import WorkoutDayCard from './WorkoutDayCard';

interface ExercisePlanDisplayProps {
  plan: ExercisePlan;
}

export default function ExercisePlanDisplay({ plan }: ExercisePlanDisplayProps) {
  if (!plan?.weeklyPlan) return null;

  const planStats = {
    totalWorkouts: Object.keys(plan.weeklyPlan).length,
    totalDuration: Object.values(plan.weeklyPlan).reduce(
      (sum, day) => sum + (day.duration || 0),
      0
    ),
    avgDuration: Object.keys(plan.weeklyPlan).length > 0 
      ? Math.round(
          Object.values(plan.weeklyPlan).reduce(
            (sum, day) => sum + (day.duration || 0),
            0
          ) / Object.keys(plan.weeklyPlan).length
        )
      : 0,
  };

  return (
    <div className='space-y-8'>
      {/* Plan Statistics */}
      <Card className='border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5'>
        <SectionHeader
          className='text-xl font-semibold'
          title='Plan Overview'
          description='Your weekly workout statistics'
          icon={<Award className='h-5 w-5 text-primary' />}
        />
        <CardContent>
          <PlanStatsCard stats={planStats} />
        </CardContent>
      </Card>

      {/* Weekly Plan Tabs */}
      <Card className='shadow-lg'>
        <SectionHeader
          className='text-xl font-semibold'
          title='Weekly Schedule'
          description='Your daily workout routines'
          icon={<Calendar className='h-5 w-5 text-primary' />}
        />
        <CardContent>
          <Tabs defaultValue='Day1' className='w-full'>
            <TabsList className='grid w-full grid-cols-7 bg-muted'>
              {Object.keys(plan.weeklyPlan).map((dayKey) => {
                const day = plan.weeklyPlan[dayKey];
                return (
                  <TabsTrigger
                    key={dayKey}
                    value={dayKey}
                    className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                  >
                    {day.dayName.substring(0, 3)}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(plan.weeklyPlan).map(([dayKey, day]) => (
              <TabsContent key={dayKey} value={dayKey} className='mt-6'>
                <WorkoutDayCard day={day} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Tips and Notes */}
      <PlanTipsGrid plan={plan} />
    </div>
  );
}