'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, subDays, isAfter, startOfDay } from 'date-fns';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const today = startOfDay(new Date());
  const canGoForward = !isAfter(addDays(selectedDate, 1), today);

  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    if (canGoForward) {
      onDateChange(addDays(selectedDate, 1));
    }
  };

  const handleToday = () => {
    onDateChange(today);
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold text-foreground">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousDay}
              className="bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              disabled={format(selectedDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')}
              className="bg-transparent"
            >
              Today
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextDay}
              disabled={!canGoForward}
              className="bg-transparent"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}