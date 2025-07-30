import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/SectionHeader';
import { BaseProfileData } from '@/lib/schemas';
import { formatValue } from '@/lib/utils';
import { Activity, Calendar, Target, TrendingUp, User } from 'lucide-react';

interface ProfileSummaryCardProps {
  profile: BaseProfileData;
}

export default function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  const profileStats = [
    {
      icon: User,
      label: 'Age',
      value: formatValue(profile.age, ' years'),
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: TrendingUp,
      label: 'Activity Level',
      value: profile.physical_activity_level || 'Not set',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Target,
      label: 'Primary Goal',
      value: profile.primary_diet_goal || 'Not set',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Activity,
      label: 'Exercise Frequency',
      value: profile.exercise_frequency || 'Not set',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <Card className='border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 shadow-lg'>
      <SectionHeader
        className='text-xl font-semibold'
        title='Your Fitness Profile'
        description='Current fitness information from your profile'
        icon={<User className='h-5 w-5 text-primary' />}
      />
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {profileStats.map((stat, index) => (
            <div
              key={index}
              className='text-center p-4 bg-card rounded-lg shadow-sm border border-border/50'
            >
              <div className='flex items-center justify-center mb-3'>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className='h-5 w-5' />
                </div>
              </div>
              <p className='text-sm font-medium text-muted-foreground mb-2'>
                {stat.label}
              </p>
              <Badge variant='secondary' className='font-semibold'>
                {stat.value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}