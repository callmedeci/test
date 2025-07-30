import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target } from 'lucide-react';
import { PlanStats } from '../../types/exerciseTypes';

interface PlanStatsCardProps {
  stats: PlanStats;
}

export default function PlanStatsCard({ stats }: PlanStatsCardProps) {
  const statItems = [
    {
      icon: Calendar,
      label: 'Weekly Workouts',
      value: stats.totalWorkouts.toString(),
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Clock,
      label: 'Average Duration',
      value: `${stats.avgDuration} min`,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Target,
      label: 'Total Weekly Time',
      value: `${Math.round(stats.totalDuration / 60)}h`,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {statItems.map((stat, index) => (
        <div
          key={index}
          className='text-center p-6 bg-card rounded-lg shadow-sm border border-border/50'
        >
          <div className='flex items-center justify-center mb-3'>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className='h-6 w-6' />
            </div>
          </div>
          <div className='text-3xl font-bold text-primary mb-2'>
            {stat.value}
          </div>
          <p className='text-sm text-muted-foreground font-medium'>
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}