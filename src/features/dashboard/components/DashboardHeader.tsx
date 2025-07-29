import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/SectionHeader';
import { Download } from 'lucide-react';
import Link from 'next/link';

export function DashboardHeader() {
  return (
    <div className='flex items-center justify-between'>
      <SectionHeader
        className='text-2xl'
        title='Dashboard'
        description='Overview of your nutrition journey and progress'
      />
      <Link href='/pdf'>
        <Button className='bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200'>
          <Download className='h-4 w-4 mr-2' />
          Download PDF Report
        </Button>
      </Link>
    </div>
  );
}