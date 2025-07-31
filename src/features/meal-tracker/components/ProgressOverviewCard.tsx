'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Target, TrendingUp } from 'lucide-react';
import { DayMealData } from '../types';
import { calculateMealStats } from '../lib/mockData';

interface ProgressOverviewCardProps {
  dayData: DayMealData;
}

export default function ProgressOverviewCard({ dayData }: ProgressOverviewCardProps) {
  const stats = calculateMealStats(dayData);
  
  const getMotivationalMessage = () => {
    if (stats.adherencePercentage >= 80) {
      return {
        message: "Excellent! You're staying on track!",
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
      };
    } else if (stats.adherencePercentage >= 60) {
      return {
        message: "Good progress! Try to hit your protein goal.",
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
      };
    } else if (stats.adherencePercentage >= 40) {
      return {
        message: "Keep going! Small steps lead to big changes.",
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200',
      };
    } else {
      return {
        message: "Tomorrow is a fresh start! You've got this.",
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 border-purple-200',
      };
    }
  };

  const motivation = getMotivationalMessage();
  const isToday = dayData.date === new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Target className='h-5 w-5 text-primary' />
          {isToday ? "Today's" : 'Daily'} Progress
        </CardTitle>
      </CardHeader>
      
      <CardContent className='space-y-4'>
        {/* Meal Adherence */}
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>Meals Followed</span>
            <span>{stats.mealsFollowed} / {stats.totalMeals}</span>
          </div>
          <Progress value={stats.adherencePercentage} className='h-2' />
          <p className='text-xs text-muted-foreground text-center'>
            {stats.adherencePercentage.toFixed(0)}% adherence
          </p>
        </div>

        {/* Status Badge */}
        <div className='flex justify-center'>
          <Badge 
            variant='outline'
            className={cn(
              'px-3 py-1',
              stats.adherencePercentage >= 80 && 'bg-green-100 text-green-800 border-green-200',
              stats.adherencePercentage >= 60 && stats.adherencePercentage < 80 && 'bg-blue-100 text-blue-800 border-blue-200',
              stats.adherencePercentage >= 40 && stats.adherencePercentage < 60 && 'bg-orange-100 text-orange-800 border-orange-200',
              stats.adherencePercentage < 40 && 'bg-purple-100 text-purple-800 border-purple-200'
            )}
          >
            {stats.adherencePercentage >= 80 && 'Excellent'}
            {stats.adherencePercentage >= 60 && stats.adherencePercentage < 80 && 'Good'}
            {stats.adherencePercentage >= 40 && stats.adherencePercentage < 60 && 'Fair'}
            {stats.adherencePercentage < 40 && 'Needs Work'}
          </Badge>
        </div>

        {/* Motivational Message */}
        <div className={cn('p-3 rounded-md border', motivation.bgColor)}>
          <div className='flex items-center gap-2'>
            <TrendingUp className={cn('h-4 w-4', motivation.color)} />
            <p className={cn('text-sm font-medium', motivation.color)}>
              {motivation.message}
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className='grid grid-cols-2 gap-2 text-xs'>
          <div className='text-center p-2 bg-muted/30 rounded'>
            <p className='font-medium'>{stats.mealsFollowed}</p>
            <p className='text-muted-foreground'>Followed</p>
          </div>
          <div className='text-center p-2 bg-muted/30 rounded'>
            <p className='font-medium'>{stats.totalMeals - stats.mealsFollowed}</p>
            <p className='text-muted-foreground'>Modified</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}