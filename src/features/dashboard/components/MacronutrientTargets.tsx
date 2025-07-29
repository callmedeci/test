import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserPlanType } from '@/lib/schemas';
import { formatValue } from '@/lib/utils';

interface MacronutrientTargetsProps {
  userPlan: UserPlanType;
}

export function MacronutrientTargets({ userPlan }: MacronutrientTargetsProps) {
  const macros = [
    {
      name: 'Protein',
      grams: userPlan?.target_protein_g,
      percentage: userPlan?.target_protein_percentage,
      color: 'bg-blue-500',
    },
    {
      name: 'Carbohydrates',
      grams: userPlan?.target_carbs_g,
      percentage: userPlan?.target_carbs_percentage,
      color: 'bg-green-500',
    },
    {
      name: 'Fat',
      grams: userPlan?.target_fat_g,
      percentage: userPlan?.target_fat_percentage,
      color: 'bg-orange-500',
    },
  ];

  return (
    <Card className='border-border/50 hover:shadow-md transition-shadow duration-200'>
      <CardHeader>
        <CardTitle className='text-primary'>
          Daily Macronutrient Targets
        </CardTitle>
        <CardDescription>
          Your personalized macro breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-6 lg:grid-cols-3'>
          {macros.map((macro) => (
            <div key={macro.name} className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='font-medium flex items-center gap-2'>
                  <div className={`w-3 h-3 rounded-full ${macro.color}`} />
                  {macro.name}
                </span>
                <span className='font-mono'>
                  {formatValue(macro.grams?.toFixed(1), 'g')} (
                  {formatValue(macro.percentage?.toFixed(1), '%')})
                </span>
              </div>
              <Progress
                value={macro.percentage || 0}
                className='h-2'
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}