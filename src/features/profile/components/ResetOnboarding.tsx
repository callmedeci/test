'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { useResetProfile } from '../hooks/useResetProfile';

function ResetOnboarding() {
  const { resetProfile, isReseting } = useResetProfile();

  return (
    <Card className='mt-12 border-destructive/50'>
      <CardHeader>
        <CardTitle className='text-lg flex items-center text-destructive'>
          <AlertTriangle className='mr-2 h-5 w-5' /> Developer Tools
        </CardTitle>
        <CardDescription>
          Use these tools for testing purposes only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={isReseting}
          variant='destructive'
          onClick={async () => await resetProfile()}
          className='w-full'
        >
          <RefreshCcw className='mr-2 h-4 w-4' /> Reset Onboarding Status
        </Button>
        <p className='text-xs text-muted-foreground mt-2'>
          This will set your onboarding status to incomplete, allowing you to go
          through the onboarding flow again. The page will reload.
        </p>
      </CardContent>
    </Card>
  );
}

export default ResetOnboarding;
