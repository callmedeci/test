import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseProfileData, UserPlanType } from '@/lib/schemas';
import { formatValue } from '@/lib/utils';
import { Activity, Calendar, Target, TrendingUp } from 'lucide-react';

interface NutritionStatsCardsProps {
  profile: BaseProfileData;
  userPlan: UserPlanType;
}

export function NutritionStatsCards({
  profile,
  userPlan,
}: NutritionStatsCardsProps) {
  const statsData = [
    {
      title: 'Current Weight',
      value: formatValue(profile?.current_weight_kg, ' kg'),
      subtitle: `Target: ${formatValue(
        profile?.target_weight_1month_kg,
        ' kg'
      )}`,
      icon: TrendingUp,
    },
    {
      title: 'Daily Calories',
      value: formatValue(userPlan?.target_daily_calories, ' kcal'),
      subtitle: `TDEE: ${formatValue(
        userPlan?.maintenance_calories_tdee,
        ' kcal'
      )}`,
      icon: Target,
    },
    {
      title: 'Body Fat %',
      value: formatValue(profile?.bf_current, '%'),
      subtitle: `Target: ${formatValue(profile?.bf_target, '%')}`,
      icon: Activity,
    },
    {
      title: 'Activity Level',
      value: profile?.physical_activity_level || 'Not set',
      subtitle: `Goal: ${profile?.primary_diet_goal || 'Not set'}`,
      icon: Calendar,
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className='border-border/50 transition-colors duration-200'
        >
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              {stat.title}
            </CardTitle>
            <div className='p-2 rounded-lg'>
              <stat.icon className='h-4 w-4' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary mb-1'>
              {stat.value}
            </div>
            <p className='text-xs text-muted-foreground'>{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
