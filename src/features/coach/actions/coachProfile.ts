'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { CoachProfileFormValues } from '../schemas/coachSchemas';

export async function saveCoachProfile(profileData: CoachProfileFormValues) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(`Authentication error: ${authError.message}`);
    }
    if (!user) {
      throw new Error('Unauthorized access!');
    }

    // TODO: Replace with actual database save operation
    // For now, we'll just log the data
    console.log('Saving coach profile:', {
      user_id: user.id,
      ...profileData,
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('saveCoachProfile error:', error);
    throw new Error('Failed to save coach profile');
  }
}

export async function saveCoachOnboarding(onboardingData: CoachProfileFormValues & { user_role: 'coach' }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(`Authentication error: ${authError.message}`);
    }
    if (!user) {
      throw new Error('Unauthorized access!');
    }

    // TODO: Replace with actual database save operation
    console.log('Saving coach onboarding:', {
      user_id: user.id,
      is_onboarding_complete: true,
      ...onboardingData,
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('saveCoachOnboarding error:', error);
    throw new Error('Failed to complete coach onboarding');
  }
}