'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Award, CheckCircle, Target } from 'lucide-react';
import { MealProgress, PlannedMeal } from '../types';

interface TrackingStatusProps {
  plannedMeals: PlannedMeal[];
  dayProgress: MealProgress[];
  selectedDate: string;
}

export function TrackingStatus({
  plannedMeals,
  dayProgress,
  selectedDate,
}: TrackingStatusProps) {
  const totalMeals = plannedMeals.length;
  const trackedMeals = dayProgress.length;
  const followedMeals = dayProgress.filter(p => p.followed_plan).length;
  
  const trackingPercentage = totalMeals > 0 ? Math.round((trackedMeals / totalMeals) * 100) : 0;
  const adherencePercentage = totalMeals > 0 ? Math.round((followedMeals / totalMeals) * 100) : 0;

  const getMotivationalMessage = () => {
    if (trackingPercentage === 100 && adherencePercentage >= 80) {
      return "Excellent! You're crushing your nutrition goals! 🎉";
    } else if (trackingPercentage >= 80) {
      return "Great job staying on track! Keep it up! 💪";
    } else if (trackingPercentage >= 50) {
      return "Good progress! Try to track all your meals for better insights.";
    } else if (trackingPercentage > 0) {
      return "Nice start! Remember to track all your meals throughout the day.";
    } else {
      return "Start tracking your meals to see your progress!";
    }
  };

  const getStatusColor = () => {
    if (adherencePercentage >= 80) return 'text-green-600';
    if (adherencePercentage >= 60) return 'text-orange-600';
    return 'text-muted-foreground';
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Award className="h-5 w-5" />
          {isToday ? "Today's" : "Daily"} Progress Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tracking Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Meals Tracked</span>
            <Badge variant="outline" className="text-xs">
              {trackedMeals} of {totalMeals}
            </Badge>
          </div>
          <Progress value={trackingPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {trackingPercentage}% of meals tracked
          </p>
        </div>

        {/* Plan Adherence */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Plan Adherence</span>
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                adherencePercentage >= 80 && "border-green-200 text-green-700",
                adherencePercentage >= 60 && adherencePercentage < 80 && "border-orange-200 text-orange-700",
                adherencePercentage < 60 && "border-muted text-muted-foreground"
              )}
            >
              {followedMeals} of {totalMeals}
            </Badge>
          </div>
          <Progress 
            value={adherencePercentage} 
            className={cn(
              "h-2",
              adherencePercentage >= 80 && "[&>div]:bg-green-500",
              adherencePercentage >= 60 && adherencePercentage < 80 && "[&>div]:bg-orange-500",
              adherencePercentage < 60 && "[&>div]:bg-muted-foreground"
            )}
          />
          <p className="text-xs text-muted-foreground text-center">
            {adherencePercentage}% plan adherence
          </p>
        </div>

        {/* Motivational Message */}
        <div className={cn(
          "flex items-center gap-2 p-3 rounded-lg border",
          adherencePercentage >= 80 && "bg-green-50 border-green-200",
          adherencePercentage >= 60 && adherencePercentage < 80 && "bg-orange-50 border-orange-200",
          adherencePercentage < 60 && "bg-muted/50 border-border"
        )}>
          {adherencePercentage >= 80 ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Target className="h-5 w-5 text-primary" />
          )}
          <span className={cn("text-sm font-medium", getStatusColor())}>
            {getMotivationalMessage()}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-primary/10 rounded">
            <p className="text-xs text-muted-foreground">Tracked</p>
            <p className="font-bold text-primary">{trackedMeals}</p>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <p className="text-xs text-muted-foreground">Followed</p>
            <p className="font-bold text-green-600">{followedMeals}</p>
          </div>
          <div className="p-2 bg-orange-50 rounded">
            <p className="text-xs text-muted-foreground">Custom</p>
            <p className="font-bold text-orange-600">{trackedMeals - followedMeals}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}