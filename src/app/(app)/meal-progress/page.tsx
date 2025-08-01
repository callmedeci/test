import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/SectionHeader';
import { MealProgressSection } from '@/features/meal-progress/components/MealProgressSection';
import { ClipboardCheck } from 'lucide-react';

export default function MealProgressPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <SectionHeader
          icon={<ClipboardCheck className="h-8 w-8 text-primary" />}
          className="text-3xl font-bold"
          title="Daily Meal Progress Tracking"
          description="Track your daily meal plan adherence and monitor your nutrition goals. Select a date to view and edit your meal tracking."
        />
        <CardContent>
          <MealProgressSection />
        </CardContent>
      </Card>
    </div>
  );
}