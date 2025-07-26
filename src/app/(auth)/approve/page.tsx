import { Card, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/ui/Spinner';
import ApproveContent from '@/features/auth/components/approve/ApproveContent';
import { AlertTriangleIcon } from 'lucide-react';
import { Suspense } from 'react';

export async function ApprovePage({
  searchParams,
}: {
  searchParams: Promise<{ token: string; requestId: string; coachId: string }>;
}) {
  return (
    <Card>
      <CardTitle>
        <div className='mx-auto my-4 flex items-center justify-center gap-1'>
          <AlertTriangleIcon className='szie-12 text-accent' />
          <h3 className='text-xl font-semibold text-foreground'>
            Confirm Access
          </h3>
        </div>
      </CardTitle>

      <Suspense
        fallback={
          <div className='w-full my-8 flex items-center justify-center'>
            <Spinner />
          </div>
        }
      >
        <ApproveContent searchParams={searchParams} />
      </Suspense>
    </Card>
  );
}

export default ApprovePage;
