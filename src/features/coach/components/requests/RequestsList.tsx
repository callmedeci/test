
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPendingClientRequests } from '@/lib/supabase/database/coach-service';
import { Clock, Mail, MailOpen, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';

export async function RequestsList() {
  try {
    const requests = await getPendingClientRequests();

    if (!requests || requests.length === 0) {
      return (
        <EmptyState
          icon={MailOpen}
          title="No Pending Requests"
          description="You don't have any pending client requests at the moment. Share your coaching profile or send requests to potential clients."
          actionLabel="Send New Request"
          onAction={() => {
            // This would typically open a modal or navigate to a send request page
            console.log('Send new request clicked');
          }}
        />
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">{request.client_email}</span>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          {request.status}
                        </Badge>
                      </div>
                      {request.request_message && (
                        <p className="text-sm text-muted-foreground">
                          "{request.request_message}"
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Requested: {new Date(request.requested_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    return (
      <ErrorMessage
        title="Failed to Load Requests"
        message={error instanceof Error ? error.message : 'Unable to fetch pending requests'}
        showRetry={true}
        onRetry={() => window.location.reload()}
      />
    );
  }
}
