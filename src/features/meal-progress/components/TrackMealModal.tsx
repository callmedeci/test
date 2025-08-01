'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { MealProgress, MealType, PlannedMeal } from '../types';
import { formatMealTypeName } from '../lib/utils';

const trackMealSchema = z.object({
  followed_plan: z.boolean(),
  consumed_calories: z.coerce.number().min(0),
  consumed_protein: z.coerce.number().min(0),
  consumed_carbs: z.coerce.number().min(0),
  consumed_fat: z.coerce.number().min(0),
  custom_ingredients: z.array(z.object({
    name: z.string().min(1, 'Ingredient name is required'),
    quantity: z.string().min(1, 'Quantity is required'),
  })).optional(),
  note: z.string().optional(),
});

type TrackMealFormValues = z.infer<typeof trackMealSchema>;

interface TrackMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
  plannedMeal?: PlannedMeal;
  existingProgress?: MealProgress;
  selectedDate: string;
  onSave: (data: Omit<MealProgress, 'id' | 'user_id'>) => void;
}

export function TrackMealModal({
  isOpen,
  onClose,
  mealType,
  plannedMeal,
  existingProgress,
  selectedDate,
  onSave,
}: TrackMealModalProps) {
  const [followedPlan, setFollowedPlan] = useState<boolean>(true);

  const form = useForm<TrackMealFormValues>({
    resolver: zodResolver(trackMealSchema),
    defaultValues: {
      followed_plan: true,
      consumed_calories: 0,
      consumed_protein: 0,
      consumed_carbs: 0,
      consumed_fat: 0,
      custom_ingredients: [{ name: '', quantity: '' }],
      note: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'custom_ingredients',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (existingProgress) {
        // Editing existing progress
        form.reset({
          followed_plan: existingProgress.followed_plan,
          consumed_calories: existingProgress.consumed_calories,
          consumed_protein: existingProgress.consumed_protein,
          consumed_carbs: existingProgress.consumed_carbs,
          consumed_fat: existingProgress.consumed_fat,
          custom_ingredients: existingProgress.custom_ingredients || [{ name: '', quantity: '' }],
          note: existingProgress.note || '',
        });
        setFollowedPlan(existingProgress.followed_plan);
      } else if (plannedMeal) {
        // New tracking with planned meal defaults
        form.reset({
          followed_plan: true,
          consumed_calories: plannedMeal.calories,
          consumed_protein: plannedMeal.protein,
          consumed_carbs: plannedMeal.carbs,
          consumed_fat: plannedMeal.fat,
          custom_ingredients: plannedMeal.ingredients.map(ing => ({
            name: ing.name,
            quantity: ing.quantity,
          })),
          note: '',
        });
        setFollowedPlan(true);
      }
    }
  }, [isOpen, existingProgress, plannedMeal, form]);

  // Update form when followed_plan changes
  useEffect(() => {
    if (followedPlan && plannedMeal) {
      form.setValue('consumed_calories', plannedMeal.calories);
      form.setValue('consumed_protein', plannedMeal.protein);
      form.setValue('consumed_carbs', plannedMeal.carbs);
      form.setValue('consumed_fat', plannedMeal.fat);
    }
  }, [followedPlan, plannedMeal, form]);

  const handleClose = () => {
    form.reset();
    setFollowedPlan(true);
    onClose();
  };

  const onSubmit = (data: TrackMealFormValues) => {
    const progressData: Omit<MealProgress, 'id' | 'user_id'> = {
      date: selectedDate,
      meal_type: mealType,
      followed_plan: data.followed_plan,
      consumed_calories: data.consumed_calories,
      consumed_protein: data.consumed_protein,
      consumed_carbs: data.consumed_carbs,
      consumed_fat: data.consumed_fat,
      custom_ingredients: data.followed_plan ? undefined : data.custom_ingredients?.filter(ing => ing.name && ing.quantity),
      note: data.followed_plan ? undefined : data.note,
    };

    onSave(progressData);
    handleClose();
  };

  const addIngredient = () => {
    append({ name: '', quantity: '' });
  };

  const removeIngredient = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Track {formatMealTypeName(mealType)}
          </DialogTitle>
          <DialogDescription>
            Record what you ate for {formatMealTypeName(mealType).toLowerCase()} on{' '}
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Did you follow the plan? */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Did you follow your meal plan?
              </Label>
              <RadioGroup
                value={followedPlan ? 'yes' : 'no'}
                onValueChange={(value) => {
                  const followed = value === 'yes';
                  setFollowedPlan(followed);
                  form.setValue('followed_plan', followed);
                }}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="text-sm">
                    Yes, I followed the plan
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="text-sm">
                    No, I ate something else
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Custom ingredients (only if didn't follow plan) */}
            {!followedPlan && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">What did you eat?</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addIngredient}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Ingredient
                  </Button>
                </div>

                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <FormField
                        control={form.control}
                        name={`custom_ingredients.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Ingredient name"
                                {...field}
                                className="text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`custom_ingredients.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormControl>
                              <Input
                                placeholder="Qty"
                                {...field}
                                className="text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                          className="mt-0 p-2"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition values */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="consumed_calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Calories</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        disabled={followedPlan}
                        className="text-sm"
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
                    <FormLabel className="text-sm">Protein (g)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        disabled={followedPlan}
                        className="text-sm"
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
                    <FormLabel className="text-sm">Carbs (g)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        disabled={followedPlan}
                        className="text-sm"
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
                    <FormLabel className="text-sm">Fat (g)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        disabled={followedPlan}
                        className="text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes (only if didn't follow plan) */}
            {!followedPlan && (
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Notes (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Why didn't you follow the plan? Any observations..."
                        rows={3}
                        {...field}
                        className="text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Tracking
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}