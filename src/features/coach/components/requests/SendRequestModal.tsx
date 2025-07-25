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
import { Textarea } from '@/components/ui/textarea';
import SubmitButton from '@/components/ui/SubmitButton';
import { useToast } from '@/hooks/use-toast';
import { sendApprovalRequest } from '@/features/coach/actions/sendEmail';
import {
  SendClientRequestSchema,
  type SendClientRequestValues,
} from '@/features/coach/schemas/coachSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface SendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendRequestModal({ isOpen, onClose }: SendRequestModalProps) {
  const { toast } = useToast();

  const form = useForm<SendClientRequestValues>({
    resolver: zodResolver(SendClientRequestSchema),
    defaultValues: {
      approver_email: '',
      request_message: 'Hi! I would like to be your nutrition coach and help you achieve your health goals. Please consider accepting my coaching request.',
    },
  });

  async function handleSubmit(data: SendClientRequestValues) {
    try {
      const result = await sendApprovalRequest(
        data.approver_email,
        data.request_message
      );

      if (result.success) {
        toast({
          title: 'Request Sent Successfully',
          description: `Your coaching request has been sent to ${data.approver_email}. They will receive an email notification.`,
        });
        
        form.reset();
        onClose();
      } else {
        toast({
          title: 'Request Failed',
          description: result.error || 'Failed to send request. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Unexpected Error',
        description: error?.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  }

  function handleClose() {
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Send Coaching Request
          </DialogTitle>
          <DialogDescription>
            Send a personalized coaching request to a potential client via email.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='approver_email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='client@example.com'
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='request_message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Write a personalized message to introduce yourself and explain why you would like to be their coach...'
                      rows={4}
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <SubmitButton
                isLoading={form.formState.isSubmitting}
                loadingLabel='Sending...'
                label='Send Request'
                icon={<Send className='h-4 w-4' />}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}