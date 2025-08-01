'use client';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { mockDateStatuses } from '../lib/mockData';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const today = new Date();
  const selected = new Date(selectedDate);

  const getDateStatusClass = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const status = mockDateStatuses.find(s => s.date === dateStr);
    
    if (!status) return '';
    
    switch (status.status) {
      case 'success':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'failure':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'untracked':
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
      default:
        return '';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <CalendarIcon className="h-5 w-5" />
          Select Date
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selected, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selected}
                onSelect={(date) => {
                  if (date) {
                    onDateChange(format(date, 'yyyy-MM-dd'));
                  }
                }}
                disabled={(date) => date > today}
                initialFocus
                modifiers={{
                  tracked: (date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    return mockDateStatuses.some(s => s.date === dateStr && s.status !== 'untracked');
                  }
                }}
                modifiersClassNames={{
                  tracked: getDateStatusClass(selected)
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
              <span>Exact calories</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
              <span>Overeaten</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></div>
              <span>Undereaten</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300"></div>
              <span>No tracking</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}