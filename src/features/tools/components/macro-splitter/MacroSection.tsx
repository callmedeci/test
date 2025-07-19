import { CardContent } from '@/components/ui/card';
import { getUserPlan, getUserProfile } from '@/lib/supabase/data-service';
import Link from 'next/link';
import MacroForm from './MacroForm';

async function MacroSection() {
  try {
    const plan = await getUserPlan();
    const profile = await getUserProfile();

    return <MacroForm plan={plan} profile={profile} />;
  } catch (error: any) {
    return (
      <CardContent>
        <div className='text-destructive text-center p-4 border border-destructive/50 rounded-md bg-destructive/10'>
          <p className='mb-2'>{error}</p>
          <p className='text-sm'>
            Please ensure your profile is complete or use the{' '}
            <Link
              href='/tools/smart-calorie-planner'
              className='underline hover:text-destructive/80'
            >
              Smart Calorie Planner
            </Link>{' '}
            to set your targets.
          </p>
        </div>
      </CardContent>
    );
  }
}

export default MacroSection;
