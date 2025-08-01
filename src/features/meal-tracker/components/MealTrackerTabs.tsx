'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { mockMealTrackingData } from '../mock/mockMealTrackingData';
import PlanTab from './PlanTab';
import ProgressTab from './ProgressTab';

export default function MealTrackerTabs() {
  const [activeTab, setActiveTab] = useState('plan');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
      <TabsList className='grid w-full grid-cols-2 bg-card backdrop-blur-sm shadow-sm'>
        <TabsTrigger
          value='plan'
          className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
        >
          <Calendar className='w-4 h-4 mr-2' />
          Daily Plan
        </TabsTrigger>
        <TabsTrigger
          value='progress'
          className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
        >
          <TrendingUp className='w-4 h-4 mr-2' />
          Progress
        </TabsTrigger>
      </TabsList>

      <TabsContent value='plan' className='space-y-6 mt-6'>
        <PlanTab trackingData={mockMealTrackingData} />
      </TabsContent>

      <TabsContent value='progress' className='space-y-6 mt-6'>
        <ProgressTab trackingData={mockMealTrackingData} />
      </TabsContent>
    </Tabs>
  );
}