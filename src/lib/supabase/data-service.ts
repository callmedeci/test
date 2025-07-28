'use server';

import { UserProfile, UserMealPlan, UserPlan } from '@/lib/schemas';
import { User } from '@supabase/supabase-js';
import { createClient } from './server';

export async function getUser(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  return user;
}
export async function getUserProfile(
  userId?: string
): Promise<UserProfile> {
  const supabase = await createClient();
  const targetUserId = userId || (await getUser()).id;

  const { data } = await supabase
    .from('user_profile')
    .select('*')
    .eq('user_id', targetUserId)
    .single();

  if (!data) throw new Error('User profile not found');

  return data as UserProfile;
}

export async function getMealPlan(userId?: string): Promise<UserMealPlan> {
  const supabase = await createClient();
  const targetUserId = userId || (await getUser()).id;

  if (!targetUserId) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_meal_plan')
    .select('*')
    .eq('user_id', targetUserId)
    .single();

  if (error) {
    if (error.code === 'PGRST116')
      throw new Error('No meal plan found for this user');

    throw new Error(`Failed to fetch meal plan: ${error.message}`);
  }

  return data as UserMealPlan;
}
export async function getUserPlan(userId?: string): Promise<UserPlan> {
  const supabase = await createClient();
  const targetUserId = userId || (await getUser()).id;

  if (!targetUserId) throw new Error('User not authenticated');

  const { data } = await supabase
    .from('user_plan')
    .select('*')
    .eq('user_id', targetUserId)
    .single();

  if (!data) throw new Error('User plan not found');

  return data as UserPlan;
}

export async function getProfileById(
  userId: string,
  userRole: 'client' | 'coach' = 'client',
  select: string = '*'
): Promise<UserProfile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_profile')
    .select(select)
    .eq('user_id', userId)
    .single<UserProfile>();

  if (!data || error) throw new Error('User profile not found');

  return data;
}
export async function getUserDataById(userId: string): Promise<User> {
  const supabase = await createClient();
  try {
    const {
      data: { user: userData },
      error,
    } = await supabase.auth.admin.getUserById(userId);

    if (error) throw new Error(`Failed to fetch user data: ${error.message}`);

    if (!userData) throw new Error(`User with ID ${userId} not found`);

    return userData;
  } catch (error) {
    console.error('Error in getPrefix:', error);
    throw error;
  }
}
