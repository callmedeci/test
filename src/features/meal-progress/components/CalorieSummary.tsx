'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Target, TrendingDown, TrendingUp } from 'lucide-react';

interface CalorieSummaryProps {
  totalTarget: number;
  totalConsumed: number;
  difference: number;
  percentage: number;
}

export function CalorieSummary({
  totalTarget,
  totalConsumed,
  difference,
  percentage,
}: CalorieSummaryProps) {
  const isOver = difference > 0;
  const isUnder = difference < 0;
  const isOnTarget = Math.abs(difference) <= totalTarget * 0.05; // Within 5%

  const getStatusColor = () => {
    if (isOnTarget) return 'text-green-600';
    if (isOver) return 'text-destructive';
    return 'text-orange-600';
  };

  const getStatusIcon = () => {
    if (isOnTarget) return <Target className="h-5 w-5 text-green-600" />;
    if (isOver) return <TrendingUp className="h-5 w-5 text-destructive" />;
    return <TrendingDown className="h-5 w-5 text-orange-600" />;
  };

  const getStatusMessage = () => {
    if (isOnTarget) return 'On target! Great job!';
    if (isOver) return `${Math.abs(difference)} kcal over target`;
    return `${Math.abs(difference)} kcal under target`;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Target className="h-5 w-5" />
          Daily Calorie Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className={getStatusColor()}>{percentage}%</span>
          </div>
          <Progress
            value={Math.min(percentage, 150)} // Cap at 150% for visual purposes
            className={cn(
              "h-3",
              percentage > 105 && "[&>div]:bg-destructive",
              percentage < 95 && "[&>div]:bg-orange-500",
              percentage >= 95 && percentage <= 105 && "[&>div]:bg-green-500"
            )}
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Target</p>
            <p className="text-xl font-bold text-primary">{totalTarget}</p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </div>
          <div className="text-center p-3 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Consumed</p>
            <p className="text-xl font-bold text-secondary">{totalConsumed}</p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </div>
        </div>

        {/* Status Message */}
        <div className={cn(
          "flex items-center justify-center gap-2 p-3 rounded-lg border",
          isOnTarget && "bg-green-50 border-green-200",
          isOver && "bg-destructive/10 border-destructive/20",
          isUnder && "bg-orange-50 border-orange-200"
        )}>
          {getStatusIcon()}
          <span className={cn("font-medium", getStatusColor())}>
            {getStatusMessage()}
          </span>
        </div>

        {/* Breakdown */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Breakdown:</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-muted/30 rounded">
              <p className="text-muted-foreground">Difference</p>
              <p className={cn("font-bold", getStatusColor())}>
                {difference > 0 ? '+' : ''}{difference} kcal
              </p>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded">
              <p className="text-muted-foreground">Remaining</p>
              <p className="font-bold">
                {Math.max(0, totalTarget - totalConsumed)} kcal
              </p>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded">
              <p className="text-muted-foreground">Progress</p>
              <p className="font-bold">{percentage}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}