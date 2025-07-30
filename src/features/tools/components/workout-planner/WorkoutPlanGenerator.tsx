'use client';

import { toast } from '@/hooks/use-toast';
import { BaseProfileData } from '@/lib/schemas';
import { useState, useTransition } from 'react';
import { ExercisePlan } from '../../types/exerciseTypes';
import WorkoutPlannerContent from './WorkoutPlannerContent';

interface WorkoutPlanGeneratorProps {
  profile: BaseProfileData;
}

export default function WorkoutPlanGenerator({ profile }: WorkoutPlanGeneratorProps) {
  return <WorkoutPlannerContent profile={profile} />;
}