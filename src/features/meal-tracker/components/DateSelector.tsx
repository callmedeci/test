'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  availableDates: string[];
}

export default function DateSelector({
  selectedDate,
  onDateChange,
  availableDates,
}: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableDateObjects = availableDates.map(date => new Date(date));
  const today = new Date();

  const goToPreviousDay = () => {
    const currentIndex = availableDates.findIndex(
      date => new Date(date).toDateString() === selectedDate.toDateString()
    );
    if (currentIndex > 0) {
      onDateChange(new Date(availableDates[currentIndex - 1]));
    }
  };

  const goToNextDay = () => {
    const currentIndex = availableDates.findIndex(
      date => new Date(date).toDateString() === selectedDate.toDateString()
    );
    if (currentIndex < availableDates.length - 1) {
      onDateChange(new Date(availableDates[currentIndex + 1]));
    }
  };

  const canGoPrevious = () => {
    const currentIndex = availableDates.findIndex(
      date => new Date(date).toDateString() === selectedDate.toDateString()
    );
    return currentIndex > 0;
  };

  const canGoNext = () => {
    const currentIndex = availableDates.findIndex(
      date => new Date(date).toDateString() === selectedDate.toDateString()
    );
    return currentIndex < availableDates.length - 1;
  };

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='icon'
        onClick={goToPreviousDay}
        disabled={!canGoPrevious()}
        className='h-9 w-9'
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {selectedDate ? (
              format(selectedDate, 'PPP')
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onDateChange(date);
                setIsOpen(false);
              }
            }}
            disabled={(date) => {
              // Disable future dates and dates not in available data
              return (
                date > today ||
                !availableDateObjects.some(
                  availableDate =>
                    availableDate.toDateString() === date.toDateString()
                )
              );
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant='outline'
        size='icon'
        onClick={goToNextDay}
        disabled={!canGoNext()}
        className='h-9 w-9'
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
}