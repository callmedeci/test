'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/utils';
import { CheckCircle, Target } from 'lucide-react';
import { MealTrackingStatus } from '../types';

interface TrackingStatusProps {
  status: MealTrackingStatus;
  date: string;
}

export function TrackingStatus({ status, date }: TrackingStatusProps) {
  const getStatusColor = () => {
    if (status.percentage >= 80) return 'text-green-600';
    if (status.percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = () => {
    if (status.percentage >= 80) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>;
    }
    if (status.percentage >= 60) {
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Good</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 border-red-200">Needs Improvement</Badge>;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Plan Adherence
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getStatusColor()}`}>
            {formatNumber(status.percentage, { maximumFractionDigits: 0 })}%
          </div>
          <p className="text-sm text-muted-foreground">
            You followed your plan for {status.followedMeals} out of {status.totalMeals} meals
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Meals Followed</span>
            <span>{status.followedMeals}/{status.totalMeals}</span>
          </div>
          <Progress value={status.percentage} className="h-2" />
        </div>

        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {status.percentage >= 80 
              ? "Great job staying on track! 🎉"
              : status.percentage >= 60
              ? "You're doing well, keep it up! 💪"
              : "Every meal is a new opportunity! 🌟"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}