'use server';

import { createClient } from '@/lib/supabase/server';
import {
  getUser,
  getProfileById,
  getUserDataById,
} from '@/lib/supabase/data-service';

export interface CoachProfile {
  user_id: string;
  certification: string[];
  joined_date: string;
  description: string;
  years_experience: number;
  age: number;
  biological_sex: string;
  full_name: string;
}

export interface CoachClient {
  user_id: string;
  age: number;
  biological_sex: string;
  primary_diet_goal?: 'fat_loss' | 'muscle_gain' | 'recomp' | null;
  created_at: string;
  full_name: string;
}

export interface CoachClientRequest {
  id: number;
  status: 'pending' | 'accepted' | 'declined';
  requested_at: string;
  client_email: string;
}

export interface PendingClientRequest extends CoachClientRequest {
  coach_id: string;
  client_email: string;
  request_message: string | null;
  approval_token: string | null;
  responded_at: string | null;
  response_message: string | null;
  created_at: string;
}

export async function getCoachClients(): Promise<CoachClient[]> {
  const supabase = await createClient();
  const user = await getUser();

  const { data: clients, error: reqError } = await supabase
    .from('coach_clients')
    .select('client_id')
    .eq('coach_id', user.id)
    .eq('status', 'accepted');

  if (reqError) {
    throw new Error(`Failed to fetch clients: ${reqError.message}`);
  }

  if (!clients || clients.length === 0) {
    return [];
  }

  const clientsProfile = await Promise.all(
    clients.map(async (client) => {
      const profile = await getProfileById(
        client.client_id,
        'client',
        'user_id, age, biological_sex, primary_diet_goal, created_at'
      );
      const userData = await getUserDataById(client.client_id);

      return {
        ...profile,
        full_name: userData.user_metadata?.full_name || 'Unknown User',
      };
    })
  );

  return clientsProfile;
}

export async function getCoachProfile(): Promise<CoachProfile> {
  const supabase = await createClient();
  const user = await getUser();

  const { data: coach, error: coachError } = await supabase
    .from('coaches')
    .select(
      'user_id, certification, joined_date, description, years_experience'
    )
    .eq('user_id', user.id)
    .single();

  if (!coach || coachError) {
    throw new Error(
      `Failed to fetch coach profile: ${
        coachError?.message || 'Coach not found'
      }`
    );
  }

  const profile = await getProfileById(
    coach.user_id,
    'client',
    'user_id, age, biological_sex'
  );
  const userData = await getUserDataById(coach.user_id);

  return {
    ...userData.user_metadata,
    ...profile,
    ...coach,
    full_name: userData.user_metadata?.full_name || 'Unknown Coach',
  };
}

export async function getRecentCoachClientRequests(
  limit: number = 5
): Promise<CoachClientRequest[]> {
  const supabase = await createClient();
  const user = await getUser();

  const { data: requests, error: reqError } = await supabase
    .from('coach_client_requests')
    .select('status, requested_at, client_email, id')
    .eq('coach_id', user.id)
    .order('requested_at', { ascending: false })
    .limit(limit);

  if (reqError) {
    throw new Error(`Failed to fetch recent requests: ${reqError.message}`);
  }

  return requests || [];
}

export async function getPendingClientRequests(): Promise<
  PendingClientRequest[]
> {
  const supabase = await createClient();
  const user = await getUser();

  const { data: requests, error: reqError } = await supabase
    .from('coach_client_requests')
    .select('*')
    .eq('coach_id', user.id)
    .eq('status', 'pending')
    .order('requested_at', { ascending: false });

  if (reqError) {
    throw new Error(`Failed to fetch pending requests: ${reqError.message}`);
  }

  return requests || [];
}

export async function verifyCoachClientAccess(
  coachId: string,
  clientId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('coach_clients')
    .select('id')
    .eq('coach_id', coachId)
    .eq('client_id', clientId)
    .eq('status', 'accepted')
    .single();

  if (error || !data) return false;
  return true;
}

export async function getCoachClientIds(coachId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('coach_clients')
    .select('client_id')
    .eq('coach_id', coachId)
    .eq('status', 'accepted');

  if (error || !data) return [];
  return data.map((item) => item.client_id);
}

export async function checkCoachAccess(clientId: string): Promise<{
  hasAccess: boolean;
  isCoach: boolean;
  coachId?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { hasAccess: false, isCoach: false };

    // Check if user is a coach by looking in coaches table
    const { data: coachData } = await supabase
      .from('coaches')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (!coachData) {
      return { hasAccess: false, isCoach: false };
    }

    const hasAccess = await verifyCoachClientAccess(user.id, clientId);

    return {
      hasAccess,
      isCoach: true,
      coachId: user.id,
    };
  } catch (error) {
    console.error('Error checking coach access:', error);
    return { hasAccess: false, isCoach: false };
  }
}
