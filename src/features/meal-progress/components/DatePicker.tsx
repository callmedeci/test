'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayStatus } from '../types';
import { formatDateDisplay, isFutureDate, isToday, getStatusColor } from '../lib/utils';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  dayStatuses: DayStatus[];
}

export function DatePicker({ selectedDate, onDateChange, dayStatuses }: DatePickerProps) {
  const selectedDateObj = new Date(selectedDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const handlePreviousDay = () => {
    const prevDate = new Date(selectedDateObj);
    prevDate.setDate(prevDate.getDate() - 1);
    onDateChange(prevDate.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const nextDate = new Date(selectedDateObj);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateString = nextDate.toISOString().split('T')[0];
    
    if (!isFutureDate(nextDateString)) {
      onDateChange(nextDateString);
    }
  };

  const handleToday = () => {
    onDateChange(new Date().toISOString().split('T')[0]);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date && !isFutureDate(date.toISOString().split('T')[0])) {
      onDateChange(date.toISOString().split('T')[0]);
    }
  };

  const getDayStatus = (date: string) => {
    return dayStatuses.find(status => status.date === date);
  };

  const canGoNext = !isFutureDate(
    new Date(selectedDateObj.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousDay}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-[200px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateDisplay(selectedDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDateObj}
              onSelect={handleCalendarSelect}
              disabled={(date) => isFutureDate(date.toISOString().split('T')[0])}
              initialFocus
              modifiers={{
                success: (date) => {
                  const status = getDayStatus(date.toISOString().split('T')[0]);
                  return status?.status === 'success';
                },
                failure: (date) => {
                  const status = getDayStatus(date.toISOString().split('T')[0]);
                  return status?.status === 'failure';
                },
                undereaten: (date) => {
                  const status = getDayStatus(date.toISOString().split('T')[0]);
                  return status?.status === 'undereaten';
                },
              }}
              modifiersStyles={{
                success: { backgroundColor: 'rgb(34 197 94)', color: 'white' },
                failure: { backgroundColor: 'rgb(239 68 68)', color: 'white' },
                undereaten: { backgroundColor: 'rgb(249 115 22)', color: 'white' },
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextDay}
          disabled={!canGoNext}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {!isToday(selectedDate) && (
          <Button
            variant="default"
            size="sm"
            onClick={handleToday}
            className="text-sm"
          >
            Today
          </Button>
        )}
      </div>
    </div>
  );
}