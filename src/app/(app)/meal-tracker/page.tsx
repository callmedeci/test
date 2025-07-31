import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/SectionHeader';
import { MealTrackerSection } from '@/features/meal-tracker/components/MealTrackerSection';
import { ClipboardCheck } from 'lucide-react';

export default function MealTrackerPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <SectionHeader
          icon={<ClipboardCheck className="h-8 w-8 text-primary" />}
          className="text-3xl font-bold"
          title="Meal Tracker"
          description="Track your daily meals and see how well you're following your nutrition plan."
        />
        <CardContent>
          <MealTrackerSection />
        </CardContent>
      </Card>
    </div>
  );
}