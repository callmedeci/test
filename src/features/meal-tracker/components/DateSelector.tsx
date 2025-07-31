'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewMode } from '../types';

interface DateSelectorProps {
  viewMode: ViewMode;
  selectedDate: string;
  onViewModeChange: (mode: ViewMode) => void;
  onDateChange: (date: string) => void;
}

export default function DateSelector({
  viewMode,
  selectedDate,
  onViewModeChange,
  onDateChange,
}: DateSelectorProps) {
  const today = new Date().toISOString().split('T')[0];
  const selectedDateObj = new Date(selectedDate);
  
  const canGoForward = selectedDate < today;
  const canGoBack = true; // Allow going back indefinitely

  const handlePrevious = () => {
    if (!canGoBack) return;
    
    const newDate = new Date(selectedDateObj);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    onDateChange(newDate.toISOString().split('T')[0]);
  };

  const handleNext = () => {
    if (!canGoForward) return;
    
    const newDate = new Date(selectedDateObj);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    
    // Don't go beyond today
    const nextDateString = newDate.toISOString().split('T')[0];
    if (nextDateString <= today) {
      onDateChange(nextDateString);
    }
  };

  const formatDisplayDate = () => {
    if (viewMode === 'day') {
      if (selectedDate === today) return 'Today';
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (selectedDate === yesterday.toISOString().split('T')[0]) return 'Yesterday';
      
      return selectedDateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    } else {
      const endDate = new Date(selectedDateObj);
      endDate.setDate(endDate.getDate() + 6);
      
      return `${selectedDateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${endDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`;
    }
  };

  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <Tabs value={viewMode} onValueChange={(value) => onViewModeChange(value as ViewMode)}>
            <TabsList>
              <TabsTrigger value='day'>Daily View</TabsTrigger>
              <TabsTrigger value='week'>Weekly View</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handlePrevious}
              disabled={!canGoBack}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            
            <div className='min-w-[200px] text-center'>
              <span className='font-medium text-foreground'>
                {formatDisplayDate()}
              </span>
            </div>
            
            <Button
              variant='outline'
              size='sm'
              onClick={handleNext}
              disabled={!canGoForward}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}