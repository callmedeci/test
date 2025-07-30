import { z } from 'zod';

// Exercise Planner Form Schema
export const ExercisePlannerFormSchema = z.object({
  fitness_level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    required_error: 'Please select a fitness level',
  }),
  exercise_experience: z.array(z.string()).default([]),
  exercise_experience_other: z.string().optional(),
  existing_medical_conditions: z.array(z.string()).default([]),
  existing_medical_conditions_other: z.string().optional(),
  injuries_or_limitations: z.string().optional(),
  current_medications: z.array(z.string()).default([]),
  current_medications_other: z.string().optional(),
  doctor_clearance: z.boolean().default(false),
  primary_goal: z.enum([
    'Lose fat',
    'Build muscle',
    'Increase endurance',
    'Improve flexibility',
    'General fitness',
  ], {
    required_error: 'Please select a primary goal',
  }),
  secondary_goal: z.enum([
    'Lose fat',
    'Build muscle',
    'Increase endurance',
    'Improve flexibility',
    'General fitness',
  ]).optional(),
  goal_timeline_weeks: z.coerce
    .number()
    .int()
    .min(1, 'Timeline must be at least 1 week')
    .max(52, 'Timeline cannot exceed 52 weeks'),
  target_weight_kg: z.coerce
    .number()
    .min(30, 'Weight must be at least 30kg')
    .max(300, 'Weight cannot exceed 300kg')
    .optional(),
  muscle_groups_focus: z.array(z.string()).default([]),
  exercise_days_per_week: z.coerce
    .number()
    .int()
    .min(1, 'Must exercise at least 1 day per week')
    .max(7, 'Cannot exceed 7 days per week'),
  available_time_per_session: z.coerce
    .number()
    .int()
    .min(15, 'Session must be at least 15 minutes')
    .max(180, 'Session cannot exceed 180 minutes'),
  preferred_time_of_day: z.enum(['Morning', 'Afternoon', 'Evening'], {
    required_error: 'Please select preferred time',
  }),
  exercise_location: z.enum(['Home', 'Gym', 'Outdoor'], {
    required_error: 'Please select exercise location',
  }),
  daily_step_count_avg: z.coerce
    .number()
    .int()
    .min(0)
    .max(30000)
    .optional(),
  job_type: z.enum(['Desk job', 'Active job', 'Standing job'], {
    required_error: 'Please select job type',
  }),
  available_equipment: z.array(z.string()).default([]),
  available_equipment_other: z.string().optional(),
  machines_access: z.boolean().default(false),
  space_availability: z.enum(['Small room', 'Open area', 'Gym space'], {
    required_error: 'Please select space availability',
  }),
  want_to_track_progress: z.boolean().default(false),
  weekly_checkins_enabled: z.boolean().default(false),
  accountability_support: z.boolean().default(false),
  preferred_difficulty_level: z.enum(['Low', 'Medium', 'High'], {
    required_error: 'Please select difficulty level',
  }),
  sleep_quality: z.enum(['Poor', 'Average', 'Good'], {
    required_error: 'Please select sleep quality',
  }),
});

export type ExercisePlannerFormValues = z.infer<typeof ExercisePlannerFormSchema>;

// Exercise Alternative
export interface ExerciseAlternative {
  name: string;
  instructions: string;
  youtubeSearchTerm: string;
}

// Main Exercise
export interface Exercise {
  exerciseName: string;
  targetMuscles: string[];
  sets: number;
  reps: string;
  restSeconds: number;
  instructions: string;
  youtubeSearchTerm: string;
  alternatives: ExerciseAlternative[];
}

// Warmup/Cooldown Exercise
export interface WarmupCooldownExercise {
  name: string;
  duration: number;
  instructions: string;
}

// Workout Day
export interface WorkoutDay {
  dayName: string;
  focus: string;
  duration: number;
  warmup: {
    exercises: WarmupCooldownExercise[];
  };
  mainWorkout: Exercise[];
  cooldown: {
    exercises: WarmupCooldownExercise[];
  };
}

// Complete Exercise Plan
export interface ExercisePlan {
  weeklyPlan: Record<string, WorkoutDay>;
  progressionTips?: string[];
  safetyNotes?: string[];
  nutritionTips?: string[];
}

// API Response Types
export interface GeneratedPlanResponse {
  success: boolean;
  plan?: {
    weekly_plan: {
      parsed_plan: ExercisePlan;
    };
  };
  error?: string;
}

// Plan Statistics
export interface PlanStats {
  totalWorkouts: number;
  totalDuration: number;
  avgDuration: number;
}