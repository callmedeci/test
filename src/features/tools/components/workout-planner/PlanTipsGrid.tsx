'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Heart, TrendingUp, Utensils } from 'lucide-react';
import { ExercisePlan } from '../../types/exerciseTypes';

interface PlanTipsGridProps {
  plan: ExercisePlan;
}

export default function PlanTipsGrid({ plan }: PlanTipsGridProps) {
  const tipSections = [
    {
      title: 'Progression Tips',
      tips: plan.progressionTips || [],
      icon: TrendingUp,
      color: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
      arrowColor: 'text-blue-500',
    },
    {
      title: 'Safety Notes',
      tips: plan.safetyNotes || [],
      icon: Heart,
      color: 'border-red-200 bg-gradient-to-br from-red-50 to-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-700',
      arrowColor: 'text-red-500',
    },
    {
      title: 'Nutrition Tips',
      tips: plan.nutritionTips || [],
      icon: Utensils,
      color: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-700',
      arrowColor: 'text-green-500',
    },
  ];

  const visibleSections = tipSections.filter(section => section.tips.length > 0);

  if (visibleSections.length === 0) return null;

  return (
    <div className='grid md:grid-cols-3 gap-6'>
      {visibleSections.map((section, index) => (
        <Card key={index} className={section.color}>
          <CardHeader>
            <CardTitle className={`${section.iconColor} flex items-center gap-2`}>
              <section.icon className='h-5 w-5' />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3'>
              {section.tips.map((tip, tipIdx) => (
                <li
                  key={tipIdx}
                  className={`flex items-start gap-2 text-sm ${section.textColor}`}
                >
                  <ArrowRight className={`h-4 w-4 mt-0.5 ${section.arrowColor} flex-shrink-0`} />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}