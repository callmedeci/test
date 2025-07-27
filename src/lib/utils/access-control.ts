import { createClient } from '@/lib/supabase/server';

/**
 * Verifies if a coach has access to a specific client
 * @param coachId - The coach's user ID
 * @param clientId - The client's user ID
 * @returns Promise<boolean> - True if access is granted
 */
export async function verifyCoachClientAccess(
  coachId: string,
  clientId: string
): Promise<boolean> {
  try {
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
  } catch (error) {
    console.error('Error verifying coach-client access:', error);
    return false;
  }
}

/**
 * Gets all clients for a specific coach
 * @param coachId - The coach's user ID
 * @returns Promise<string[]> - Array of client IDs
 */
export async function getCoachClients(coachId: string): Promise<string[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('coach_clients')
      .select('client_id')
      .eq('coach_id', coachId)
      .eq('status', 'accepted');

    if (error || !data) return [];

    return data.map((item) => item.client_id);
  } catch (error) {
    console.error('Error fetching coach clients:', error);
    return [];
  }
}

/**
 * Checks if current user is a coach and has access to client
 * @param clientId - The client's user ID
 * @returns Promise<{ hasAccess: boolean; isCoach: boolean }>
 */
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

    // Check if user is a coach
    const { data: coachData } = await supabase
      .from('coaches')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (!coachData) return { hasAccess: false, isCoach: false };

    // Check if coach has access to this client
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