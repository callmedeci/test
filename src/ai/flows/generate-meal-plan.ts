'use server';

import { ai } from '@/ai/genkit';
import {
  GeneratePersonalizedMealPlanInputSchema,
  GeneratePersonalizedMealPlanOutputSchema,
  AIDailyPlanOutputSchema,
  type GeneratePersonalizedMealPlanOutput,
  type AIGeneratedMeal,
  type GeneratePersonalizedMealPlanInput,
  DayPlan,
  IngredientSchema,
} from '@/lib/schemas';
import { daysOfWeek } from '@/lib/constants';
import { z } from 'zod';
import { getAIApiErrorMessage } from '@/lib/utils';

export type { GeneratePersonalizedMealPlanOutput };

export async function generatePersonalizedMealPlan(
  input: GeneratePersonalizedMealPlanInput
): Promise<GeneratePersonalizedMealPlanOutput> {
  return generatePersonalizedMealPlanFlow(input);
}

const DailyPromptInputSchema = z.object({
  day_of_week: z.string(),
  meal_targets: z.array(
    z.object({
      name: z.string(),
      custom_name: z.string().optional().nullable(),
      ingredients: z.array(IngredientSchema).optional().nullable(),
      total_calories: z.number().optional().nullable(),
      total_protein: z.number().optional().nullable(),
      total_carbs: z.number().optional().nullable(),
      total_fat: z.number().optional().nullable(),
    })
  ),
  age: z.number().optional(),
  biological_sex: z.string().optional(),
  height_cm: z.number().optional(),
  current_weight_kg: z.number().optional(),
  physical_activity_level: z.string().optional(),
  primary_diet_goal: z.string().optional(),
  preferred_diet: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  dispreferred_ingredients: z.array(z.string()).optional(),
  preferred_ingredients: z.array(z.string()).optional(),
  preferred_cuisines: z.array(z.string()).optional(),
  dispreferred_cuisines: z.array(z.string()).optional(),
  medical_conditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  equipment_access: z.array(z.string()).optional(),
});

type DailyPromptInput = z.infer<typeof DailyPromptInputSchema>;

const dailyPrompt = ai.definePrompt({
  name: 'generateDailyMealPlanPrompt',
  input: { schema: DailyPromptInputSchema },
  output: { schema: AIDailyPlanOutputSchema },
  prompt: `You are an expert nutritionist and personal chef for "NutriPlan," a platform for personalized meal planning. Your task is to generate a complete, edible, and optimized daily meal plan for {{dayOfWeek}}, consisting of six meals (Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner, Evening Snack) that strictly align with the provided macronutrient targets, user profile, and dietary preferences. Each meal must be contextually appropriate (e.g., light snacks, substantial meals for breakfast/lunch/dinner) and tailored to the user’s goals, lifestyle, and restrictions.

**User Profile**:
{{#if age}}- Age: {{age}}{{/if}}
{{#if biological_sex}}- Biological Sex: {{biological_sex}}{{/if}}
{{#if height_cm}}- Height: {{height_cm}} cm{{/if}}
{{#if current_weight_kg}}- Current Weight: {{current_weight_kg}} kg{{/if}}
{{#if physical_activity_level}}- Activity Level: {{physical_activity_level}}{{/if}}
{{#if primary_diet_goal}}- Primary Diet Goal: {{primary_diet_goal}}{{/if}}
{{#if preferred_diet}}- Dietary Preference: {{preferred_diet}}{{/if}}
{{#if allergies.length}}- Allergies to Avoid: {{#each allergies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if dispreferred_ingredients.length}}- Disliked Ingredients: {{#each dispreferred_ingredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if preferred_ingredients.length}}- Favorite Ingredients: {{#each preferred_ingredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if preferred_cuisines.length}}- Favorite Cuisines: {{#each preferred_cuisines}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if dispreferred_cuisines.length}}- Cuisines to Avoid: {{#each dispreferred_cuisines}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if medical_conditions.length}}- Medical Conditions: {{#each medical_conditions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if medications.length}}- Medications: {{#each medications}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if equipment_access.length}}- Equipment Access: {{#each equipment_access}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

**Chain-of-Thought Reasoning (Mandatory)**:
Follow these steps to ensure accurate, relevant, and practical meal plans:
1. **Analyze User Profile**: Evaluate age, biological sex, activity level, diet goal, and medical conditions to tailor the meal plan to the user’s nutritional needs (e.g., higher protein for muscle gain, low-carb for diabetes).
2. **Assess Meal Context**: Ensure each meal is appropriate for its type:
   - Breakfast: Substantial, energizing meals (e.g., oatmeal, smoothies).
   - Morning/Afternoon/Evening Snack: Light, quick options (e.g., fruit, nuts).
   - Lunch/Dinner: Hearty, balanced meals (e.g., salads, protein-based dishes).
3. **Match Macronutrient Targets**: For each meal in {{meal_targets}}, ensure total calories, protein, carbs, and fat are within a 5% tolerance of the provided targets ({{total_calories}} kcal, {{total_protein}}g protein, {{total_carbs}}g carbs, {{total_fat}}g fat). Use precise nutritional data (e.g., USDA database).
4. **Respect Constraints**: Strictly avoid ingredients that conflict with allergies, medical conditions, or dispreferred ingredients/cuisines. Prioritize preferred ingredients and cuisines.
5. **Ensure Practicality**: Suggest meals that are feasible with the user’s equipment access (e.g., basic kitchen tools). Avoid overly complex recipes unless specified.
6. **Validate Outputs**: Double-check that the sum of calories, protein, carbs, and fat for each meal’s ingredients matches the targets within 5%. Adjust ingredients if necessary.
7. **Handle Edge Cases**: If meal targets are missing or unachievable (e.g., due to strict restrictions), generate a balanced meal based on the user’s profile and typical macro ratios for the meal type (e.g., 20-30% of daily calories for breakfast).

**Meal Targets for {{dayOfWeek}}**:
{{#each meal_targets}}
- **Meal: {{name}}**
  {{#if total_calories}}- TARGET Calories: {{total_calories}} kcal{{/if}}
  {{#if total_protein}}- TARGET Protein: {{total_protein}}g{{/if}}
  {{#if total_carbs}}- TARGET Carbohydrates: {{total_carbs}}g{{/if}}
  {{#if total_fat}}- TARGET Fat: {{total_fat}}g{{/if}}
{{/each}}

**Example Daily Meal Plan (Reference Only)**:
{
  "meals": [
    {
      "meal_title": "Greek Yogurt Smoothie",
      "ingredients": [
        {
          "name": "Greek Yogurt (Non-Fat)",
          "calories": 90,
          "protein": 15,
          "carbs": 5,
          "fat": 0
        },
        {
          "name": "Mixed Berries",
          "calories": 50,
          "protein": 1,
          "carbs": 12,
          "fat": 0.5
        },
        {
          "name": "Almond Milk",
          "calories": 30,
          "protein": 1,
          "carbs": 0,
          "fat": 2.5
        }
      ]
    },
    {
      "meal_title": "Apple Slices with Almond Butter",
      "ingredients": [
        {
          "name": "Apple",
          "calories": 95,
          "protein": 0.5,
          "carbs": 25,
          "fat": 0.3
        },
        {
          "name": "Almond Butter",
          "calories": 100,
          "protein": 3.5,
          "carbs": 3,
          "fat": 9
        }
      ]
    }
    // ... (similar entries for Lunch, Afternoon Snack, Dinner, Evening Snack)
  ]
}

**Critical Output Instructions**:
- Respond with ONLY a valid JSON object matching the provided schema: { meals: Array<{ meal_title: string; ingredients: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number; }> }> }.
- Generate exactly six meal objects in the "meals" array, corresponding to Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner, and Evening Snack, in that order.
- Each meal MUST have:
  - A "meal_title": A short, appetizing name (e.g., "Sunrise Scramble", "Zesty Salmon Salad").
  - A non-empty "ingredients" array with 2–5 ingredients, each with precise "name", "calories", "protein", "carbs", and "fat" values (numbers, not strings).
- Sum the macros for each meal’s ingredients and ensure they are within 5% of the provided targets. If targets are missing, use profile data to estimate reasonable macros (e.g., 20-30% of daily calories for breakfast).
- Strictly respect allergies, medical conditions, and dispreferred ingredients/cuisines. Prioritize preferred ingredients/cuisines.
- If no suitable meal can be generated for a target, include a meal with a note in the title (e.g., "No Suitable Breakfast") and an empty ingredients array.
- Do NOT include text, notes, greetings, or markdown outside the JSON object.
- Double-check all calculations before finalizing the output.

Respond ONLY with the pure JSON object matching the schema.
`,
});

// Genkit Flow (Unchanged)
const generatePersonalizedMealPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedMealPlanFlow',
    inputSchema: GeneratePersonalizedMealPlanInputSchema,
    outputSchema: GeneratePersonalizedMealPlanOutputSchema,
  },
  async (
    input: GeneratePersonalizedMealPlanInput
  ): Promise<GeneratePersonalizedMealPlanOutput> => {
    const processedWeeklyPlan: DayPlan[] = [];
    const weeklySummary = {
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
    };

    for (const dayOfWeek of daysOfWeek) {
      const mealTargets = input.meal_data.days
        .filter((day) => day.day_of_week === dayOfWeek)
        .at(0)?.meals;

      try {
        // Construct the simpler input for the daily prompt
        const dailyPromptInput: DailyPromptInput = {
          day_of_week: dayOfWeek,
          meal_targets: mealTargets!,
          age: input.age,
          biological_sex: input.biological_sex,
          height_cm: input.height_cm,
          current_weight_kg: input.current_weight_kg,
          physical_activity_level: input.physical_activity_level,
          primary_diet_goal: input.primary_diet_goal,
          preferred_diet: input.preferred_diet,
          allergies: input.allergies,
          dispreferred_ingredients: input.dispreferrred_ingredients,
          preferred_ingredients: input.preferred_ingredients,
          preferred_cuisines: input.preferred_cuisines,
          dispreferred_cuisines: input.dispreferrred_cuisines,
          medical_conditions: input.medical_conditions,
          medications: input.medications,
          equipment_access: input.equipment_access,
        };

        const { output: dailyOutput } = await dailyPrompt(dailyPromptInput);

        if (
          !dailyOutput ||
          !dailyOutput.meals ||
          dailyOutput.meals.length === 0
        ) {
          console.warn(`AI returned no meals for ${dayOfWeek}. Skipping.`);
          continue;
        }

        const processedMeals: AIGeneratedMeal[] = dailyOutput.meals
          .map((meal, index) => {
            if (
              meal === null ||
              !meal.ingredients ||
              meal.ingredients.length === 0
            ) {
              return null;
            }

            const sanitizedIngredients = meal.ingredients.map((ing) => ({
              name: ing.name ?? 'Unknown Ingredient',
              calories: Number(ing.calories) || 0,
              protein: Number(ing.protein) || 0,
              carbs: Number(ing.carbs) || 0,
              fat: Number(ing.fat) || 0,
            }));

            const mealTotals = sanitizedIngredients.reduce(
              (totals, ing) => {
                totals.calories += ing.calories;
                totals.protein += ing.protein;
                totals.carbs += ing.carbs;
                totals.fat += ing.fat;
                return totals;
              },
              { calories: 0, protein: 0, carbs: 0, fat: 0 }
            );

            weeklySummary.total_calories += mealTotals.calories;
            weeklySummary.total_protein += mealTotals.protein;
            weeklySummary.total_carbs += mealTotals.carbs;
            weeklySummary.total_fat += mealTotals.fat;

            return {
              meal_name: mealTargets?.[index]?.name || `Meal ${index + 1}`,
              meal_title:
                meal.meal_title ||
                `AI Generated ${mealTargets?.[index]?.name || 'Meal'}`,
              ingredients: sanitizedIngredients,
              total_calories: mealTotals.calories || undefined,
              total_protein_g: mealTotals.protein || undefined,
              total_carbs_g: mealTotals.carbs || undefined,
              total_fat_g: mealTotals.fat || undefined,
            } as AIGeneratedMeal;
          })
          .filter((meal): meal is AIGeneratedMeal => meal !== null);

        if (processedMeals.length > 0)
          processedWeeklyPlan.push({
            day_of_week: dayOfWeek,
            meals: processedMeals,
          });
      } catch (error: any) {
        console.error(error);
      }
    }

    if (processedWeeklyPlan.length === 0) {
      throw new Error(
        getAIApiErrorMessage({
          message:
            'The AI failed to generate a valid meal plan for any day of the week. Please try again.',
        })
      );
    }

    const finalOutput: GeneratePersonalizedMealPlanOutput = {
      days: processedWeeklyPlan,
      weekly_summary: weeklySummary,
    };

    return finalOutput;
  }
);
