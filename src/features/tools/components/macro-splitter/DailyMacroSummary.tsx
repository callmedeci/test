'use client';

import { CardContent } from '@/components/ui/card';
import Spinner from '@/components/ui/Spinner';
import { useGetPlan } from '@/features/profile/hooks/useGetPlan';
import { formatNumber } from '@/lib/utils';
import { Info } from 'lucide-react';
import Link from 'next/link';

function DailyMacroSummary() {
  const { isLoadingPlan, userPlan, planError } = useGetPlan();

  if (planError)
    return (
      <CardContent>
        <div className='text-destructive text-center p-4 border border-destructive/50 rounded-md bg-destructive/10'>
          <p className='mb-2'>
            Could not load or calculate your total daily macros.
          </p>
          <p className='text-sm'>
            Please ensure your profile is complete or use the{' '}
            <Link
              href='/tools/smart-calorie-planner'
              className='underline hover:text-destructive/80'
            >
              Smart Calorie Planner
            </Link>{' '}
            to set your targets.
          </p>
        </div>
      </CardContent>
    );

  if (isLoadingPlan || !userPlan)
    return (
      <CardContent>
        <div className='w-full flex items-center justify-center gap-1 p-4 border rounded-md bg-muted/50'>
          <Spinner />
          <p>Loading your data...</p>
        </div>
      </CardContent>
    );

  const hasCustomMacros =
    userPlan.custom_total_calories ||
    userPlan.custom_protein_g ||
    userPlan.custom_carbs_g ||
    userPlan.custom_fat_g;

  const message = hasCustomMacros
    ? 'Daily totals are based on your manual macro breakdown from the Smart Planner.'
    : 'Daily totals are calculated from your profile targets. Use the Smart Planner to set custom macros.';

  return (
    <CardContent>
      <h3 className='text-xl font-semibold mb-1 text-primary'>
        Your Estimated Total Daily Macros:
      </h3>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-md bg-muted/50 mb-3'>
        <p>
          <span className='font-medium'>Calories:</span>{' '}
          {formatNumber(
            userPlan.custom_total_calories || userPlan.target_daily_calories,
            { maximumFractionDigits: 0 }
          )}{' '}
          kcal
        </p>
        <p>
          <span className='font-medium'>Protein:</span>{' '}
          {formatNumber(
            userPlan.custom_protein_g ?? userPlan.target_protein_g,
            { minimumFractionDigits: 1, maximumFractionDigits: 1 }
          )}{' '}
          g
        </p>
        <p>
          <span className='font-medium'>Carbs:</span>{' '}
          {formatNumber(userPlan.custom_carbs_g ?? userPlan.target_carbs_g, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}{' '}
          g
        </p>
        <p>
          <span className='font-medium'>Fat:</span>{' '}
          {formatNumber(userPlan.custom_fat_g ?? userPlan.target_fat_g, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}{' '}
          g
        </p>
      </div>
      {message && (
        <div className='text-sm text-muted-foreground flex items-center gap-2 p-2 rounded-md border border-dashed bg-background'>
          <Info className='h-4 w-4 text-accent shrink-0' />
          <span>{message}</span>
        </div>
      )}
    </CardContent>
  );
}

export default DailyMacroSummary;
