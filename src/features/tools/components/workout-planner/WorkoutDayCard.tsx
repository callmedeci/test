'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Target } from 'lucide-react';
import { WorkoutDay } from '../../types/exerciseTypes';
import ExerciseSection from './ExerciseSection';

interface WorkoutDayCardProps {
  day: WorkoutDay;
}

export default function WorkoutDayCard({ day }: WorkoutDayCardProps) {
  return (
    <Card className='shadow-lg border-border/50'>
      <CardHeader className='bg-gradient-to-r from-primary/10 to-secondary/10'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-xl text-primary'>
            {day.dayName} - {day.focus}
          </CardTitle>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='border-primary/50'>
              <Clock className='h-3 w-3 mr-1' />
              {day.duration} min
            </Badge>
            <Badge variant='outline' className='border-primary/50'>
              <Target className='h-3 w-3 mr-1' />
              {day.mainWorkout?.length || 0} exercises
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-6 space-y-6'>
        {/* Warm-up */}
        {day.warmup && day.warmup.exercises && day.warmup.exercises.length > 0 && (
          <ExerciseSection
            title='Warm-up'
            exercises={day.warmup.exercises}
            type='warmup'
          />
        )}

        {/* Main Workout */}
        {day.mainWorkout && day.mainWorkout.length > 0 && (
          <ExerciseSection
            title='Main Workout'
            exercises={day.mainWorkout}
            type='main'
          />
        )}

        {/* Cool-down */}
        {day.cooldown && day.cooldown.exercises && day.cooldown.exercises.length > 0 && (
          <ExerciseSection
            title='Cool-down'
            exercises={day.cooldown.exercises}
            type='cooldown'
          />
        )}
      </CardContent>
    </Card>
  );
}