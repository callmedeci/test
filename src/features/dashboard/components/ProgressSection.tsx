import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BaseProfileData } from '@/lib/schemas';
import { calculateProgress, formatValue } from '@/lib/utils';

interface ProgressSectionProps {
  profile: BaseProfileData;
}

export function ProgressSection({ profile }: ProgressSectionProps) {
  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <Card className='border-border/50 transition-shadow duration-200'>
        <CardHeader>
          <CardTitle className='text-primary flex items-center gap-2'>
            Weight Progress
          </CardTitle>
          <CardDescription>Progress towards your 1-month goal</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-primary'>
              <span>
                Current: {formatValue(profile?.current_weight_kg, ' kg')}
              </span>
              <span>
                Target: {formatValue(profile?.target_weight_1month_kg, ' kg')}
              </span>
            </div>
            <Progress
              value={calculateProgress(
                profile?.current_weight_kg,
                profile?.target_weight_1month_kg
              )}
              className='h-3'
            />
          </div>
          <p className='text-xs text-muted-foreground'>
            Long-term goal:{' '}
            {formatValue(profile?.long_term_goal_weight_kg, ' kg')}
          </p>
        </CardContent>
      </Card>

      <Card className='border-border/50 transition-shadow duration-200'>
        <CardHeader>
          <CardTitle className='text-primary flex items-center gap-2'>
            Body Composition
          </CardTitle>
          <CardDescription>Body fat and muscle mass targets</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-primary'>
              <span>Body Fat</span>
              <span>
                {formatValue(profile?.bf_current, '%')} /{' '}
                {formatValue(profile?.bf_target, '%')}
              </span>
            </div>
            <Progress
              value={
                profile?.bf_current && profile?.bf_target
                  ? Math.max(
                      0,
                      100 - (profile.bf_current / profile.bf_target) * 100
                    )
                  : 0
              }
              className='h-3'
            />
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-primary'>
              <span>Muscle Mass</span>
              <span>
                {formatValue(profile?.mm_current, '%')} /{' '}
                {formatValue(profile?.mm_target, '%')}
              </span>
            </div>
            <Progress
              value={calculateProgress(profile?.mm_current, profile?.mm_target)}
              className='h-3'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
