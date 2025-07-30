import { ExercisePlannerFormData } from '@/lib/schemas';

export async function savePreferences(data: ExercisePlannerFormData) {
  try {
    const cleanedData = {
      ...data,
      target_weight_kg: data.target_weight_kg || null,
      daily_step_count_avg: data.daily_step_count_avg || null,
      secondary_goal: data.secondary_goal || null,
      exercise_experience_other: data.exercise_experience_other || null,
      existing_medical_conditions_other:
        data.existing_medical_conditions_other || null,
      injuries_or_limitations: data.injuries_or_limitations || null,
      current_medications_other: data.current_medications_other || null,
      available_equipment_other: data.available_equipment_other || null,
    };

    console.log('Saving preferences:', cleanedData);

    const response = await fetch('/api/exercise-planner/save-preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanedData),
    });

    const result = await response.json();
    console.log('Response status:', response.status, 'Response data:', result);

    if (!response.ok) {
      console.error('Server error response:', result);
      const errorMessage =
        result.details || result.error || 'Failed to save preferences';
      throw new Error(errorMessage);
    }

    console.log('Preferences saved successfully:', result);
    return { isSuccess: true, error: null };
  } catch (error) {
    console.error('Error saving preferences:', error);
    return { isSuccess: false, error };
  }
}

export async function loadSavedPreferences() {
  try {
    const response = await fetch('/api/exercise-planner/get-preferences', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        const savedData = result.data;

        console.log('Loaded saved preferences:', savedData);
        return { isSuccess: true, error: null, data: savedData };
      }
    }

    return { isSuccess: false, data: null, error: 'Failed to fetch your data' };
  } catch (error) {
    console.error('Error loading saved preferences:', error);
    return { isSuccess: false, data: null, error };
  }
}
