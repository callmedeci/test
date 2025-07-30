'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MonthOption } from '../types';

interface MonthSelectorProps {
  months: MonthOption[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export function MonthSelector({ months, selectedMonth, onMonthChange }: MonthSelectorProps) {
  return (
    <div className='flex items-center gap-3'>
      <label className='text-sm font-medium text-foreground'>View Month:</label>
      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className='w-48'>
          <SelectValue placeholder='Select month' />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}