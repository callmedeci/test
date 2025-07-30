'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Spinner from '@/components/ui/Spinner';
import { Textarea } from '@/components/ui/textarea';
import {
  loadSavedPreferences,
  savePreferences,
} from '@/features/tools/actions/apiExercise';
import GeneratedPlanSection from '@/features/tools/components/workout-planner/GeneratedPlanSection';
import {
  commonMedications,
  equipmentOptions,
  exerciseExperiences,
  medicalConditions,
  muscleGroups,
} from '@/features/tools/lib/config';
import { toast } from '@/hooks/use-toast';
import { ExercisePlannerFormData, exercisePlannerSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Clock,
  Dumbbell,
  Heart,
  Save,
  Target,
  Trash2,
  TrendingUp,
  Wand2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ExercisePlannerPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>(
    {}
  );

  const form = useForm<ExercisePlannerFormData>({
    resolver: zodResolver(exercisePlannerSchema),
    defaultValues: {
      fitness_level: undefined,
      exercise_experience: [],
      exercise_experience_other: '',
      existing_medical_conditions: [],
      existing_medical_conditions_other: '',
      injuries_or_limitations: '',
      current_medications: [],
      current_medications_other: '',
      doctor_clearance: false,
      primary_goal: undefined,
      secondary_goal: '',
      goal_timeline_weeks: 1,
      target_weight_kg: 0,
      muscle_groups_focus: [],
      exercise_days_per_week: 1,
      available_time_per_session: 15,
      preferred_time_of_day: undefined,
      exercise_location: undefined,
      daily_step_count_avg: 0,
      job_type: undefined,
      available_equipment: [],
      available_equipment_other: '',
      machines_access: false,
      space_availability: undefined,
      want_to_track_progress: true,
      weekly_checkins_enabled: true,
      accountability_support: true,
      preferred_difficulty_level: undefined,
      sleep_quality: undefined,
    },
    mode: 'onChange',
  });

  const selectedExerciseExperience = form.watch('exercise_experience') || [];
  const selectedMedicalConditions =
    form.watch('existing_medical_conditions') || [];
  const selectedEquipment = form.watch('available_equipment') || [];
  const selectedMedications = form.watch('current_medications') || [];

  const toggleDayExpansion = (dayKey: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayKey]: !prev[dayKey],
    }));
  };

  const onSubmit = async (data: ExercisePlannerFormData) => {
    setIsGenerating(true);
    try {
      const { isSuccess, error } = await savePreferences(data);

      if (isSuccess)
        toast({
          title: 'Success',
          description: 'Preferences saved successfully!',
        });
      else
        toast({
          title: 'Error saving preferences',
          description:
            error instanceof Error ? error.message : 'Please try again.',
        });
      console.log('Generating exercise plan with preferences:', data);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 120000);

      const response = await fetch('/api/exercise-planner/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: data,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', response.status, errorText);
        let errorMessage = 'Failed to generate exercise plan';
        if (response.status === 500) {
          errorMessage =
            'Server error occurred while generating your plan. This might be due to high demand or complex requirements.';
        } else if (response.status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (response.status >= 400 && response.status < 500) {
          errorMessage =
            'Invalid request. Please check your inputs and try again.';
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Exercise plan generated:', result);

      let planData = null;
      if (result.plan?.weekly_plan?.parsed_plan) {
        planData = result.plan.weekly_plan.parsed_plan;
      } else if (result.parsed_plan) {
        planData = result.parsed_plan;
      } else if (result.generated_content) {
        try {
          planData = JSON.parse(result.generated_content);
        } catch (e) {
          console.error('Failed to parse generated content:', e);
          planData = { error: 'Failed to parse generated plan' };
        }
      }

      if (planData) {
        setGeneratedPlan(planData);
        localStorage.setItem('generatedExercisePlan', JSON.stringify(planData));
        if (planData.weeklyPlan && typeof planData.weeklyPlan === 'object') {
          const allDays = Object.keys(planData.weeklyPlan);
          const expandedDaysObject = allDays.reduce((acc, day) => {
            acc[day] = true;
            return acc;
          }, {} as { [key: string]: boolean });
          setExpandedDays(expandedDaysObject);
        }
        alert('Exercise plan generated successfully!');
      } else {
        throw new Error('No valid plan data received from server');
      }
    } catch (error: any) {
      console.error('Error generating exercise plan:', error);
      if (error.name === 'AbortError') {
        alert(
          'Request timed out after 2 minutes. Please try again. If the problem persists, try reducing the number of exercise days.'
        );
      } else if (error.message?.includes('Failed to fetch')) {
        alert(
          'Network error occurred. Please check your connection and try again.'
        );
      } else {
        const errorMessage = error?.message || 'Unknown error occurred';
        alert(
          `Error generating exercise plan: ${errorMessage}. Please try again.`
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const savedPlan = localStorage.getItem('generatedExercisePlan');
    if (savedPlan) {
      try {
        const parsedPlan = JSON.parse(savedPlan);
        setGeneratedPlan(parsedPlan);
        if (
          parsedPlan.weeklyPlan &&
          typeof parsedPlan.weeklyPlan === 'object'
        ) {
          const allDays = Object.keys(parsedPlan.weeklyPlan);
          const expandedDaysObject = allDays.reduce((acc, day) => {
            acc[day] = true;
            return acc;
          }, {} as { [key: string]: boolean });
          setExpandedDays(expandedDaysObject);
        }
      } catch (error) {
        console.error('Error parsing saved exercise plan:', error);
        localStorage.removeItem('generatedExercisePlan');
      }
    }
  }, []);

  useEffect(() => {
    async function fetchPef() {
      const { isSuccess, error, data } = await loadSavedPreferences();

      if (isSuccess && !error) {
        form.reset({
          fitness_level: data.fitness_level || undefined,
          exercise_experience: data.exercise_experience || [],
          exercise_experience_other: data.exercise_experience_other || '',
          existing_medical_conditions: data.existing_medical_conditions || [],
          existing_medical_conditions_other:
            data.existing_medical_conditions_other || '',
          injuries_or_limitations: data.injuries_or_limitations || '',
          current_medications: data.current_medications || [],
          current_medications_other: data.current_medications_other || '',
          doctor_clearance: data.doctor_clearance || false,
          primary_goal: data.primary_goal || undefined,
          secondary_goal: data.secondary_goal || '',
          goal_timeline_weeks: data.goal_timeline_weeks || 1,
          target_weight_kg: data.target_weight_kg || 0,
          muscle_groups_focus: data.muscle_groups_focus || [],
          exercise_days_per_week: data.exercise_days_per_week || 1,
          available_time_per_session: data.available_time_per_session || 15,
          preferred_time_of_day: data.preferred_time_of_day || undefined,
          exercise_location: data.exercise_location || undefined,
          daily_step_count_avg: data.daily_step_count_avg || 0,
          job_type: data.job_type || undefined,
          available_equipment: data.available_equipment || [],
          available_equipment_other: data.available_equipment_other || '',
          machines_access: data.machines_access || false,
          space_availability: data.space_availability || undefined,
          want_to_track_progress: data.want_to_track_progress ?? true,
          weekly_checkins_enabled: data.weekly_checkins_enabled ?? true,
          accountability_support: data.accountability_support ?? true,
          preferred_difficulty_level:
            data.preferred_difficulty_level || undefined,
          sleep_quality: data.sleep_quality || undefined,
        });
      }
    }

    fetchPef();
  }, [form, form.reset]);

  return (
    <div className='container mx-auto py-8 space-y-6'>
      <Card className='max-w-7xl mx-auto p-6'>
        <SectionHeader
          className='text-3xl font-bold'
          title='AI Exercise Planner'
          description='Create personalized workout plans powered by AI, tailored to your fitness level, goals, and preferences.'
          icon={<Dumbbell className='h-8 w-8 text-primary' />}
        />

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <Accordion
                type='multiple'
                defaultValue={['basic']}
                className='space-y-4'
              >
                <AccordionItem value='basic'>
                  <AccordionTrigger className='text-lg font-semibold text-green-800'>
                    <div className='flex items-center gap-2'>
                      <Dumbbell className='w-5 h-5' />
                      Basic Fitness Information
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className='pt-6 space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name='fitness_level'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fitness Level *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select fitness level' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='Beginner'>
                                      Beginner
                                    </SelectItem>
                                    <SelectItem value='Intermediate'>
                                      Intermediate
                                    </SelectItem>
                                    <SelectItem value='Advanced'>
                                      Advanced
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name='exercise_experience'
                          render={() => (
                            <FormItem>
                              <FormLabel>
                                Exercise Experience (Select all that apply)
                              </FormLabel>
                              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                                {exerciseExperiences.map((experience) => (
                                  <FormField
                                    key={experience}
                                    control={form.control}
                                    name='exercise_experience'
                                    render={({ field }) => (
                                      <FormItem
                                        key={experience}
                                        className='flex flex-row items-start space-x-3 space-y-0'
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              experience
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...(field.value || []),
                                                    experience,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) =>
                                                        value !== experience
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className='text-sm font-normal'>
                                          {experience}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {selectedExerciseExperience.includes('Other') && (
                          <FormField
                            control={form.control}
                            name='exercise_experience_other'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Other Exercise Experience</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Please specify your other exercise experience...'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='health'>
                  <AccordionTrigger className='text-lg font-semibold text-green-800'>
                    <div className='flex items-center gap-2'>
                      <Heart className='w-5 h-5' />
                      Health & Medical Information
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className='pt-6 space-y-4'>
                        <FormField
                          control={form.control}
                          name='existing_medical_conditions'
                          render={() => (
                            <FormItem>
                              <FormLabel>Existing Medical Conditions</FormLabel>
                              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                                {medicalConditions.map((condition) => (
                                  <FormField
                                    key={condition}
                                    control={form.control}
                                    name='existing_medical_conditions'
                                    render={({ field }) => (
                                      <FormItem
                                        key={condition}
                                        className='flex flex-row items-start space-x-3 space-y-0'
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              condition
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...(field.value || []),
                                                    condition,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) =>
                                                        value !== condition
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className='text-sm font-normal'>
                                          {condition}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {selectedMedicalConditions.includes('Other') && (
                          <FormField
                            control={form.control}
                            name='existing_medical_conditions_other'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Other Medical Conditions</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Please specify your other medical conditions...'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name='injuries_or_limitations'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Injuries or Physical Limitations
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder='Describe any injuries, limitations, or areas to avoid during exercise...'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='current_medications'
                          render={() => (
                            <FormItem>
                              <FormLabel>
                                Current Medications (Optional)
                              </FormLabel>
                              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                                {commonMedications.map((medication) => (
                                  <FormField
                                    key={medication}
                                    control={form.control}
                                    name='current_medications'
                                    render={({ field }) => (
                                      <FormItem
                                        key={medication}
                                        className='flex flex-row items-start space-x-3 space-y-0'
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              medication
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...(field.value || []),
                                                    medication,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) =>
                                                        value !== medication
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className='text-sm font-normal'>
                                          {medication}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {selectedMedications.includes('Other') && (
                          <FormField
                            control={form.control}
                            name='current_medications_other'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Other Current Medications</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Please specify your other medications...'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name='doctor_clearance'
                          render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className='space-y-1 leading-none'>
                                <FormLabel>
                                  I have medical clearance to exercise *
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='goals'>
                  <AccordionTrigger className='text-lg font-semibold text-green-800'>
                    <div className='flex items-center gap-2'>
                      <Target className='w-5 h-5' />
                      Fitness Goals
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className='pt-6 space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name='primary_goal'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Goal *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select primary goal' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='Lose fat'>
                                      Lose Fat
                                    </SelectItem>
                                    <SelectItem value='Build muscle'>
                                      Build Muscle
                                    </SelectItem>
                                    <SelectItem value='Increase endurance'>
                                      Increase Endurance
                                    </SelectItem>
                                    <SelectItem value='Flexibility'>
                                      Improve Flexibility
                                    </SelectItem>
                                    <SelectItem value='General fitness'>
                                      General Fitness
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='secondary_goal'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Secondary Goal (Optional)</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select secondary goal' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='Lose fat'>
                                      Lose Fat
                                    </SelectItem>
                                    <SelectItem value='Build muscle'>
                                      Build Muscle
                                    </SelectItem>
                                    <SelectItem value='Increase endurance'>
                                      Increase Endurance
                                    </SelectItem>
                                    <SelectItem value='Flexibility'>
                                      Improve Flexibility
                                    </SelectItem>
                                    <SelectItem value='General fitness'>
                                      General Fitness
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='goal_timeline_weeks'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Goal Timeline (weeks) *</FormLabel>
                                <FormControl>
                                  <Input
                                    type='number'
                                    placeholder='e.g., 12'
                                    value={field.value ?? ''}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='target_weight_kg'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Target Weight (kg) - Optional
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type='number'
                                    step='0.1'
                                    placeholder='Enter target weight'
                                    value={field.value ?? ''}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name='muscle_groups_focus'
                          render={() => (
                            <FormItem>
                              <FormLabel>Muscle Groups to Focus On</FormLabel>
                              <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                                {muscleGroups.map((group) => (
                                  <FormField
                                    key={group}
                                    control={form.control}
                                    name='muscle_groups_focus'
                                    render={({ field }) => (
                                      <FormItem
                                        key={group}
                                        className='flex flex-row items-start space-x-3 space-y-0'
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              group
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...(field.value || []),
                                                    group,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== group
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className='text-sm font-normal'>
                                          {group}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='lifestyle'>
                  <AccordionTrigger className='text-lg font-semibold text-green-800'>
                    <div className='flex items-center gap-2'>
                      <Clock className='w-5 h-5' />
                      Lifestyle & Schedule
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className='pt-6 space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name='exercise_days_per_week'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Exercise Days per Week *</FormLabel>
                                <FormControl>
                                  <Input
                                    type='number'
                                    min='1'
                                    max='7'
                                    placeholder='e.g., 3'
                                    value={field.value ?? ''}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='available_time_per_session'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Time per Session (minutes) *
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type='number'
                                    placeholder='e.g., 60'
                                    value={field.value ?? ''}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='preferred_time_of_day'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Time of Day *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select preferred time' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='Morning'>
                                      Morning
                                    </SelectItem>
                                    <SelectItem value='Afternoon'>
                                      Afternoon
                                    </SelectItem>
                                    <SelectItem value='Evening'>
                                      Evening
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='exercise_location'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Exercise Location *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select exercise location' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='Home'>Home</SelectItem>
                                    <SelectItem value='Gym'>Gym</SelectItem>
                                    <SelectItem value='Outdoor'>
                                      Outdoor
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='daily_step_count_avg'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Daily Step Count (Optional)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type='number'
                                    placeholder='e.g., 8000'
                                    value={field.value ?? ''}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='job_type'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Type *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select job type' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem
                                      value='Desk job'
                                      title='Office work, computer work, administrative roles'
                                    >
                                      Desk Job
                                    </SelectItem>
                                    <SelectItem
                                      value='Active job'
                                      title='Teaching, nursing, retail, walking/moving throughout the day'
                                    >
                                      Active Job
                                    </SelectItem>
                                    <SelectItem
                                      value='Standing job'
                                      title='Cashier, security guard, factory work, standing most of the day'
                                    >
                                      Standing Job
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='equipment'>
                  <AccordionTrigger className='text-lg font-semibold text-green-800'>
                    <div className='flex items-center gap-2'>
                      <Dumbbell className='w-5 h-5' />
                      Equipment & Space
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className='pt-6 space-y-4'>
                        <FormField
                          control={form.control}
                          name='available_equipment'
                          render={() => (
                            <FormItem>
                              <FormLabel>Available Equipment</FormLabel>
                              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                                {equipmentOptions.map((equipment) => (
                                  <FormField
                                    key={equipment}
                                    control={form.control}
                                    name='available_equipment'
                                    render={({ field }) => (
                                      <FormItem
                                        key={equipment}
                                        className='flex flex-row items-start space-x-3 space-y-0'
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              equipment
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...(field.value || []),
                                                    equipment,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) =>
                                                        value !== equipment
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className='text-sm font-normal'>
                                          {equipment}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {selectedEquipment.includes('Other') && (
                          <FormField
                            control={form.control}
                            name='available_equipment_other'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Other Available Equipment</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Please specify your other available equipment...'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name='machines_access'
                            render={({ field }) => (
                              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                  <FormLabel>
                                    I have access to gym machines
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='space_availability'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Space Availability *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select space type' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='Small room'>
                                      Small Room
                                    </SelectItem>
                                    <SelectItem value='Open area'>
                                      Open Area
                                    </SelectItem>
                                    <SelectItem value='Gym space'>
                                      Gym Space
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='preferences'>
                  <AccordionTrigger className='text-lg font-semibold text-green-800'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='w-5 h-5' />
                      Preferences & Tracking
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className='pt-6 space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name='preferred_difficulty_level'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Preferred Difficulty Level *
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select difficulty level' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='Low'>Low</SelectItem>
                                    <SelectItem value='Medium'>
                                      Medium
                                    </SelectItem>
                                    <SelectItem value='High'>High</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='sleep_quality'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sleep Quality *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select sleep quality' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='Poor'>Poor</SelectItem>
                                    <SelectItem value='Average'>
                                      Average
                                    </SelectItem>
                                    <SelectItem value='Good'>Good</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className='space-y-3'>
                          <FormField
                            control={form.control}
                            name='want_to_track_progress'
                            render={({ field }) => (
                              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                  <FormLabel>
                                    I want to track my progress
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='weekly_checkins_enabled'
                            render={({ field }) => (
                              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                  <FormLabel>Enable weekly check-ins</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='accountability_support'
                            render={({ field }) => (
                              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                  <FormLabel>
                                    I want accountability support and reminders
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className='flex flex-col lg:grid lg:grid-cols-2 gap-2.5'>
                <Button
                  size='lg'
                  variant='outline'
                  type='button'
                  onClick={() => savePreferences(form.getValues())}
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner /> : <Save />}
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </Button>

                <Button
                  type='submit'
                  disabled={isGenerating}
                  size='lg'
                  className='px-8'
                >
                  {isGenerating ? <Spinner /> : <Wand2 />}
                  {isGenerating
                    ? 'Generating Your Plan...'
                    : 'Generate AI Exercise Plan'}
                </Button>

                {generatedPlan && (
                  <Button
                    type='button'
                    onClick={() => {
                      setGeneratedPlan(null);
                      localStorage.removeItem('generatedExercisePlan');
                      alert('Exercise plan cleared successfully!');
                    }}
                    variant='destructive'
                  >
                    <Trash2 />
                    Clear Plan
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <GeneratedPlanSection
            generatedPlan={generatedPlan}
            expandedDays={expandedDays}
            onClick={toggleDayExpansion}
          />
        </CardContent>
      </Card>
    </div>
  );
}
