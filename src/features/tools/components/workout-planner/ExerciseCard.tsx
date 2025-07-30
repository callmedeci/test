'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ExternalLink, Heart } from 'lucide-react';
import AlternativeExercises from './AlternativeExercises';

interface ExerciseCardProps {
  exercise: any;
  exerciseIndex: number;
  dayKey: string;
  expandedExercises: { [key: string]: boolean };
  onToggleExercise: (exerciseKey: string) => void;
}

export default function ExerciseCard({
  exercise,
  exerciseIndex,
  dayKey,
  expandedExercises,
  onToggleExercise,
}: ExerciseCardProps) {
  const exerciseKey = `${dayKey}-${exerciseIndex}`;
  const isExpanded = expandedExercises[exerciseKey];

  return (
    <div className="border border-green-100 rounded-xl p-6 bg-gradient-to-r from-white to-green-50/30 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-bold text-green-800 text-lg">{exercise.exerciseName}</h5>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Strength
        </Badge>
      </div>

      {/* Exercise Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-white/80 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{exercise.sets}</div>
          <div className="text-xs text-blue-500">Sets</div>
        </div>
        <div className="text-center p-3 bg-white/80 rounded-lg">
          <div className="text-lg font-bold text-green-600">{exercise.reps}</div>
          <div className="text-xs text-green-500">Reps</div>
        </div>
        <div className="text-center p-3 bg-white/80 rounded-lg">
          <div className="text-lg font-bold text-purple-600">{exercise.restSeconds}s</div>
          <div className="text-xs text-purple-500">Rest</div>
        </div>
        <div className="text-center p-3 bg-white/80 rounded-lg">
          <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <div className="text-xs text-red-500">Target</div>
        </div>
      </div>

      {/* Target Muscles */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Target Muscles:</p>
        <div className="flex flex-wrap gap-2">
          {exercise.targetMuscles.map((muscle: string, idx: number) => (
            <Badge key={idx} variant="outline" className="border-gray-300">
              {muscle}
            </Badge>
          ))}
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed bg-blue-50 p-3 rounded-lg">
        {exercise.instructions}
      </p>

      {/* YouTube Tutorial Link */}
      <div className="mb-4">
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
            exercise.youtubeSearchTerm
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium hover:underline transition-colors bg-red-50 px-3 py-2 rounded-lg"
        >
          <ExternalLink className="w-4 h-4" />
          Watch Tutorial: {exercise.youtubeSearchTerm}
        </a>
      </div>

      {/* Alternative Exercises */}
      {exercise.alternatives && exercise.alternatives.length > 0 && (
        <AlternativeExercises
          alternatives={exercise.alternatives}
          exerciseKey={exerciseKey}
          isExpanded={isExpanded}
          onToggle={() => onToggleExercise(exerciseKey)}
        />
      )}
    </div>
  );
}