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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TrackedMeal, MealType } from '../types';

const trackMealSchema = z.object({
  followed: z.enum(['true', 'false'], {
    required_error: 'Please select whether you followed the plan',
  }),
  consumedMeal: z.string().optional(),
  quantity: z.string().optional(),
  calories: z.coerce.number().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.followed === 'false') {
    return data.consumedMeal && data.consumedMeal.trim().length > 0;
  }
  return true;
}, {
  message: 'Please describe what you ate instead',
  path: ['consumedMeal'],
});

type TrackMealFormValues = z.infer<typeof trackMealSchema>;

interface TrackMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
  existingTracking?: TrackedMeal;
  date: string;
  onSave: (data: Partial<TrackedMeal>) => void;
}

export function TrackMealModal({
  isOpen,
  onClose,
  mealType,
  existingTracking,
  date,
  onSave
}: TrackMealModalProps) {
  const { toast } = useToast();

  const form = useForm<TrackMealFormValues>({
    resolver: zodResolver(trackMealSchema),
    defaultValues: {
      followed: existingTracking ? (existingTracking.followed ? 'true' : 'false') : undefined,
      consumedMeal: existingTracking?.consumedMeal || '',
      quantity: existingTracking?.quantity || '',
      calories: existingTracking?.calories,
      notes: existingTracking?.notes || '',
    },
  });

  const watchedFollowed = form.watch('followed');

  const handleSubmit = (data: TrackMealFormValues) => {
    const trackingData: Partial<TrackedMeal> = {
      id: existingTracking?.id || `track_${Date.now()}`,
      date,
      mealType,
      followed: data.followed === 'true',
      consumedMeal: data.followed === 'false' ? data.consumedMeal : undefined,
      quantity: data.followed === 'false' ? data.quantity : undefined,
      calories: data.followed === 'false' ? data.calories : undefined,
      notes: data.notes || undefined,
    };

    onSave(trackingData);
    
    toast({
      title: 'Meal Tracked',
      description: `${mealType} tracking has been ${existingTracking ? 'updated' : 'saved'}.`,
    });

    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Track {mealType}</DialogTitle>
          <DialogDescription>
            Record whether you followed your planned meal for {mealType.toLowerCase()} on {date}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="followed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Did you follow your planned meal?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="followed-yes" />
                        <label htmlFor="followed-yes" className="text-sm font-medium cursor-pointer">
                          Yes, I followed the planned meal
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="followed-no" />
                        <label htmlFor="followed-no" className="text-sm font-medium cursor-pointer">
                          No, I ate something different
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedFollowed === 'false' && (
              <>
                <FormField
                  control={form.control}
                  name="consumedMeal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What did you eat instead?</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Chicken Caesar Salad"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 1 large bowl, 2 slices"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Calories (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 450"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : parseInt(e.target.value, 10)
                            )
                          }
                          onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this meal..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit">
                {existingTracking ? 'Update' : 'Save'} Tracking
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}