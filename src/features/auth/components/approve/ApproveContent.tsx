import { CardContent } from '@/components/ui/card';
import ApproveButton from '@/features/auth/components/approve/ApproveButton';
import { getUser } from '@/lib/supabase/data-service';
import { createClient } from '@/lib/supabase/server';

async function ApproveContent({
  searchParams,
}: {
  searchParams: Promise<{ token: string; requestId: string; coachId: string }>;
}) {
  const params = await searchParams;
  const { requestId, token, coachId } = params;

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
