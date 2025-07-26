'use client';

import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { useTransition } from 'react';
import { grantAccessAction } from '../../actions/grantAccess';
import Spinner from '@/components/ui/Spinner';

function ApproveButton({
  userId,
  coachId,
  reqId,
}: {
  userId: string;
  coachId: string;
  reqId: string;
}) {
  const [isLoading, startTransition] = useTransition();

  async function handleGrantAccess() {
    startTransition(
      async () => await grantAccessAction(userId, coachId, reqId)
    );
  }

  return (
    <Button
      variant='outline'
      className='w-full'
      onClick={handleGrantAccess}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : <ShieldCheck className='size-7' />}
      Yes, Grant Access
    </Button>
  );
}

export default ApproveButton;
