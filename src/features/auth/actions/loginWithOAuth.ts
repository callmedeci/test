import { createClient } from '@/lib/supabase/client';

export async function loginWithGoogle() {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `http://localhost:3000/api/auth/callback`,
    },
  });

  if (error) throw new Error(`Google sign-in failed: ${error.message}`);
}
