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
import { Exercise, WarmupCooldownExercise } from '../../types/exerciseTypes';

interface ExerciseSectionProps {
  title: string;
  exercises: Exercise[] | WarmupCooldownExercise[];
  type: 'warmup' | 'main' | 'cooldown';
}

export default function ExerciseSection({ title, exercises, type }: ExerciseSectionProps) {
  const [expandedExercises, setExpandedExercises] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExerciseExpansion = (exerciseKey: string) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey],
    }));
  };

  const getSectionIcon = () => {
    switch (type) {
      case 'warmup':
        return <Zap className='h-5 w-5 text-orange-600' />;
      case 'main':
        return <Activity className='h-5 w-5 text-blue-600' />;
      case 'cooldown':
        return <CheckCircle className='h-5 w-5 text-green-600' />;
    }
  };

  const getSectionColor = () => {
    switch (type) {
      case 'warmup':
        return 'border-orange-200 bg-orange-50';
      case 'main':
        return 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50';
      case 'cooldown':
        return 'border-green-200 bg-green-50';
    }
  };

  if (!exercises || exercises.length === 0) return null;

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2 mb-4'>
        <div className={`p-2 rounded-full ${type === 'warmup' ? 'bg-orange-100' : type === 'main' ? 'bg-blue-100' : 'bg-green-100'}`}>
          {getSectionIcon()}
        </div>
        <h4 className='text-xl font-bold text-foreground'>{title}</h4>
      </div>

      {type === 'main' ? (
        // Main workout exercises with detailed information
        <div className='space-y-6'>
          {(exercises as Exercise[]).map((exercise, idx) => {
            const exerciseKey = `${type}-exercise-${idx}`;
            return (
              <Card key={idx} className={`shadow-lg ${getSectionColor()}`}>
                <CardContent className='p-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold'>
                          {idx + 1}
                        </div>
                        <h5 className='text-xl font-bold text-foreground'>
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
                            <Youtube className='h-4 w-4 mr-1' />
                            Watch Tutorial
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                      <div className='bg-card/60 backdrop-blur-sm rounded-lg p-3 text-center border border-border/50'>
                        <div className='text-lg font-bold text-primary'>
                          {exercise.sets}
                        </div>
                        <div className='text-sm text-muted-foreground'>Sets</div>
                      </div>
                      <div className='bg-card/60 backdrop-blur-sm rounded-lg p-3 text-center border border-border/50'>
                        <div className='text-lg font-bold text-primary'>
                          {exercise.reps}
                        </div>
                        <div className='text-sm text-muted-foreground'>Reps</div>
                      </div>
                      <div className='bg-card/60 backdrop-blur-sm rounded-lg p-3 text-center border border-border/50'>
                        <div className='text-lg font-bold text-primary'>
                          {exercise.restSeconds}s
                        </div>
                        <div className='text-sm text-muted-foreground'>Rest</div>
                      </div>
                      <div className='bg-card/60 backdrop-blur-sm rounded-lg p-3 text-center border border-border/50'>
                        <div className='text-lg font-bold text-primary'>
                          {exercise.targetMuscles?.length || 0}
                        </div>
                        <div className='text-sm text-muted-foreground'>Muscles</div>
                      </div>
                    </div>

                    {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                      <div className='space-y-2'>
                        <p className='font-medium text-foreground'>Target Muscles:</p>
                        <div className='flex flex-wrap gap-2'>
                          {exercise.targetMuscles.map((muscle, muscleIdx) => (
                            <Badge
                              key={muscleIdx}
                              variant='secondary'
                              className='bg-primary/10 text-primary'
                            >
                              {muscle}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className='bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50'>
                      <p className='text-foreground leading-relaxed'>
                        {exercise.instructions}
                      </p>
                    </div>

                    {exercise.alternatives && exercise.alternatives.length > 0 && (
                      <div className='space-y-3'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => toggleExerciseExpansion(exerciseKey)}
                          className='w-full border-primary/50 text-primary hover:bg-primary/5'
                        >
                          <Repeat className='h-4 w-4 mr-2' />
                          {expandedExercises[exerciseKey] ? 'Hide' : 'Show'} Alternative Exercises ({exercise.alternatives.length})
                          {expandedExercises[exerciseKey] ? (
                            <ChevronUp className='h-4 w-4 ml-2' />
                          ) : (
                            <ChevronDown className='h-4 w-4 ml-2' />
                          )}
                        </Button>

                        {expandedExercises[exerciseKey] && (
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                            {exercise.alternatives.map((alt, altIdx) => (
                              <Card key={altIdx} className='border-primary/20 bg-primary/5'>
                                <CardContent className='p-4'>
                                  <div className='space-y-3'>
                                    <div className='flex items-center justify-between'>
                                      <h6 className='font-semibold text-foreground'>
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
                                          <Youtube className='h-4 w-4' />
                                        </Button>
                                      )}
                                    </div>
                                    <p className='text-sm text-muted-foreground'>
                                      {alt.instructions}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
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
      ) : (
        // Warmup and cooldown exercises with simpler layout
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {(exercises as WarmupCooldownExercise[]).map((exercise, idx) => (
            <Card key={idx} className={getSectionColor()}>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <h5 className='font-semibold text-foreground'>
                    {exercise.name}
                  </h5>
                  <Badge variant='outline' className='border-primary/50'>
                    {exercise.duration} min
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {exercise.instructions}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator />
    </div>
  );
}