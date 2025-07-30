'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';
import WorkoutDayCard from './WorkoutDayCard';

interface WorkoutPlanDisplayProps {
  generatedPlan: any;
}

export default function WorkoutPlanDisplay({ generatedPlan }: WorkoutPlanDisplayProps) {
  const [expandedExercises, setExpandedExercises] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExerciseExpansion = (exerciseKey: string) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey],
    }));
  };

  const getPlanStats = () => {
    if (!generatedPlan?.weeklyPlan) return null;

    const days = Object.values(generatedPlan.weeklyPlan);
    const totalWorkouts = days.length;
    const totalDuration = days.reduce((sum: number, day: any) => sum + (day.duration || 0), 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    return { totalWorkouts, totalDuration, avgDuration };
  };

  const stats = getPlanStats();

  if (!generatedPlan || !stats) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Plan Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100 rounded-t-lg">
          <CardTitle className="text-2xl text-green-800 flex items-center gap-3">
            <Award className="w-6 h-6" />
            Your Personalized Exercise Plan
            <Badge className="bg-green-500 text-white ml-auto">AI Generated</Badge>
          </CardTitle>
          <p className="text-green-600 mt-2">
            AI-generated workout plan based on your preferences and goals
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-green-800 mb-2">
                {stats.totalWorkouts}
              </div>
              <p className="text-sm text-green-700 font-medium">Weekly Workouts</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-blue-800 mb-2">
                {stats.avgDuration} min
              </div>
              <p className="text-sm text-blue-700 font-medium">Average Duration</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-purple-800 mb-2">
                {Math.round(stats.totalDuration / 60)}h
              </div>
              <p className="text-sm text-purple-700 font-medium">Total Weekly Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Plan Tabs */}
      <Tabs defaultValue="Day1" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-2">
          {Object.keys(generatedPlan.weeklyPlan).map((dayKey) => {
            const day = generatedPlan.weeklyPlan[dayKey];
            return (
              <TabsTrigger
                key={dayKey}
                value={dayKey}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg font-medium transition-all duration-200"
              >
                {day.dayName.substring(0, 3)}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(generatedPlan.weeklyPlan).map(([dayKey, day]: [string, any]) => (
          <TabsContent key={dayKey} value={dayKey} className="mt-6">
            <WorkoutDayCard
              day={day}
              dayKey={dayKey}
              expandedExercises={expandedExercises}
              onToggleExercise={toggleExerciseExpansion}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}