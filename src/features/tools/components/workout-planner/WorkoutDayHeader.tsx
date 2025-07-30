'use client';

import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Dumbbell, Target, Timer } from 'lucide-react';

type WorkoutDayHeaderProps = {
  dayKey: any;
  dayPlan: any;
  handleClick: (dayKey: string) => void;
  expandedDays: any;
};

function WorkoutDayHeader({
  dayKey,
  dayPlan,
  handleClick,
  expandedDays,
}: WorkoutDayHeaderProps) {
  return (
    <CardHeader
      className='bg-gradient-to-r from-green-500 to-blue-500 text-white cursor-pointer'
      onClick={() => handleClick(dayKey)}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='bg-white/20 backdrop-blur-sm rounded-full p-2'>
            <Dumbbell className='w-6 h-6 text-white' />
          </div>
          <div>
            <CardTitle className='text-2xl font-bold text-white'>
              {dayPlan.dayName} - {dayPlan.focus}
            </CardTitle>
            <div className='flex items-center gap-4 mt-2'>
              <Badge
                variant='secondary'
                className='bg-white/20 text-white border-white/30'
              >
                <Timer className='w-3 h-3 mr-1' />
                {dayPlan.duration} min
              </Badge>
              <Badge
                variant='secondary'
                className='bg-white/20 text-white border-white/30'
              >
                <Target className='w-3 h-3 mr-1' />
                {dayPlan.mainWorkout?.length || 0} exercises
              </Badge>
            </div>
          </div>
        </div>
        {expandedDays[dayKey] ? (
          <ChevronUp className='w-6 h-6 text-white' />
        ) : (
          <ChevronDown className='w-6 h-6 text-white' />
        )}
      </div>
    </CardHeader>
  );
}

export default WorkoutDayHeader;
