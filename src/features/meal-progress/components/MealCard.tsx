'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, Edit, Plus, XCircle } from 'lucide-react';
import { MealProgress, PlannedMeal, MealType } from '../types';
import { formatMealTypeName, getMealIcon, isFutureDate, isToday } from '../lib/utils';

interface MealCardProps {
  mealType: MealType;
  plannedMeal?: PlannedMeal;
  progress?: MealProgress;
  selectedDate: string;
  onTrackMeal: (mealType: MealType) => void;
}

export function MealCard({
  mealType,
  plannedMeal,
  progress,
  selectedDate,
  onTrackMeal,
}: MealCardProps) {
  const isTracked = !!progress;
  const followedPlan = progress?.followed_plan;
  const canTrack = !isFutureDate(selectedDate);

  const getStatusIcon = () => {
    if (!isTracked) return null;
    
    if (followedPlan) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusBadge = () => {
    if (!isTracked) {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Not Tracked
        </Badge>
      );
    }

    if (followedPlan) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Followed Plan
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          Custom Meal
        </Badge>
      );
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isTracked && followedPlan && "border-green-200 bg-green-50/30",
      isTracked && !followedPlan && "border-orange-200 bg-orange-50/30",
      !isTracked && "border-border"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-xl">{getMealIcon(mealType)}</span>
            {formatMealTypeName(mealType)}
          </CardTitle>
          {getStatusIcon()}
        </div>
        <div className="flex items-center justify-between">
          <CardDescription className="text-sm">
            {plannedMeal?.name || 'No meal planned'}
          </CardDescription>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Planned Meal Info */}
        {plannedMeal && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-primary">Planned Meal:</h4>
            <div className="space-y-1">
              {plannedMeal.ingredients.map((ingredient, index) => (
                <p key={index} className="text-xs text-muted-foreground">
                  • {ingredient.name} - {ingredient.quantity}
                </p>
              ))}
            </div>
            <div className="flex justify-between text-xs bg-muted/50 p-2 rounded">
              <span>{plannedMeal.calories} kcal</span>
              <span>P: {plannedMeal.protein}g</span>
              <span>C: {plannedMeal.carbs}g</span>
              <span>F: {plannedMeal.fat}g</span>
            </div>
          </div>
        )}

        {/* Tracked Meal Info */}
        {isTracked && (
          <div className="space-y-2 border-t pt-3">
            <h4 className="font-medium text-sm text-secondary">Actually Consumed:</h4>
            
            {followedPlan ? (
              <p className="text-sm text-green-700">✓ Followed the planned meal</p>
            ) : (
              <div className="space-y-1">
                {progress.custom_ingredients?.map((ingredient, index) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    • {ingredient.name} - {ingredient.quantity}
                  </p>
                ))}
                {progress.note && (
                  <p className="text-xs text-orange-700 italic">
                    Note: {progress.note}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex justify-between text-xs bg-secondary/10 p-2 rounded">
              <span>{progress.consumed_calories} kcal</span>
              <span>P: {progress.consumed_protein}g</span>
              <span>C: {progress.consumed_carbs}g</span>
              <span>F: {progress.consumed_fat}g</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {canTrack && (
          <Button
            variant={isTracked ? "outline" : "default"}
            size="sm"
            onClick={() => onTrackMeal(mealType)}
            className="w-full"
          >
            {isTracked ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Tracking
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Start Tracking
              </>
            )}
          </Button>
        )}

        {!canTrack && (
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground">
              Cannot track future meals
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}