'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DailyMealData } from '../types';
import { formatMealType } from '../lib/utils';

const trackingSchema = z.object({
  followed_plan: z.boolean(),
  consumed_calories: z.number().min(0, 'Calories must be positive'),
  consumed_protein: z.number().min(0, 'Protein must be positive'),
  consumed_carbs: z.number().min(0, 'Carbs must be positive'),
  consumed_fat: z.number().min(0, 'Fat must be positive'),
  custom_ingredients: z.string().min(1, 'Please describe what you ate'),
  note: z.string().optional(),
});

type TrackingFormValues = z.infer<typeof trackingSchema>;

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealData: DailyMealData | null;
  selectedDate: string;
}

export function TrackingModal({ isOpen, onClose, mealData, selectedDate }: TrackingModalProps) {
  const { toast } = useToast();
  const [followedPlan, setFollowedPlan] = useState(true);

  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      followed_plan: true,
      consumed_calories: mealData?.planned.calories || 0,
      consumed_protein: mealData?.planned.protein || 0,
      consumed_carbs: mealData?.planned.carbs || 0,
      consumed_fat: mealData?.planned.fat || 0,
      custom_ingredients: mealData?.planned.ingredients.map(ing => `${ing.name} (${ing.quantity})`).join(', ') || '',
      note: '',
    },
  });

  const handleFollowedPlanChange = (checked: boolean) => {
    setFollowedPlan(checked);
    form.setValue('followed_plan', checked);
    
    if (checked && mealData) {
      // Auto-fill with planned meal data
      form.setValue('consumed_calories', mealData.planned.calories);
      form.setValue('consumed_protein', mealData.planned.protein);
      form.setValue('consumed_carbs', mealData.planned.carbs);
      form.setValue('consumed_fat', mealData.planned.fat);
      form.setValue('custom_ingredients', 
        mealData.planned.ingredients.map(ing => `${ing.name} (${ing.quantity})`).join(', ')
      );
    }
  };

  const onSubmit = (data: TrackingFormValues) => {
    // Mock submission
    toast({
      title: 'Meal Tracked Successfully!',
      description: `${formatMealType(mealData?.meal_type || '')} tracking has been saved.`,
    });
    
    form.reset();
    onClose();
  };

  if (!mealData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Track {formatMealType(mealData.meal_type)} - {new Date(selectedDate).toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Planned Meal Reference */}
            <Card className="bg-muted/30 p-4">
              <h4 className="font-medium text-primary mb-2">Planned Meal:</h4>
              <p className="font-medium">{mealData.planned.name}</p>
              <p className="text-sm text-muted-foreground">
                {mealData.planned.ingredients.map(ing => `${ing.name} (${ing.quantity})`).join(', ')}
              </p>
              <div className="flex gap-4 mt-2 text-xs">
                <span>{mealData.planned.calories} kcal</span>
                <span>P: {mealData.planned.protein}g</span>
                <span>C: {mealData.planned.carbs}g</span>
                <span>F: {mealData.planned.fat}g</span>
              </div>
            </Card>

            {/* Follow Plan Toggle */}
            <FormField
              control={form.control}
              name="followed_plan"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">
                      Did you follow the meal plan?
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Toggle this if you ate exactly what was planned
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={handleFollowedPlanChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Custom Meal Details (shown when not following plan) */}
            {!followedPlan && (
              <div className="space-y-4 p-4 border rounded-lg bg-yellow-50">
                <h4 className="font-medium text-yellow-800">What did you actually eat?</h4>
                
                <FormField
                  control={form.control}
                  name="custom_ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredients & Quantities</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Chicken breast (200g), Rice (80g), Vegetables (100g)"
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="consumed_calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calories</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consumed_protein"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Protein (g)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consumed_carbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs (g)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consumed_fat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fat (g)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Optional Note */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this meal..."
                      {...field}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Tracking
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}