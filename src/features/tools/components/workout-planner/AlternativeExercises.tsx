'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, ExternalLink } from 'lucide-react';

interface AlternativeExercisesProps {
  alternatives: any[];
  exerciseKey: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function AlternativeExercises({
  alternatives,
  exerciseKey,
  isExpanded,
  onToggle,
}: AlternativeExercisesProps) {
  return (
    <div className="border-t border-green-200 pt-4">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
      >
        <span className="font-medium text-green-800">
          Alternative Exercises ({alternatives.length})
        </span>
        <ChevronDown
          className={`w-4 h-4 text-green-600 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </Button>

      {isExpanded && (
        <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {alternatives.map((alt: any, altIdx: number) => (
            <div
              key={altIdx}
              className="bg-green-50/50 rounded-lg p-4 border border-green-100"
            >
              <h6 className="font-semibold text-green-800 mb-2">{alt.name}</h6>
              <p className="text-sm text-gray-600 mb-3">{alt.instructions}</p>
              {alt.youtubeSearchTerm && (
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    alt.youtubeSearchTerm
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium hover:underline transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {alt.youtubeSearchTerm}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}