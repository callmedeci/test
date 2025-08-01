'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { WeeklySummary } from '../types';
import { Target, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface DailySummaryCardProps {
  summary: WeeklySummary;
  selectedDate: string;
}

export function DailySummaryCard({ summary, selectedDate }: DailySummaryCardProps) {
  const calorieDifference = summary.total_consumed_calories - summary.total_target_calories;
  const calorieProgress = summary.total_target_calories > 0 
    ? Math.min((summary.total_consumed_calories / summary.total_target_calories) * 100, 150)
    : 0;

  const getCalorieStatus = () => {
    const diff = Math.abs(calorieDifference);
    if (diff <= 50) return { color: 'text-green-600', icon: CheckCircle, label: 'On Track' };
    if (calorieDifference > 0) return { color: 'text-red-600', icon: AlertTriangle, label: 'Over Target' };
    return { color: 'text-yellow-600', icon: AlertTriangle, label: 'Under Target' };
  };

  const calorieStatus = getCalorieStatus();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Target className="h-5 w-5" />
          Daily Summary - {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Calorie Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Calorie Progress</h4>
            <Badge className={calorieStatus.color}>
              <calorieStatus.icon className="h-3 w-3 mr-1" />
              {calorieStatus.label}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Target: {summary.total_target_calories} kcal</span>
              <span>Consumed: {summary.total_consumed_calories} kcal</span>
            </div>
            <Progress 
              value={calorieProgress} 
              className={cn(
                "h-3",
                calorieProgress > 110 ? "[&>div]:bg-red-500" : 
                calorieProgress < 90 ? "[&>div]:bg-yellow-500" : 
                "[&>div]:bg-green-500"
              )}
            />
            <div className="text-xs text-center">
              {calorieDifference > 0 ? '+' : ''}{calorieDifference} kcal difference
            </div>
          </div>
        </div>

        {/* Meal Adherence */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Meal Adherence</h4>
            <Badge variant={summary.adherence_percentage >= 80 ? "default" : "secondary"}>
              {summary.adherence_percentage}%
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Followed: {summary.meals_followed} meals</span>
              <span>Tracked: {summary.total_meals} / 6 meals</span>
            </div>
            <Progress 
              value={summary.adherence_percentage} 
              className="h-3"
            />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {summary.meals_followed}
            </div>
            <div className="text-xs text-muted-foreground">Meals Followed</div>
          </div>
          
          <div className="text-center p-3 bg-chart-2/10 rounded-lg">
            <div className="text-2xl font-bold text-chart-2">
              {summary.total_meals}
            </div>
            <div className="text-xs text-muted-foreground">Meals Tracked</div>
          </div>
        </div>

        {/* Insights */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Daily Insights</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.adherence_percentage >= 80 
              ? "Great job staying on track with your meal plan!"
              : summary.total_meals < 3
              ? "Try to track more meals for better insights."
              : "Consider planning ahead to improve meal adherence."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}