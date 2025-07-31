'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatValue } from '@/lib/utils';
import { CheckCircle, XCircle, Plus, Edit, Clock } from 'lucide-react';
import { TrackedMeal, PlannedMeal, MealType } from '../types';

interface MealCardProps {
  mealType: MealType;
  plannedMeal?: PlannedMeal;
  trackedMeal?: TrackedMeal;
  onAddTracking: (mealType: MealType) => void;
  onEditTracking: (trackedMeal: TrackedMeal) => void;
  isToday: boolean;
  isPast: boolean;
}

export function MealCard({
  mealType,
  plannedMeal,
  trackedMeal,
  onAddTracking,
  onEditTracking,
  isToday,
  isPast
}: MealCardProps) {
  const getStatusIcon = () => {
    if (!trackedMeal) {
      return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
    return trackedMeal.followed ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-orange-600" />
    );
  };

  const getStatusBadge = () => {
    if (!trackedMeal) {
      return (
        <Badge variant="outline" className="text-muted-foreground border-muted-foreground/50">
          Not Tracked
        </Badge>
      );
    }
    return trackedMeal.followed ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Followed Plan
      </Badge>
    ) : (
      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
        Custom Meal
      </Badge>
    );
  };

  const canTrack = isToday || isPast;

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {getStatusIcon()}
            {mealType}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Planned Meal Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Planned Meal:</h4>
          {plannedMeal ? (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-medium text-sm">
                {plannedMeal.custom_name || plannedMeal.name}
              </p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p>Calories: {formatValue(plannedMeal.total_calories, ' kcal')}</p>
                <p>
                  P: {formatValue(plannedMeal.total_protein, 'g')} | 
                  C: {formatValue(plannedMeal.total_carbs, 'g')} | 
                  F: {formatValue(plannedMeal.total_fat, 'g')}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No meal planned</p>
          )}
        </div>

        {/* Tracked Meal Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">What You Ate:</h4>
          {trackedMeal ? (
            <div className="p-3 bg-card border rounded-lg">
              {trackedMeal.followed ? (
                <p className="text-sm font-medium text-green-700">
                  ✓ Followed the planned meal
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium text-sm">{trackedMeal.consumedMeal}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {trackedMeal.quantity && <p>Quantity: {trackedMeal.quantity}</p>}
                    {trackedMeal.calories && <p>Calories: {trackedMeal.calories} kcal</p>}
                    {trackedMeal.notes && <p>Notes: {trackedMeal.notes}</p>}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Not tracked yet</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        {canTrack && (
          <div className="pt-2">
            {trackedMeal ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditTracking(trackedMeal)}
                className="w-full bg-transparent"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Tracking
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onAddTracking(mealType)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Track Meal
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}