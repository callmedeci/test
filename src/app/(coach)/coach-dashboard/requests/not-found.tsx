
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function CoachRequestsNotFound() {
  return (
    <ErrorMessage
      title="Page Not Found"
      message="The requests page you're looking for doesn't exist."
      showHomeLink={true}
    />
  );
}
