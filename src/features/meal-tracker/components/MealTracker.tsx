import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/SectionHeader';
import { UtensilsCrossed } from 'lucide-react';
import MealTrackerTabs from './MealTrackerTabs';

export default function MealTracker() {
  return (
    <div className='container mx-auto py-8'>
      <Card className='shadow-xl'>
        <SectionHeader
          icon={<UtensilsCrossed className='h-8 w-8 text-primary' />}
          className='text-3xl font-bold'
          title='Meal Tracker'
          description='Track your daily meal adherence and monitor your nutrition progress over time.'
        />
        <CardContent>
          <MealTrackerTabs />
        </CardContent>
      </Card>
    </div>
  );
}