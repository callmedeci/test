'use server';

import { ai } from '@/ai/genkit';
import {
  GeneratePersonalizedMealPlanInputSchema,
  GeneratePersonalizedMealPlanOutputSchema,
  type GeneratePersonalizedMealPlanOutput,
  type AIGeneratedMeal,
  type GeneratePersonalizedMealPlanInput,
  type DayPlan,
} from '@/lib/schemas';
import { daysOfWeek } from '@/lib/constants';
import { z } from 'zod';

export type { GeneratePersonalizedMealPlanOutput };

export async function generatePersonalizedMealPlan(
  input: GeneratePersonalizedMealPlanInput
): Promise<GeneratePersonalizedMealPlanOutput> {
  return generatePersonalizedMealPlanFlow(input);
}

// This schema is for the internal daily prompt, containing only necessary info.
// REMOVED general profile data to force focus on targets and preferences.
const DailyPromptInputSchema = z.object({
  dayOfWeek: z.string(),
  mealTargets: z.array(
    z.object({
      meal_name: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    })
  ),
  preferred_diet: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  dispreferrred_ingredients: z.array(z.string()).optional(),
  preferred_ingredients: z.array(z.string()).optional(),
  preferred_cuisines: z.array(z.string()).optional(),
  dispreferrred_cuisines: z.array(z.string()).optional(),
  medical_conditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
});
type DailyPromptInput = z.infer<typeof DailyPromptInputSchema>;

// Updated schema for AI daily output to match the expected structure
const AIDailyPlanOutputSchema = z.object({
  meals: z.array(
    z.object({
      name: z.string(),
      custom_name: z.string().optional(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          quantity: z.number().optional(),
          unit: z.string().optional(),
          calories: z.number(),
          protein: z.number(),
          carbs: z.number(),
          fat: z.number(),
        })
      ),
      total_calories: z.number().optional(),
      total_protein: z.number().optional(),
      total_carbs: z.number().optional(),
      total_fat: z.number().optional(),
    })
  ),
});

// A prompt specifically for generating a SINGLE DAY's meal plan.
// REMOVED the user profile section to make the prompt more focused.
const dailyPrompt = ai.definePrompt({
  name: 'generateDailyMealPlanPrompt',
  input: { schema: DailyPromptInputSchema },
  output: { schema: AIDailyPlanOutputSchema },
  prompt: `You are a highly precise nutritional data generation service. Your ONLY task is to create a list of meals for a single day, {{dayOfWeek}}, that strictly matches the provided macronutrient targets for each meal, while adhering to the user's dietary preferences.

**USER DIETARY PREFERENCES & RESTRICTIONS (FOR CONTEXT ONLY):**
{{#if preferred_diet}}- Dietary Preference: {{preferred_diet}}{{/if}}
{{#if allergies.length}}- Allergies to Avoid: {{#each allergies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if dispreferrred_ingredients.length}}- Disliked Ingredients: {{#each dispreferrred_ingredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if preferred_ingredients.length}}- Favorite Ingredients: {{#each preferred_ingredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if preferred_cuisines.length}}- Favorite Cuisines: {{#each preferred_cuisines}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if dispreferrred_cuisines.length}}- Cuisines to Avoid: {{#each dispreferrred_cuisines}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if medical_conditions.length}}- Medical Conditions: {{#each medical_conditions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if medications.length}}- Medications: {{#each medications}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}


**ABSOLUTE REQUIREMENTS FOR MEAL GENERATION:**

For each meal listed below, you MUST generate a corresponding meal object. The total macros for the ingredients you list for each meal MUST fall within a 5% tolerance of the targets.

**EXAMPLE CALCULATION:**
- If Target Calories = 500, a 5% tolerance means the sum of your ingredient calories must be between 475 and 525.
- If Target Protein = 30g, a 5% tolerance means the sum of your ingredient protein must be between 28.5g and 31.5g.
- **YOU MUST PERFORM THIS CHECK FOR EVERY MEAL AND EVERY MACRONUTRIENT (CALORIES, PROTEIN, CARBS, FAT).**

**MEAL TARGETS FOR {{dayOfWeek}} (FROM USER'S MACRO SPLITTER):**
You are being provided with specific macronutrient targets for each meal. These targets were set by the user in the "Macro Splitter" tool. It is absolutely critical that you respect these targets.

{{#each mealTargets}}
- **Meal: {{this.meal_name}}**
  - **TARGET Calories:** {{this.calories}} kcal
  - **TARGET Protein:** {{this.protein}}g
  - **TARGET Carbohydrates:** {{this.carbs}}g
  - **TARGET Fat:** {{this.fat}}g
{{/each}}

**CRITICAL OUTPUT INSTRUCTIONS:**
1.  Respond with ONLY a valid JSON object matching the provided schema. Do NOT include any text, notes, greetings, or markdown like \`\`\`json outside the JSON object.
2.  For each meal in the targets, create a corresponding meal object in the "meals" array.
3.  Each meal object MUST have a "name" (a short, appetizing name) and a non-empty "ingredients" array.
4.  For each ingredient object MUST have a "name", and the precise "calories", "protein", "carbs", and "fat" values for the portion used in the meal. All values must be numbers.
5.  **Before finalizing your output, you MUST double-check your math.** Sum the macros for each ingredient list to ensure the totals for each meal are within the 5% tolerance of the targets provided above. If they are not, you must adjust the ingredients and recalculate until they are. ONLY output the final, correct version.
`,
});

// The flow takes the pre-calculated targets and user context and iterates to generate a plan.
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
      try {
        // Construct the simpler input for the daily prompt
        const dailyPromptInput: DailyPromptInput = {
          dayOfWeek,
          mealTargets: input.meal_targets,
          preferred_diet: input.preferred_diet,
          allergies: input.allergies,
          dispreferrred_ingredients: input.dispreferrred_ingredients,
          preferred_ingredients: input.preferred_ingredients,
          preferred_cuisines: input.preferred_cuisines,
          dispreferrred_cuisines: input.dispreferrred_cuisines,
          medical_conditions: input.medical_conditions,
          medications: input.medications,
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
            // Return null for invalid meals to filter out later
            if (
              meal === null ||
              !meal.ingredients ||
              meal.ingredients.length === 0
            ) {
              return null;
            }

            const sanitizedIngredients = meal.ingredients.map((ing) => ({
              name: ing.name ?? 'Unknown Ingredient',
              quantity: ing.quantity,
              unit: ing.unit,
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
              name: meal.name || `Meal ${index + 1}`,
              custom_name: meal.custom_name,
              ingredients: sanitizedIngredients,
              total_calories: mealTotals.calories,
              total_protein: mealTotals.protein,
              total_carbs: mealTotals.carbs,
              total_fat: mealTotals.fat,
            } as AIGeneratedMeal;
          })
          .filter((meal): meal is AIGeneratedMeal => meal !== null);

        if (processedMeals.length > 0) {
          processedWeeklyPlan.push({
            day_of_week: dayOfWeek,
            meals: processedMeals,
          });
        }
      } catch (e) {
        console.error(`Failed to generate meal plan for ${dayOfWeek}:`, e);
      }
    }

    if (processedWeeklyPlan.length === 0)
      throw new Error(
        'The AI failed to generate a valid meal plan for any day of the week. Please try again.'
      );

    const finalOutput: GeneratePersonalizedMealPlanOutput = {
      days: processedWeeklyPlan,
      weekly_summary: weeklySummary,
    };

    return finalOutput;
  }
);
