'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GlobalCalculatedTargets } from '@/lib/schemas';
import { formatNumber } from '@/lib/utils';

function CustomizePlanTable({
  plan,
}: {
  plan: GlobalCalculatedTargets | null;
}) {
  if (!plan) return null;

  return (
    <div className='mt-6'>
      <h4 className='text-xl font-semibold mb-2 text-primary'>
        Your Custom Plan Breakdown
      </h4>

      <Table>
        <TableHeader>
          <TableRow>
            {/* */}
            <TableHead>Macronutrient</TableHead>
            {/* */}
            <TableHead className='text-right'>% of Daily Calories</TableHead>
            {/* */}
            <TableHead className='text-right'>Grams per Day</TableHead>
            {/* */}
            <TableHead className='text-right'>Calories per Day</TableHead>
            {/* */}
          </TableRow>
          {/* */}
        </TableHeader>
        <TableBody>
          <TableRow>
            {/* */}
            <TableCell className='font-medium'>Protein</TableCell>
            {/* */}
            <TableCell className='text-right'>
              {plan.custom_protein_percentage
                ? formatNumber(plan.custom_protein_percentage)
                : 'N/A'}
              %
            </TableCell>
            {/* */}
            <TableCell className='text-right'>
              {plan.custom_protein_g
                ? formatNumber(plan.custom_protein_g)
                : 'N/A'}{' '}
              g
            </TableCell>
            {/* */}
            <TableCell className='text-right'>
              {plan.protein_calories
                ? formatNumber(plan.protein_calories)
                : 'N/A'}{' '}
              kcal
            </TableCell>
            {/* */}
          </TableRow>
          {/* */}
          <TableRow>
            {/* */}
            <TableCell className='font-medium'>Carbohydrates</TableCell>
            {/* */}
            <TableCell className='text-right'>
              {plan.custom_carbs_percentage
                ? formatNumber(plan.custom_carbs_percentage)
                : 'N/A'}
              %
            </TableCell>
            {/* */}
            <TableCell className='text-right'>
              {plan.custom_carbs_g ? formatNumber(plan.custom_carbs_g) : 'N/A'}{' '}
              g
            </TableCell>
            {/* */}
            <TableCell className='text-right'>
              {plan.carb_calories ? formatNumber(plan.carb_calories) : 'N/A'}{' '}
              kcal
            </TableCell>
            {/* */}
          </TableRow>
          {/* */}
          <TableRow>
            {/* */}
            <TableCell className='font-medium'>Fat</TableCell>
            {/* */}
            <TableCell className='text-right'>
              {plan.custom_fat_percentage
                ? formatNumber(plan.custom_fat_percentage)
                : 'N/A'}
              %
            </TableCell>
            {/* */}
            <TableCell className='text-right'>
              {plan.custom_fat_g ? formatNumber(plan.custom_fat_g) : 'N/A'} g
            </TableCell>
            {/* */}
            <TableCell className='text-right'>
              {plan.fat_calories ? formatNumber(plan.fat_calories) : 'N/A'} kcal
            </TableCell>
            {/* */}
          </TableRow>
          {/* */}
          <TableRow className='font-semibold bg-muted/50'>
            {/* */}
            <TableCell>Total</TableCell>
            {/* */}
            <TableCell className='text-right'>100%</TableCell>
            {/* */}
            <TableCell className='text-right'>-</TableCell>
            {/* */}
            <TableCell className='text-right'>
              {plan.custom_total_calories_final
                ? formatNumber(plan.custom_total_calories_final)
                : 'N/A'}{' '}
              kcal
            </TableCell>
            {/* */}
          </TableRow>
          {/* */}
        </TableBody>
      </Table>
    </div>
  );
}

export default CustomizePlanTable;
