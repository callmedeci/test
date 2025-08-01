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
      return <CheckCircle className="h-4 w-4 text-primary" />;
    } else {
      return <XCircle className="h-4 w-4 text-chart-4" />;
    }
  };

  const getStatusBadge = () => {
    if (!isTracked) {
      return (
        <Badge variant="outline" className="text-muted-foreground border-border/50">
          Not Tracked
        </Badge>
      );
    }

    if (followedPlan) {
      return (
        <Badge className="bg-primary/10 text-primary border-primary/20">
          Followed Plan
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-chart-4/10 text-chart-4 border-chart-4/20">
          Custom Meal
        </Badge>
      );
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md border-border/50 hover:border-border",
      isTracked && followedPlan && "border-primary/30 bg-primary/5",
      isTracked && !followedPlan && "border-chart-4/30 bg-chart-4/5"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="text-xl">{getMealIcon(mealType)}</span>
            {formatMealTypeName(mealType)}
          </CardTitle>
          {getStatusIcon()}
        </div>
        <div className="flex items-center justify-between">
          <CardDescription className="text-sm text-muted-foreground">
            {plannedMeal?.name || 'No meal planned'}
          </CardDescription>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Planned Meal Info */}
        {plannedMeal && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-primary">Planned Meal:</h4>
            <div className="space-y-1">
              {plannedMeal.ingredients.map((ingredient, index) => (
                <p key={index} className="text-xs text-muted-foreground leading-relaxed">
                  • {ingredient.name} - {ingredient.quantity}
                </p>
              ))}
            </div>
            <div className="flex justify-between text-xs bg-muted/30 p-3 rounded-md border border-border/30">
              <span>{plannedMeal.calories} kcal</span>
              <span>P: {plannedMeal.protein}g</span>
              <span>C: {plannedMeal.carbs}g</span>
              <span>F: {plannedMeal.fat}g</span>
            </div>
          </div>
        )}

        {/* Tracked Meal Info */}
        {isTracked && (
          <div className="space-y-2 border-t border-border/30 pt-4">
            <h4 className="font-semibold text-sm text-secondary">Actually Consumed:</h4>
            
            {followedPlan ? (
              <p className="text-sm text-primary font-medium">✓ Followed the planned meal</p>
            ) : (
              <div className="space-y-1">
                {progress.custom_ingredients?.map((ingredient, index) => (
                  <p key={index} className="text-xs text-muted-foreground leading-relaxed">
                    • {ingredient.name} - {ingredient.quantity}
                  </p>
                ))}
                {progress.note && (
                  <p className="text-xs text-chart-4 italic font-medium">
                    Note: {progress.note}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex justify-between text-xs bg-secondary/10 p-3 rounded-md border border-secondary/20">
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
            className={cn(
              "w-full font-medium",
              isTracked 
                ? "border-border/50 hover:border-border bg-transparent" 
                : "bg-primary hover:bg-primary/90"
            )}
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
          <div className="text-center py-3 bg-muted/30 rounded-md border border-border/30">
            <p className="text-xs text-muted-foreground font-medium">
              Cannot track future meals
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}