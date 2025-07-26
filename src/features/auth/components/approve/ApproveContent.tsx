import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import ErrorMessage from '@/components/ui/ErrorMessage';
import ApproveButton from '@/features/auth/components/approve/ApproveButton';
import { getUser } from '@/lib/supabase/data-service';
import { createClient } from '@/lib/supabase/server';
import { User } from 'lucide-react';
import Link from 'next/link';

async function ApproveContent({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    requestId?: string;
    coachId?: string;
  }>;
}) {
  const params = await searchParams;
  const { requestId, token, coachId } = params;

  // Validate required parameters
  if (!token || !requestId || !coachId) {
    return (
      <ErrorMessage
        title='Invalid Request Link'
        message='The access request link is missing required information. Please check the link or contact the coach who sent it.'
        showRetry={false}
        showHomeLink={false}
      />
    );
  }

  try {
    const supabase = await createClient();
    const user = await getUser();

    // Verify the request exists and is valid
    const { data: request, error: reqError } = await supabase
      .from('coach_client_requests')
      .select('id, coach_id, client_email, request_message, status')
      .eq('approval_token', token)
      .eq('coach_id', coachId)
      .eq('id', requestId)
      .single();

    if (!request || reqError) {
      throw new Error(
        reqError?.code === 'PGRST116'
          ? 'Request not found or has expired'
          : `Invalid request: ${reqError?.message}`
      );
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      throw new Error(
        `This request has already been ${request.status}. No further action is needed.`
      );
    }

    // Check if client already has this coach
    const { data: existingRelation, error: relationError } = await supabase
      .from('coach_clients')
      .select('id, status')
      .eq('client_id', user.id)
      .eq('coach_id', coachId)
      .single();

    if (relationError && relationError.code !== 'PGRST116') {
      throw new Error(`Database error: ${relationError.message}`);
    }

    if (existingRelation) {
      throw new Error(
        `You already have a ${existingRelation.status} relationship with this coach.`
      );
    }

    // Get coach information for display
    const { data: coach, error: coachError } = await supabase
      .from('coaches')
      .select('user_id')
      .eq('user_id', coachId)
      .single();

    if (!coach || coachError) {
      throw new Error('Coach information not found');
    }

    // Get coach user details
    const { data: coachUser, error: coachUserError } = await supabase
      .from('profile')
      .select('name')
      .eq('user_id', coachId)
      .single();

    const coachName = coachUser?.name || 'Your Coach';

    return (
      <div className='space-y-6'>
        <div className='text-center space-y-3'>
          <div className='flex items-center justify-center gap-2 text-primary'>
            <User className='h-5 w-5' />
            <span className='font-medium'>{coachName}</span>
          </div>
          
          {request.request_message && (
            <div className='p-4 bg-muted/50 rounded-lg border'>
              <p className='text-sm text-muted-foreground mb-1'>Message from coach:</p>
              <p className='text-sm'>{request.request_message}</p>
            </div>
          )}

          <p className='text-muted-foreground'>
            By granting access, this coach will be able to view your nutrition
            profile and help you create personalized meal plans.
          </p>
        </div>

        <div className='space-y-3'>
          <ApproveButton
            userId={user.id}
            coachId={coachId}
            reqId={requestId}
            token={token}
          />
          
          <Button asChild variant='outline' className='w-full bg-transparent'>
            <Link href='/dashboard'>
              Cancel and Go to Dashboard
            </Link>
          </Button>
        </div>

        <div className='text-center'>
          <p className='text-xs text-muted-foreground'>
            You can revoke coach access anytime from your profile settings.
          </p>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <ErrorMessage
        title='Request Validation Failed'
        message={error?.message || 'Unable to process the access request.'}
        showRetry={false}
        showHomeLink={false}
      />
    );
  }
}

  const supabase = await createClient();
  const user = await getUser();

  const { data: request, error: reqError } = await supabase
    .from('coach_client_requests')
    .select('id')
    .eq('approval_token', token)
    .eq('coach_id', coachId)
    .eq('id', requestId)
    .single();

  if (!request || reqError)
    throw new Error(`Invalid token ${reqError?.message}`);

  //CHECK IF THAT client already exists
  const { data, error } = await supabase
    .from('coach_clients')
    .select('id')
    .eq('client_id', user.id)
    .limit(1);

  if (error) throw new Error(`Fetch failed ${error.message}`);
  if (data?.length !== 0) throw new Error('The client already exists');

  return (
    <CardContent>
      <p className='mb-6 text-muted-foreground text-center'>
        Are you sure you want to grant access to your dashboard?
      </p>

      <ApproveButton coachId={coachId} userId={user.id} reqId={request.id} />
    </CardContent>
  );
}

export default ApproveContent;
