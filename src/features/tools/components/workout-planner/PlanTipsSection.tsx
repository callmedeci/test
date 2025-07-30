'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Heart, TrendingUp, Utensils } from 'lucide-react';

type PlanTipsSectionProps = { generatedPlan: any };

function PlanTipsSection({ generatedPlan }: PlanTipsSectionProps) {
  return (
    <div className='grid md:grid-cols-3 gap-6 mt-12'>
      {generatedPlan.progressionTips && (
        <Card className='border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100'>
          <CardHeader>
            <CardTitle className='text-blue-800 flex items-center gap-2'>
              <TrendingUp className='w-5 h-5' />
              Progression Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              {generatedPlan.progressionTips.map((tip: string, idx: number) => (
                <li
                  key={idx}
                  className='flex items-start gap-2 text-sm text-blue-700'
                >
                  <ArrowRight className='w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0' />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {generatedPlan.safetyNotes && (
        <Card className='border-red-200 bg-gradient-to-br from-red-50 to-red-100'>
          <CardHeader>
            <CardTitle className='text-red-800 flex items-center gap-2'>
              <Heart className='w-5 h-5' />
              Safety Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              {generatedPlan.safetyNotes.map((note: string, idx: number) => (
                <li
                  key={idx}
                  className='flex items-start gap-2 text-sm text-red-700'
                >
                  <ArrowRight className='w-4 h-4 mt-0.5 text-red-500 flex-shrink-0' />
                  {note}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {generatedPlan.nutritionTips && (
        <Card className='border-green-200 bg-gradient-to-br from-green-50 to-green-100'>
          <CardHeader>
            <CardTitle className='text-green-800 flex items-center gap-2'>
              <Utensils className='w-5 h-5' />
              Nutrition Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              {generatedPlan.nutritionTips.map((tip: string, idx: number) => (
                <li
                  key={idx}
                  className='flex items-start gap-2 text-sm text-green-700'
                >
                  <ArrowRight className='w-4 h-4 mt-0.5 text-green-500 flex-shrink-0' />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PlanTipsSection;
