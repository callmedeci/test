
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function CoachDashboardNotFound() {
  return (
    <ErrorMessage
      title="Page Not Found"
      message="The dashboard page you're looking for doesn't exist."
      showHomeLink={true}
    />
  );
}
