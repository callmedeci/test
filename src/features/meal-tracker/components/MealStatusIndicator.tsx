'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, Clock, X } from 'lucide-react';
import { TrackedMeal } from '../types';

interface MealStatusIndicatorProps {
  trackedMeal?: TrackedMeal;
  size?: 'sm' | 'md' | 'lg';
}

export default function MealStatusIndicator({ 
  trackedMeal, 
  size = 'md' 
}: MealStatusIndicatorProps) {
  if (!trackedMeal) {
    return (
      <Badge variant='outline' className={cn(
        'text-muted-foreground',
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'lg' && 'text-sm px-3 py-1'
      )}>
        <Clock className={cn(
          'mr-1',
          size === 'sm' && 'h-3 w-3',
          size === 'md' && 'h-4 w-4',
          size === 'lg' && 'h-4 w-4'
        )} />
        Not Tracked
      </Badge>
    );
  }

  if (trackedMeal.followed) {
    return (
      <Badge className={cn(
        'bg-green-100 text-green-800 border-green-200',
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'lg' && 'text-sm px-3 py-1'
      )}>
        <Check className={cn(
          'mr-1',
          size === 'sm' && 'h-3 w-3',
          size === 'md' && 'h-4 w-4',
          size === 'lg' && 'h-4 w-4'
        )} />
        Followed
      </Badge>
    );
  }

  return (
    <Badge variant='outline' className={cn(
      'bg-orange-100 text-orange-800 border-orange-200',
      size === 'sm' && 'text-xs px-2 py-0.5',
      size === 'lg' && 'text-sm px-3 py-1'
    )}>
      <X className={cn(
        'mr-1',
        size === 'sm' && 'h-3 w-3',
        size === 'md' && 'h-4 w-4',
        size === 'lg' && 'h-4 w-4'
      )} />
      Modified
    </Badge>
  );
}