'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DailyMealData } from '../types';
import { formatMealType, canEditDate } from '../lib/utils';
import { CheckCircle, XCircle, AlertCircle, Clock, Edit } from 'lucide-react';

interface MealCardProps {
  mealData: DailyMealData;
  selectedDate: string;
  onEditClick: (mealType: string) => void;
}

export function MealCard({ mealData, selectedDate, onEditClick }: MealCardProps) {
  const { meal_type, planned, tracked, status } = mealData;
  const canEdit = canEditDate(selectedDate);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failure':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'neutral':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Followed</Badge>;
      case 'failure':
        return <Badge variant="destructive">Over Target</Badge>;
      case 'neutral':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Under Target</Badge>;
      default:
        return <Badge variant="outline">Not Tracked</Badge>;
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {formatMealType(meal_type)}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Planned Meal */}
        <div className="space-y-2">
          <h4 className="font-medium text-primary">Planned:</h4>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="font-medium">{planned.name}</p>
            <div className="text-sm text-muted-foreground mt-1">
              {planned.ingredients.map((ing, idx) => (
                <span key={idx}>
                  {ing.name} ({ing.quantity})
                  {idx < planned.ingredients.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span>{planned.calories} kcal</span>
              <span>P: {planned.protein}g</span>
              <span>C: {planned.carbs}g</span>
              <span>F: {planned.fat}g</span>
            </div>
          </div>
        </div>

        {/* Actual Meal (if tracked) */}
        {tracked && (
          <div className="space-y-2">
            <h4 className="font-medium text-secondary">Actual:</h4>
            <div className={cn(
              "p-3 rounded-lg border",
              status === 'success' ? 'bg-green-50 border-green-200' :
              status === 'failure' ? 'bg-red-50 border-red-200' :
              status === 'neutral' ? 'bg-yellow-50 border-yellow-200' :
              'bg-gray-50 border-gray-200'
            )}>
              <div className="text-sm">
                {tracked.custom_ingredients.map((ing, idx) => (
                  <span key={idx}>
                    {ing.name} ({ing.quantity})
                    {idx < tracked.custom_ingredients.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <span>{tracked.consumed_calories} kcal</span>
                <span>P: {tracked.consumed_protein}g</span>
                <span>C: {tracked.consumed_carbs}g</span>
                <span>F: {tracked.consumed_fat}g</span>
              </div>
              {tracked.note && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Note: {tracked.note}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          variant={tracked ? "outline" : "default"}
          size="sm"
          className="w-full"
          onClick={() => onEditClick(meal_type)}
          disabled={!canEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          {tracked ? 'Edit Tracking' : 'Start Tracking'}
        </Button>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}