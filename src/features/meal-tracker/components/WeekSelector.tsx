'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { WeekOption } from '../types';

interface WeekSelectorProps {
  weeks: WeekOption[];
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

export function WeekSelector({ weeks, selectedWeek, onWeekChange }: WeekSelectorProps) {
  const currentWeek = weeks.find(w => w.value === selectedWeek);

  return (
    <div className='flex items-center gap-4'>
      <div className='flex items-center gap-2'>
        <Calendar className='h-5 w-5 text-primary' />
        <label className='text-sm font-medium text-foreground'>Select Week:</label>
      </div>
      
      <Select value={selectedWeek} onValueChange={onWeekChange}>
        <SelectTrigger className='w-48'>
          <SelectValue placeholder='Select week' />
        </SelectTrigger>
        <SelectContent>
          {weeks.map((week) => (
            <SelectItem 
              key={week.value} 
              value={week.value}
              disabled={week.is_future}
            >
              <div className='flex items-center gap-2'>
                <span>{week.label}</span>
                {week.is_current && (
                  <Badge variant='default' className='text-xs'>Current</Badge>
                )}
                {week.is_future && (
                  <Badge variant='secondary' className='text-xs'>Future</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentWeek && (
        <div className='text-sm text-muted-foreground'>
          {new Date(currentWeek.week_start).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })} - {new Date(currentWeek.week_end).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      )}
    </div>
  );
}