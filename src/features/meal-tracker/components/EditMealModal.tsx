'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import SubmitButton from '@/components/ui/SubmitButton';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Target, Utensils } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TrackedMeal } from '../types';

const editMealSchema = z.object({
  followed_plan: z.boolean(),
  actual_meal: z.string().min(1, 'Please enter what you actually ate'),
  actual_quantity: z.string().min(1, 'Please enter the quantity'),
  actual_calories: z.coerce.number().min(0, 'Calories must be 0 or greater'),
  notes: z.string().optional(),
});

type EditMealFormData = z.infer<typeof editMealSchema>;

interface EditMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: TrackedMeal | null;
  dayName: string;
}

export function EditMealModal({ isOpen, onClose, meal, dayName }: EditMealModalProps) {
  const { toast } = useToast();

  const form = useForm<EditMealFormData>({
    resolver: zodResolver(editMealSchema),
    defaultValues: {
      followed_plan: meal?.followed_plan ?? true,
      actual_meal: meal?.actual_meal ?? meal?.planned_meal ?? '',
      actual_quantity: meal?.actual_quantity ?? '',
      actual_calories: meal?.actual_calories ?? meal?.planned_calories ?? 0,
      notes: meal?.notes ?? '',
    },
  });

  const watchedFollowedPlan = form.watch('followed_plan');

  function handleClose() {
    form.reset();
    onClose();
  }

  async function onSubmit(data: EditMealFormData) {
    // Mock submission - just show success toast
    toast({
      title: 'Meal Updated',
      description: `${meal?.meal_type} for ${dayName} has been updated successfully.`,
    });
    
    handleClose();
  }

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold flex items-center gap-2'>
            <Utensils className='h-5 w-5 text-primary' />
            Edit {meal.meal_type}
          </DialogTitle>
          <DialogDescription>
            Update your meal tracking for {dayName}
          </DialogDescription>
        </DialogHeader>

        {/* Planned Meal Info */}
        <div className='p-3 bg-primary/5 rounded-lg border border-primary/20'>
          <div className='flex items-center gap-2 mb-2'>
            <Target className='h-4 w-4 text-primary' />
            <span className='text-sm font-medium text-primary'>Planned Meal</span>
          </div>
          <p className='text-sm font-medium'>{meal.planned_meal}</p>
          <p className='text-xs text-muted-foreground'>{meal.planned_calories} kcal</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Did you follow the plan? */}
            <FormField
              control={form.control}
              name='followed_plan'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between p-3 border rounded-lg'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-sm font-medium'>
                      Did you follow the planned meal?
                    </FormLabel>
                    <div className='text-xs text-muted-foreground'>
                      Toggle if you ate exactly what was planned
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Actual meal details */}
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='actual_meal'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      What did you actually eat?
                      {!watchedFollowedPlan && (
                        <Badge variant='secondary' className='ml-2 text-xs'>
                          Different from plan
                        </Badge>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={watchedFollowedPlan ? meal.planned_meal : 'e.g., Chocolate cake'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='actual_quantity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., 1 slice, 2 cups'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='actual_calories'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Calories</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='e.g., 350'
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : parseInt(e.target.value, 10)
                            )
                          }
                          onWheel={(e) =>
                            (e.currentTarget as HTMLInputElement).blur()
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Any additional notes about this meal...'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
              >
                Cancel
              </Button>
              <SubmitButton
                isLoading={form.formState.isSubmitting}
                loadingLabel='Saving...'
                label='Save Changes'
                icon={<Save className='h-4 w-4' />}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}