'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  Calendar,
  ChevronDown,
  Clock,
  Dumbbell,
  ExternalLink,
  Heart,
  Play,
} from 'lucide-react';
import ExerciseCard from './ExerciseCard';

interface WorkoutDayCardProps {
  day: any;
  dayKey: string;
  expandedExercises: { [key: string]: boolean };
  onToggleExercise: (exerciseKey: string) => void;
}

export default function WorkoutDayCard({
  day,
  dayKey,
  expandedExercises,
  onToggleExercise,
}: WorkoutDayCardProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
        <CardTitle className="text-green-800 flex items-center justify-between text-xl">
          <span className="flex items-center gap-3">
            <Calendar className="w-5 h-5" />
            {day.dayName} - {day.focus}
          </span>
          <Badge variant="outline" className="border-green-300 text-green-700 px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            {day.duration} min
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Warm-up */}
          {day.warmup && (
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                <Play className="w-4 h-4" />
                Warm-up Routine
              </h4>
              <div className="space-y-2">
                {day.warmup.exercises.map((exercise: any, idx: number) => (
                  <div key={idx} className="bg-white/80 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-orange-800">{exercise.name}</h5>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        {exercise.duration} sec
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{exercise.instructions}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Exercises */}
          <div className="space-y-4">
            <h4 className="font-semibold text-green-700 text-lg flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              Main Workout
            </h4>
            {day.mainWorkout.map((exercise: any, exerciseIndex: number) => (
              <ExerciseCard
                key={exerciseIndex}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                dayKey={dayKey}
                expandedExercises={expandedExercises}
                onToggleExercise={onToggleExercise}
              />
            ))}
          </div>

          {/* Cool-down */}
          {day.cooldown && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Cool-down Routine
              </h4>
              <div className="space-y-2">
                {day.cooldown.exercises.map((exercise: any, idx: number) => (
                  <div key={idx} className="bg-white/80 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-blue-800">{exercise.name}</h5>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {exercise.duration} sec
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{exercise.instructions}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}