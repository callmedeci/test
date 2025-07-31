'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatNumber } from '@/lib/utils';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { CalorieSummary as CalorieSummaryType } from '../types';

interface CalorieSummaryProps {
  summary: CalorieSummaryType;
  date: string;
}

export function CalorieSummary({ summary, date }: CalorieSummaryProps) {
  const isOverTarget = summary.consumed > summary.planned;
  const progressValue = Math.min((summary.consumed / summary.planned) * 100, 100);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Calorie Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {formatNumber(summary.planned, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-sm text-muted-foreground">Planned</p>
          </div>
          
          <div className="text-center p-3 bg-secondary/5 rounded-lg">
            <div className="text-2xl font-bold text-secondary-foreground">
              {formatNumber(summary.consumed, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-sm text-muted-foreground">Consumed</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{formatNumber(summary.percentage, { maximumFractionDigits: 1 })}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <div className="flex items-center justify-center p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2">
            {isOverTarget ? (
              <TrendingUp className="h-4 w-4 text-orange-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600" />
            )}
            <span className={`font-medium ${isOverTarget ? 'text-orange-600' : 'text-green-600'}`}>
              {isOverTarget ? '+' : ''}{summary.difference} kcal
            </span>
            <span className="text-sm text-muted-foreground">
              {isOverTarget ? 'over target' : 'under target'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}