import { createClient } from '@/lib/supabase/client';
import { getURL } from '@/lib/utils';

export async function loginWithGoogle() {
  const redirectTo = `${getURL()}api/auth/callback`;
  console.log('⛔⛔⛔', getURL(), '⛔⛔⛔');
  console.log('✅✅✅', redirectTo, '✅✅✅');

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://test-siah-lashkar.vercel.app/api/auth/callback',
    },
  });

  if (error) throw new Error(`Google sign-in failed: ${error.message}`);
}
