'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Repeat,
  Youtube,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

type WorkoutDayDetailsProps = {
  dayPlan: any;
  dayKey: string;
};

function WorkoutDayDetails({ dayPlan, dayKey }: WorkoutDayDetailsProps) {
  const [expandedExercises, setExpandedExercises] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExerciseExpansion = (exerciseKey: string) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey],
    }));
  };

  return (
    <CardContent className='p-8 space-y-8'>
      {dayPlan.warmup &&
        dayPlan.warmup.exercises &&
        dayPlan.warmup.exercises.length > 0 && (
          <div className='space-y-4'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='bg-orange-100 p-2 rounded-full'>
                <Zap className='w-5 h-5 text-orange-600' />
              </div>
              <h4 className='text-xl font-bold text-orange-700'>Warm-up</h4>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {dayPlan.warmup.exercises.map((exercise: any, idx: number) => (
                <Card key={idx} className='border-orange-200 bg-orange-50'>
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <h5 className='font-semibold text-orange-800'>
                        {exercise.name}
                      </h5>
                      <Badge
                        variant='outline'
                        className='text-orange-600 border-orange-300'
                      >
                        {exercise.duration} min
                      </Badge>
                    </div>
                    <p className='text-sm text-orange-700'>
                      {exercise.instructions}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      <Separator />

      {dayPlan.mainWorkout && dayPlan.mainWorkout.length > 0 && (
        <div className='space-y-6'>
          <div className='flex items-center gap-2 mb-6'>
            <div className='bg-blue-100 p-2 rounded-full'>
              <Activity className='w-5 h-5 text-blue-600' />
            </div>
            <h4 className='text-xl font-bold text-blue-700'>Main Workout</h4>
          </div>

          {dayPlan.mainWorkout.map((exercise: any, idx: number) => {
            const exerciseKey = `${dayKey}-exercise-${idx}`;
            return (
              <Card
                key={idx}
                className='border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg'
              >
                <CardContent className='p-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold'>
                          {idx + 1}
                        </div>
                        <h5 className='text-xl font-bold text-blue-800'>
                          {exercise.exerciseName}
                        </h5>
                      </div>
                      <div className='flex gap-2'>
                        {exercise.youtubeSearchTerm && (
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-red-300 text-red-600 hover:bg-red-50'
                            onClick={() =>
                              window.open(
                                `https://www.youtube.com/results?search_query=${encodeURIComponent(
                                  exercise.youtubeSearchTerm
                                )}`,
                                '_blank'
                              )
                            }
                          >
                            <Youtube className='w-4 h-4 mr-1' />
                            Watch Tutorial
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                      <div className='bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center'>
                        <div className='text-lg font-bold text-blue-600'>
                          {exercise.sets}
                        </div>
                        <div className='text-sm text-blue-700'>Sets</div>
                      </div>
                      <div className='bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center'>
                        <div className='text-lg font-bold text-green-600'>
                          {exercise.reps}
                        </div>
                        <div className='text-sm text-green-700'>Reps</div>
                      </div>
                      <div className='bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center'>
                        <div className='text-lg font-bold text-purple-600'>
                          {exercise.restSeconds}s
                        </div>
                        <div className='text-sm text-purple-700'>Rest</div>
                      </div>
                      <div className='bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center'>
                        <div className='text-lg font-bold text-orange-600'>
                          {exercise.targetMuscles?.length || 0}
                        </div>
                        <div className='text-sm text-orange-700'>Muscles</div>
                      </div>
                    </div>

                    {exercise.targetMuscles &&
                      exercise.targetMuscles.length > 0 && (
                        <div className='space-y-2'>
                          <p className='font-medium text-blue-700'>
                            Target Muscles:
                          </p>
                          <div className='flex flex-wrap gap-2'>
                            {exercise.targetMuscles.map(
                              (muscle: string, muscleIdx: number) => (
                                <Badge
                                  key={muscleIdx}
                                  variant='secondary'
                                  className='bg-blue-100 text-blue-700'
                                >
                                  {muscle}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    <div className='bg-white/80 backdrop-blur-sm rounded-lg p-4'>
                      <p className='text-gray-700 leading-relaxed'>
                        {exercise.instructions}
                      </p>
                    </div>

                    {exercise.alternatives &&
                      exercise.alternatives.length > 0 && (
                        <div className='space-y-3'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => toggleExerciseExpansion(exerciseKey)}
                            className='w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                          >
                            <Repeat className='w-4 h-4 mr-2' />
                            {expandedExercises[exerciseKey]
                              ? 'Hide'
                              : 'Show'}{' '}
                            Alternative Exercises (
                            {exercise.alternatives.length})
                            {expandedExercises[exerciseKey] ? (
                              <ChevronUp className='w-4 h-4 ml-2' />
                            ) : (
                              <ChevronDown className='w-4 h-4 ml-2' />
                            )}
                          </Button>

                          {expandedExercises[exerciseKey] && (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                              {exercise.alternatives.map(
                                (alt: any, altIdx: number) => (
                                  <Card
                                    key={altIdx}
                                    className='border-indigo-200 bg-indigo-50'
                                  >
                                    <CardContent className='p-4'>
                                      <div className='space-y-3'>
                                        <div className='flex items-center justify-between'>
                                          <h6 className='font-semibold text-indigo-800'>
                                            {alt.name}
                                          </h6>
                                          {alt.youtubeSearchTerm && (
                                            <Button
                                              variant='ghost'
                                              size='sm'
                                              className='text-red-600 hover:bg-red-50 p-1'
                                              onClick={() =>
                                                window.open(
                                                  `https://www.youtube.com/results?search_query=${encodeURIComponent(
                                                    alt.youtubeSearchTerm
                                                  )}`,
                                                  '_blank'
                                                )
                                              }
                                            >
                                              <Youtube className='w-4 h-4' />
                                            </Button>
                                          )}
                                        </div>
                                        <p className='text-sm text-indigo-700'>
                                          {alt.instructions}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Separator />

      {dayPlan.cooldown &&
        dayPlan.cooldown.exercises &&
        dayPlan.cooldown.exercises.length > 0 && (
          <div className='space-y-4'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='bg-green-100 p-2 rounded-full'>
                <CheckCircle className='w-5 h-5 text-green-600' />
              </div>
              <h4 className='text-xl font-bold text-green-700'>Cool-down</h4>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {dayPlan.cooldown.exercises.map((exercise: any, idx: number) => (
                <Card key={idx} className='border-green-200 bg-green-50'>
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <h5 className='font-semibold text-green-800'>
                        {exercise.name}
                      </h5>
                      <Badge
                        variant='outline'
                        className='text-green-600 border-green-300'
                      >
                        {exercise.duration} min
                      </Badge>
                    </div>
                    <p className='text-sm text-green-700'>
                      {exercise.instructions}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
    </CardContent>
  );
}

export default WorkoutDayDetails;
