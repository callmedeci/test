import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCoachClientRequests } from '../../lib/data-service';
import RequestsList from './RequestsList';

export async function PendingRequestsSection() {
  const requests = await getCoachClientRequests();
  if (!requests?.length) return <p>No pending requests</p>;

  return (
    <Card className='border border-border/50'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold'>
            Pending Requests
          </CardTitle>
          <Badge variant='secondary' className='text-xs'>
            {requests.length} pending
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <RequestsList requests={requests} />
      </CardContent>
    </Card>
  );
}
