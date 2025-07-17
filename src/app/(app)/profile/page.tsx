import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/SectionHeader';
import ProfileForm from '@/features/profile/components/ProfileForm';
import ResetOnboarding from '@/features/profile/components/ResetOnboarding';

export default function ProfilePage() {
  return (
    <Card className='max-w-xl mx-auto shadow-lg'>
      <SectionHeader
        className='text-3xl font-bold'
        title='Your Account'
        description='Manage your account and related preferences.'
      />

      <CardContent>
        <ProfileForm />
        <ResetOnboarding />
      </CardContent>
    </Card>
  );
}
