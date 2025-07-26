import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ApproveContent from '@/features/auth/components/approve/ApproveContent';
import { ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';

export default async function ApprovePage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    requestId?: string;
    coachId?: string;
  }>;
}) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md'>
        <Card className='shadow-xl border-border/50'>
          <CardHeader className='text-center'>
            <div className='flex justify-center items-center mb-4'>
              <div className='h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center'>
                <ShieldCheck className='h-8 w-8 text-primary' />
              </div>
            </div>
            <CardTitle className='text-2xl font-bold text-foreground'>
              Coach Access Request
            </CardTitle>
            <CardDescription>
              A nutrition coach has requested access to help you with your
              health journey.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Suspense fallback={<LoadingScreen loadingLabel='Verifying request...' />}>
              <ApproveContent searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
