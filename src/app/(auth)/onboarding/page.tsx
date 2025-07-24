'use client';

import LoadingScreen from '@/components/ui/LoadingScreen';
import { UserRoleSelection } from '@/features/auth/components/onboarding/UserRoleSelection';
import { CoachOnboardingForm } from '@/features/coach/components/onboarding/CoachOnboardingForm';
import ClientOnboardingForm from '@/features/auth/components/onboarding/ClientOnboardingForm';
import { useState } from 'react';

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<'client' | 'coach' | null>(null);

  function handleRoleSelected(role: 'client' | 'coach') {
    setSelectedRole(role);
  }

  if (!selectedRole) {
    return <UserRoleSelection onRoleSelected={handleRoleSelected} />;
  }

  if (selectedRole === 'coach') {
    return <CoachOnboardingForm />;
  }

  return <ClientOnboardingForm />;
}
