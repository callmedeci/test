'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import SubmitButton from '@/components/ui/SubmitButton';
import { toast } from '@/hooks/use-toast';
import { ExercisePlannerFormData, exercisePlannerSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  equipmentOptions,
  exerciseExperiences,
  medicalConditions,
  commonMedications,
  muscleGroups,
} from '../../lib/config';
import { savePreferences } from '../../actions/apiExercise';

interface ExercisePlannerFormProps {
  initialData?: Partial<ExercisePlannerFormData>;
  onSave?: (data: ExercisePlannerFormData) => void;
}

export default function ExercisePlannerForm({
  initialData,
  onSave,
}: ExercisePlannerFormProps) {
  const form = useForm<ExercisePlannerFormData>({
    resolver: zodResolver(exercisePlannerSchema),
    defaultValues: {
      fitness_level: '',
      exercise_experience: [],
      exercise_experience_other: '',
      existing_medical_conditions: [],
      existing_medical_conditions_other: '',
      injuries_or_limitations: '',
      current_medications: [],
      current_medications_other: '',
      doctor_clearance: false,
      primary_goal: '',
      secondary_goal: '',
      goal_timeline_weeks: 12,
      target_weight_kg: 0,
      muscle_groups_focus: [],
      exercise_days_per_week: 3,
      available_time_per_session: 45,
      preferred_time_of_day: '',
      exercise_location: '',
      daily_step_count_avg: 0,
      job_type: '',
      available_equipment: [],
      available_equipment_other: '',
      machines_access: false,
      space_availability: '',
      want_to_track_progress: true,
      weekly_checkins_enabled: false,
      accountability_support: false,
      preferred_difficulty_level: '',
      sleep_quality: '',
      ...initialData,
    },
  });

  const handleSubmit = async (data: ExercisePlannerFormData) => {
    try {
      const result = await savePreferences(data);
      
      if (result.isSuccess) {
        toast({
          title: 'Preferences Saved',
          description: 'Your exercise preferences have been saved successfully.',
        });
        onSave?.(data);
      } else {
        throw new Error(result.error?.toString() || 'Failed to save preferences');
      }
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.message || 'Failed to save preferences. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fitness_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Fitness Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your fitness level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primary_goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Goal</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Lose fat">Lose Fat</SelectItem>
                      <SelectItem value="Build muscle">Build Muscle</SelectItem>
                      <SelectItem value="Increase endurance">Increase Endurance</SelectItem>
                      <SelectItem value="Flexibility">Improve Flexibility</SelectItem>
                      <SelectItem value="General fitness">General Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exercise_days_per_week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Days Per Week</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="7"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="available_time_per_session"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Time Per Session (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="15"
                      max="180"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Exercise Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Exercise Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="exercise_experience"
              render={() => (
                <FormItem>
                  <FormLabel>Types of Exercise You've Done</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {exerciseExperiences.map((experience) => (
                      <FormField
                        key={experience}
                        control={form.control}
                        name="exercise_experience"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(experience)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), experience]
                                    : field.value?.filter((value) => value !== experience) || [];
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
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

            <FormField
              control={form.control}
              name="exercise_experience_other"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Exercise Experience</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe any other exercise experience..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Health & Medical */}
        <Card>
          <CardHeader>
            <CardTitle>Health & Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="existing_medical_conditions"
              render={() => (
                <FormItem>
                  <FormLabel>Existing Medical Conditions</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {medicalConditions.map((condition) => (
                      <FormField
                        key={condition}
                        control={form.control}
                        name="existing_medical_conditions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(condition)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), condition]
                                    : field.value?.filter((value) => value !== condition) || [];
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
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

            <FormField
              control={form.control}
              name="injuries_or_limitations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Injuries or Physical Limitations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe any injuries or physical limitations..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doctor_clearance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I have doctor's clearance to exercise
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Equipment & Environment */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment & Environment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="exercise_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Exercise Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Gym">Gym</SelectItem>
                      <SelectItem value="Outdoor">Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="available_equipment"
              render={() => (
                <FormItem>
                  <FormLabel>Available Equipment</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {equipmentOptions.map((equipment) => (
                      <FormField
                        key={equipment}
                        control={form.control}
                        name="available_equipment"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(equipment)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), equipment]
                                    : field.value?.filter((value) => value !== equipment) || [];
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
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

            <FormField
              control={form.control}
              name="space_availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Space</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select available space" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Small room">Small Room</SelectItem>
                      <SelectItem value="Open area">Open Area</SelectItem>
                      <SelectItem value="Gym space">Gym Space</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Exercise Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="preferred_time_of_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time of Day</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Afternoon">Afternoon</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_difficulty_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="muscle_groups_focus"
              render={() => (
                <FormItem>
                  <FormLabel>Muscle Groups to Focus On</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {muscleGroups.map((group) => (
                      <FormField
                        key={group}
                        control={form.control}
                        name="muscle_groups_focus"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(group)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), group]
                                    : field.value?.filter((value) => value !== group) || [];
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
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

        <div className="flex justify-end">
          <SubmitButton
            isLoading={form.formState.isSubmitting}
            loadingLabel="Saving..."
            label="Save Preferences"
            icon={<Save className="h-4 w-4" />}
          />
        </div>
      </form>
    </Form>
  );
}