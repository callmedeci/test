'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const entryFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  weight_kg: z.coerce
    .number()
    .min(20, 'Weight must be at least 20kg')
    .max(500, 'Weight must be less than 500kg'),
  body_fat_percentage: z.coerce
    .number()
    .min(0, 'Body fat percentage must be at least 0%')
    .max(100, 'Body fat percentage must be less than 100%'),
  waist_cm: z.coerce
    .number()
    .min(30, 'Waist measurement must be at least 30cm')
    .max(200, 'Waist measurement must be less than 200cm'),
  notes: z.string().optional(),
});

type EntryFormValues = z.infer<typeof entryFormSchema>;

export function WeeklyEntryForm() {
  const { toast } = useToast();

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entryFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Today's date
      weight_kg: undefined,
      body_fat_percentage: undefined,
      waist_cm: undefined,
      notes: '',
    },
  });

  const onSubmit = (data: EntryFormValues) => {
    // Mock submission - just show success toast
    console.log('Mock submission:', data);
    
    toast({
      title: 'Progress Entry Added!',
      description: `Weight: ${data.weight_kg}kg, Body Fat: ${data.body_fat_percentage}%, Waist: ${data.waist_cm}cm`,
    });

    // Reset form after "submission"
    form.reset({
      date: new Date().toISOString().split('T')[0],
      weight_kg: undefined,
      body_fat_percentage: undefined,
      waist_cm: undefined,
      notes: '',
    });
  };

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className='shadow-lg'>
      <CardHeader>
        <CardTitle className='text-xl flex items-center gap-2 text-primary'>
          <Plus className='h-5 w-5' />
          Add Weekly Progress Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        max={today}
                        {...field}
                        className='cursor-pointer'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='weight_kg'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.1'
                        placeholder='e.g., 75.2'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === '' ? undefined : parseFloat(e.target.value)
                          )
                        }
                        onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='body_fat_percentage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Fat (%)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.1'
                        placeholder='e.g., 18.5'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === '' ? undefined : parseFloat(e.target.value)
                          )
                        }
                        onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='waist_cm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waist (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.1'
                        placeholder='e.g., 85.0'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === '' ? undefined : parseFloat(e.target.value)
                          )
                        }
                        onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
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
                      placeholder='How are you feeling? Any observations about your progress...'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full md:w-auto'
              disabled={form.formState.isSubmitting}
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Progress Entry
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}