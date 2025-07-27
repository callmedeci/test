import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { getProfileById, getUserDataById } from '@/lib/supabase/data-service';
import { formatValue } from '@/lib/utils';
import { User, Target, Activity, Heart } from 'lucide-react';

interface CoachClientProfileProps {
  clientId: string;
}

export async function CoachClientProfile({
  clientId,
}: CoachClientProfileProps) {
  try {
    const profile = await getProfileById(clientId, 'client');
    const userData = await getUserDataById(clientId);

    const formatArray = (arr: string[] | null | undefined, fallback = 'None') => {
      if (!arr || arr.length === 0) return fallback;
      return arr.join(', ');
    };

    return (
      <div className='space-y-6'>
        {/* Client Header */}
        <Card className='border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5'>
          <CardHeader>
            <CardTitle className='text-xl flex items-center gap-2 text-primary'>
              <User className='h-5 w-5' />
              {userData?.full_name || userData?.email || 'Client Profile'}
            </CardTitle>
            <CardDescription>
              Complete health and nutrition profile overview
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-primary'>
              <Target className='h-5 w-5' />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='font-medium'>Age:</span>
                <span>{formatValue(profile.age, ' years')}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Biological Sex:</span>
                <span className='capitalize'>
                  {profile.biological_sex || 'Not specified'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Height:</span>
                <span>{formatValue(profile.height_cm, ' cm')}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Current Weight:</span>
                <span>{formatValue(profile.current_weight_kg, ' kg')}</span>
              </div>
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='font-medium'>Target Weight (1M):</span>
                <span>{formatValue(profile.target_weight_1month_kg, ' kg')}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Long-term Goal:</span>
                <span>{formatValue(profile.long_term_goal_weight_kg, ' kg')}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Activity Level:</span>
                <Badge variant='outline' className='capitalize'>
                  {profile.physical_activity_level || 'Not set'}
                </Badge>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Diet Goal:</span>
                <Badge variant='default' className='capitalize'>
                  {profile.primary_diet_goal?.replace('_', ' ') || 'Not set'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Body Composition */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-primary'>
              <Activity className='h-5 w-5' />
              Body Composition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <h4 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide'>
                  Body Fat Percentage
                </h4>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Current:</span>
                    <span>{formatValue(profile.bf_current, '%')}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Target:</span>
                    <span>{formatValue(profile.bf_target, '%')}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Ideal:</span>
                    <span>{formatValue(profile.bf_ideal, '%')}</span>
                  </div>
                </div>
              </div>
              <div className='space-y-3'>
                <h4 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide'>
                  Muscle Mass Percentage
                </h4>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Current:</span>
                    <span>{formatValue(profile.mm_current, '%')}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Target:</span>
                    <span>{formatValue(profile.mm_target, '%')}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Ideal:</span>
                    <span>{formatValue(profile.mm_ideal, '%')}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diet Preferences & Health */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-primary'>
              <Heart className='h-5 w-5' />
              Diet Preferences & Health
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='space-y-3'>
                <div>
                  <span className='font-medium text-sm'>Preferred Diet:</span>
                  <p className='text-muted-foreground'>
                    {profile.preferred_diet || 'No preference specified'}
                  </p>
                </div>
                <div>
                  <span className='font-medium text-sm'>Allergies:</span>
                  <p className='text-muted-foreground'>
                    {formatArray(profile.allergies)}
                  </p>
                </div>
                <div>
                  <span className='font-medium text-sm'>Preferred Cuisines:</span>
                  <p className='text-muted-foreground'>
                    {formatArray(profile.preferred_cuisines)}
                  </p>
                </div>
                <div>
                  <span className='font-medium text-sm'>
                    Disliked Cuisines:
                  </span>
                  <p className='text-muted-foreground'>
                    {formatArray(profile.dispreferrred_cuisines)}
                  </p>
                </div>
              </div>
              <div className='space-y-3'>
                <div>
                  <span className='font-medium text-sm'>
                    Preferred Ingredients:
                  </span>
                  <p className='text-muted-foreground'>
                    {formatArray(profile.preferred_ingredients)}
                  </p>
                </div>
                <div>
                  <span className='font-medium text-sm'>
                    Disliked Ingredients:
                  </span>
                  <p className='text-muted-foreground'>
                    {formatArray(profile.dispreferrred_ingredients)}
                  </p>
                </div>
                <div>
                  <span className='font-medium text-sm'>Medical Conditions:</span>
                  <p className='text-muted-foreground'>
                    {formatArray(profile.medical_conditions)}
                  </p>
                </div>
                <div>
                  <span className='font-medium text-sm'>Medications:</span>
                  <p className='text-muted-foreground'>
                    {formatArray(profile.medications)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Information */}
        {(profile.exercise_goals ||
          profile.preferred_exercise_types ||
          profile.exercise_frequency) && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-primary'>
                <Activity className='h-5 w-5' />
                Exercise Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between'>
                <span className='font-medium'>Exercise Goals:</span>
                <span className='text-muted-foreground'>
                  {formatArray(profile.exercise_goals)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Preferred Exercise Types:</span>
                <span className='text-muted-foreground'>
                  {formatArray(profile.preferred_exercise_types)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Exercise Frequency:</span>
                <span className='text-muted-foreground'>
                  {profile.exercise_frequency || 'Not specified'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Exercise Intensity:</span>
                <span className='text-muted-foreground'>
                  {profile.typical_exercise_intensity || 'Not specified'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error: any) {
    return (
      <ErrorMessage
        title='Profile Data Unavailable'
        message={
          error?.message ||
          "We couldn't load this client's profile data. Please ensure you have access to this client."
        }
      />
    );
  }
}