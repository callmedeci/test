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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { MealType, PlannedMeal, TrackedMeal } from '../types';

const trackMealSchema = z.object({
  followed: z.enum(['true', 'false'], {
    required_error: 'Please select whether you followed the plan.',
  }),
  consumedMeal: z.string().optional(),
  quantity: z.string().optional(),
  calories: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.followed === 'false') {
    return data.consumedMeal && data.consumedMeal.trim().length > 0;
  }
  return true;
}, {
  message: 'Please describe what you ate instead.',
  path: ['consumedMeal'],
});

type TrackMealFormValues = z.infer<typeof trackMealSchema>;

interface TrackMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
  plannedMeal?: PlannedMeal;
  existingTracking?: TrackedMeal;
  date: string;
}

export default function TrackMealModal({
  isOpen,
  onClose,
  mealType,
  plannedMeal,
  existingTracking,
  date,
}: TrackMealModalProps) {
  const { toast } = useToast();

  const form = useForm<TrackMealFormValues>({
    resolver: zodResolver(trackMealSchema),
    defaultValues: {
      followed: existingTracking ? (existingTracking.followed ? 'true' : 'false') : undefined,
      consumedMeal: existingTracking?.consumedMeal || '',
      quantity: existingTracking?.quantity || '',
      calories: existingTracking?.calories || undefined,
      notes: existingTracking?.notes || '',
    },
  });

  const watchedFollowed = form.watch('followed');

  const handleSubmit = (data: TrackMealFormValues) => {
    // Mock save logic
    const followed = data.followed === 'true';
    
    toast({
      title: 'Meal Tracked',
      description: followed 
        ? `Marked ${mealType} as followed for ${new Date(date).toLocaleDateString()}`
        : `Tracked alternative meal for ${mealType}`,
    });

    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Track {mealType}</DialogTitle>
          <DialogDescription>
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            {/* Planned Meal Display */}
            {plannedMeal && (
              <div className='p-3 bg-muted/50 rounded-md'>
                <h4 className='text-sm font-medium mb-1'>Planned Meal:</h4>
                <p className='text-sm'>{plannedMeal.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {plannedMeal.calories} kcal • {plannedMeal.ingredients.join(', ')}
                </p>
              </div>
            )}

            {/* Did you follow the plan? */}
            <FormField
              control={form.control}
              name='followed'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Did you follow the planned meal?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className='flex flex-col space-y-2'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='true' id='followed-yes' />
                        <label htmlFor='followed-yes' className='text-sm cursor-pointer'>
                          Yes, I followed the plan
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='false' id='followed-no' />
                        <label htmlFor='followed-no' className='text-sm cursor-pointer'>
                          No, I had something different
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alternative meal details (only if not followed) */}
            {watchedFollowed === 'false' && (
              <div className='space-y-4 p-4 bg-muted/30 rounded-md'>
                <FormField
                  control={form.control}
                  name='consumedMeal'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What did you eat instead?</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., Scrambled eggs with toast'
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
                    name='quantity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g., 2 slices, 1 bowl'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='calories'
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
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type='submit'>
                <Save className='h-4 w-4 mr-2' />
                Save Tracking
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}