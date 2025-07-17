'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function editPlan(newPlan: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized access!');

  const { error } = await supabase
    .from('smart_planner')
    .update(newPlan)
    .eq('user_id', user.id)
    .single();

  if (error) return { isSuccess: false, error: error.message };

  revalidatePath('/', 'layout');
  return { isSuccess: true, error: null };
}
