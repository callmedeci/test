import { getUser, getUserProfile } from '@/lib/supabase/data-service';
import ProfileForm from './ProfileForm';

async function ProfileSection() {
  try {
    const user = await getUser();
    const profile = await getUserProfile();

    return <ProfileForm user={user} profile={profile} />;
  } catch {
    return <p>Unanable to load your data</p>;
  }
}

export default ProfileSection;
