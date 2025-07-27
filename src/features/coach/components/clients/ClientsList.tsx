import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCoachClients } from '@/lib/supabase/database/coach-service';
import { Users, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';

export async function ClientsList() {
  try {
    const clients = await getCoachClients();

    if (!clients || clients.length === 0) {
      return (
        <EmptyState
          icon={Users}
          title="No Clients Yet"
          description="You haven't accepted any clients yet. Check your pending requests or share your coaching profile to get started."
          actionLabel="View Requests"
          onAction={() => window.location.href = '/coach-dashboard/requests'}
        />
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Accepted Clients ({clients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <Link key={client.user_id} href={`/coach-dashboard/clients/${client.user_id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{client.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Age: {client.age} • {client.biological_sex}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {client.primary_diet_goal}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Started: {new Date(client.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    return (
      <ErrorMessage
        title="Failed to Load Clients"
        message={error instanceof Error ? error.message : 'Unable to fetch your clients'}
        showRetry={true}
        onRetry={() => window.location.reload()}
      />
    );
  }
}