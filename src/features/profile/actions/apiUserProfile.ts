'use server';

import { createClient } from '@/lib/supabase/server';
import { UserAttributes } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { editPlan } from './apiUserPlan';

export async function editProfile(newProfile: any, newUser?: UserAttributes) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized access!');

  const { error } = await supabase
    .from('users')
    .update(newProfile)
    .eq('user_id', user.id)
    .single();

  if (error) return { isSuccess: false, error: error.message };

  if (newUser) {
    const { error: userError } = await supabase.auth.updateUser({ ...newUser });
    if (userError) return { isSuccess: false, error: userError.message };
  }

  revalidatePath('/', 'layout');
  return { isSuccess: true, error: null };
}

export async function resetProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized access!');

  const { data: userProfile, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (userError) throw new Error(userError.message);

  const { data: plan, error: planError } = await supabase
    .from('smart_planner')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (planError) throw new Error(planError.message);

  const protectedFields = ['id', 'user_id', 'created_at'];

  const updateProfile: Record<string, any> = {};
  const updatePlan: Record<string, any> = {};

  Object.keys(userProfile).forEach((key) => {
    if (!protectedFields.includes(key)) updateProfile[key] = null;
  });

  Object.keys(plan).forEach((key) => {
    if (!protectedFields.includes(key)) updatePlan[key] = null;
  });

  updatePlan.updated_at = new Date().toISOString();

  const profileResult = await editProfile(updateProfile);
  if (!profileResult.isSuccess)
    throw new Error(`Failed to reset profile: ${profileResult.error}`);

  const planResult = await editPlan(updatePlan);
  if (!planResult.isSuccess)
    throw new Error(`Failed to reset plan: ${planResult.error}`);
}
