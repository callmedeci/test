import PDFSection from '@/features/tools/components/pdf-preview/PDFSection';
import { Suspense } from 'react';

async function CoachReportspage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  return (
    <Suspense>
      <PDFSection clientId={clientId} />
    </Suspense>
  );
}

export default CoachReportspage;
