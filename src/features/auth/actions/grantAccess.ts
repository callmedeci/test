'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function grantAccessAction(
  userId: string,
  coachId: string,
  reqId: string
) {
  const supabase = await createClient();

  try {
    await supabase
      .from('coach_clients')
      .insert([{ client_id: userId, status: 'accepted', coach_id: coachId }])
      .single();

    const { error } = await supabase
      .from('coach_client_requests')
      .delete()
      .eq('coach_id', coachId)
      .eq('id', reqId);

    if (error) throw new Error(error.message);

    revalidatePath('/', 'layout');
  } catch (error) {
    console.log(error);
  }
}
