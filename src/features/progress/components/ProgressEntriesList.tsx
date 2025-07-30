'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatValue } from '@/lib/utils';
import { Calendar, Edit, FileText, Scale, Ruler } from 'lucide-react';
import { BodyProgressEntry } from '../types';

interface ProgressEntriesListProps {
  entries: BodyProgressEntry[];
  selectedMonth: string;
}

export function ProgressEntriesList({ entries, selectedMonth }: ProgressEntriesListProps) {
  const monthLabel = selectedMonth
    ? new Date(
        parseInt(selectedMonth.split('-')[0]),
        parseInt(selectedMonth.split('-')[1]) - 1
      ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  const sortedEntries = entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (entries.length === 0) {
    return (
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-xl flex items-center gap-2 text-primary'>
            <FileText className='h-5 w-5' />
            Progress Entries - {monthLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center h-32 text-muted-foreground'>
            <div className='text-center'>
              <FileText className='h-8 w-8 mx-auto mb-2 opacity-50' />
              <p>No entries recorded for {monthLabel}</p>
              <p className='text-sm'>Add your first measurement above!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='shadow-lg'>
      <CardHeader>
        <CardTitle className='text-xl flex items-center gap-2 text-primary'>
          <FileText className='h-5 w-5' />
          Progress Entries - {monthLabel}
          <Badge variant='secondary' className='ml-auto'>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {sortedEntries.map((entry) => (
            <Card key={entry.id} className='border border-border/50 hover:border-border transition-colors'>
              <CardContent className='p-4'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-3 flex-1'>
                    {/* Date Header */}
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-primary' />
                      <span className='font-semibold text-foreground'>
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Measurements Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                      <div className='flex items-center gap-2 p-3 bg-primary/5 rounded-lg'>
                        <Scale className='h-4 w-4 text-primary' />
                        <div>
                          <p className='text-sm text-muted-foreground'>Weight</p>
                          <p className='font-semibold text-foreground'>
                            {formatValue(entry.weight_kg, ' kg')}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-2 p-3 bg-chart-2/10 rounded-lg'>
                        <div className='h-4 w-4 rounded-full bg-chart-2' />
                        <div>
                          <p className='text-sm text-muted-foreground'>Body Fat</p>
                          <p className='font-semibold text-foreground'>
                            {formatValue(entry.body_fat_percentage, '%')}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-2 p-3 bg-chart-3/10 rounded-lg'>
                        <Ruler className='h-4 w-4 text-chart-3' />
                        <div>
                          <p className='text-sm text-muted-foreground'>Waist</p>
                          <p className='font-semibold text-foreground'>
                            {formatValue(entry.waist_cm, ' cm')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {entry.notes && (
                      <div className='p-3 bg-muted/50 rounded-lg'>
                        <p className='text-sm text-muted-foreground mb-1'>Notes:</p>
                        <p className='text-sm text-foreground italic'>"{entry.notes}"</p>
                      </div>
                    )}
                  </div>

                  {/* Edit Button */}
                  <Button
                    variant='outline'
                    size='sm'
                    disabled
                    className='ml-4 opacity-50 cursor-not-allowed'
                  >
                    <Edit className='h-4 w-4 mr-1' />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}