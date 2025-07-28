
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function CoachClientsNotFound() {
  return (
    <ErrorMessage
      title="Page Not Found"
      message="The clients page you're looking for doesn't exist."
      showHomeLink={true}
    />
  );
}
