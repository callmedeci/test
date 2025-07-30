'use client';

import { useState } from 'react';
import { MonthSelector } from './MonthSelector';
import { ProgressChart } from './ProgressChart';
import { WeeklyEntryForm } from './WeeklyEntryForm';
import { ProgressEntriesList } from './ProgressEntriesList';
import { getAvailableMonths, getEntriesForMonth } from '../lib/mockData';

export function ProgressTrackingSection() {
  const availableMonths = getAvailableMonths();
  const [selectedMonth, setSelectedMonth] = useState(
    availableMonths[0]?.value || '2025-1'
  );

  const selectedMonthData = selectedMonth
    ? availableMonths.find(m => m.value === selectedMonth)
    : null;

  const entries = selectedMonthData
    ? getEntriesForMonth(selectedMonthData.year, selectedMonthData.month)
    : [];

  return (
    <div className='space-y-6'>
      {/* Month Selector */}
      <div className='flex justify-between items-center'>
        <MonthSelector
          months={availableMonths}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* Progress Chart */}
      <ProgressChart entries={entries} selectedMonth={selectedMonth} />

      {/* Weekly Entry Form */}
      <WeeklyEntryForm />

      {/* Progress Entries List */}
      <ProgressEntriesList entries={entries} selectedMonth={selectedMonth} />
    </div>
  );
}