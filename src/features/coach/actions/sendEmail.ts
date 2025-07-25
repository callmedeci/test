'use server';

import { createClient } from '@/lib/supabase/server';
import type { SendRequestResult } from '../types';

export async function sendWelcomeEmail(
  emailTo: string,
  html: string,
  subject: string
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.functions.invoke('email-smtp', {
      body: {
        to: emailTo,
        subject,
        html,
      },
    });

    if (error) throw new Error(error);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function sendApprovalRequest(
  approverEmail: string,
  requestMessage: string
): Promise<SendRequestResult> {
  const supabase = await createClient();
  
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error(`Authentication error: ${authError?.message || 'User not found'}`);
    }

    // Check if user is trying to send request to their own email
    if (user.email === approverEmail) {
      return {
        success: false,
        error: 'You cannot send a request to your own email address.',
      };
    }

    // Check if request already exists for this email
    const { data: existingRequest, error: checkError } = await supabase
      .from('coach_client_requests')
      .select('id, status')
      .eq('coach_id', user.id)
      .eq('client_user_id', approverEmail) // Using email as identifier for now
      .eq('status', 'pending')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Failed to check existing requests: ${checkError.message}`);
    }

    if (existingRequest) {
      return {
        success: false,
        error: 'A request has already been sent to this email and is pending response.',
      };
    }

    // Create new request in database
    const { data: request, error: reqError } = await supabase
      .from('coach_client_requests')
      .insert({
        coach_id: user.id,
        client_user_id: approverEmail, // Using email as identifier for now
        request_message: requestMessage,
        status: 'pending',
      })
      .select()
      .single();

    if (reqError) {
      throw new Error(`Failed to create request: ${reqError.message}`);
    }

    // Send email notification
    try {
      const { error: emailError } = await supabase.functions.invoke(
        'send-approval-email',
        {
          body: {
            requestId: request.id,
            approverEmail: approverEmail,
            requestDetails: requestMessage,
            coachName: user.user_metadata?.full_name || user.email,
          },
        }
      );

      if (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't throw here - request was created successfully
        // Just log the email error
      }
    } catch (emailError) {
      console.error('Email service error:', emailError);
      // Continue - request was created successfully
    }

    return {
      success: true,
      requestId: request.id,
    };

  } catch (error: any) {
    console.error('sendApprovalRequest error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred while sending the request.',
    };
  }
}