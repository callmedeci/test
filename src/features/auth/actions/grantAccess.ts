'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type GrantAccessResult = {
  success: boolean;
  error?: string;
};

export async function grantAccessAction(
  userId: string,
  coachId: string,
  reqId: string,
  token: string
): Promise<GrantAccessResult> {
  const supabase = await createClient();

  try {
    // Verify the request is still valid and pending
    const { data: request, error: requestError } = await supabase
      .from('coach_client_requests')
      .select('id, status')
      .eq('id', reqId)
      .eq('coach_id', coachId)
      .eq('approval_token', token)
      .single();

    if (!request || requestError) {
      return {
        success: false,
        error: 'Request not found or has expired.',
      };
    }

    if (request.status !== 'pending') {
      return {
        success: false,
        error: `Request has already been ${request.status}.`,
      };
    }

    // Check if relationship already exists
    const { data: existingRelation, error: relationCheckError } = await supabase
      .from('coach_clients')
      .select('id')
      .eq('client_id', userId)
      .eq('coach_id', coachId)
      .single();

    if (relationCheckError && relationCheckError.code !== 'PGRST116') {
      return {
        success: false,
        error: 'Failed to verify existing relationships.',
      };
    }

    if (existingRelation) {
      return {
        success: false,
        error: 'You already have a relationship with this coach.',
      };
    }

    // Create the coach-client relationship
    const { error: insertError } = await supabase
      .from('coach_clients')
      .insert({
        client_id: userId,
        coach_id: coachId,
        status: 'accepted',
        responded_at: new Date().toISOString(),
      })
      .single();

    if (insertError) {
      return {
        success: false,
        error: 'Failed to create coach-client relationship.',
      };
    }

    // Update the request status to accepted
    const { error: updateError } = await supabase
      .from('coach_client_requests')
      .update({
        status: 'accepted',
        responded_at: new Date().toISOString(),
      })
      .eq('id', reqId);

    if (updateError) {
      // Try to rollback the coach_clients insert
      await supabase
        .from('coach_clients')
        .delete()
        .eq('client_id', userId)
        .eq('coach_id', coachId);
      
      return {
        success: false,
        error: 'Failed to update request status.',
      };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('grantAccessAction error:', error);
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred.',
    };
  }
}


    revalidatePath('/', 'layout');
  } catch (error) {
    console.log(error);
  }
}
