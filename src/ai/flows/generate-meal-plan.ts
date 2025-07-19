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
      meal_name: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    })
  ),
  preferred_diet: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  dispreferred_ingredients: z.array(z.string()).optional(),
  preferred_ingredients: z.array(z.string()).optional(),
  preferred_cuisines: z.array(z.string()).optional(),
  dispreferred_cuisines: z.array(z.string()).optional(),
  medical_conditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
});

type DailyPromptInput = z.infer<typeof DailyPromptInputSchema>;

const dailyPrompt = ai.definePrompt({
  name: 'generateDailyMealPlanPrompt',
  input: { schema: DailyPromptInputSchema },
  output: { schema: AIDailyPlanOutputSchema },
  prompt: `You are a highly precise nutritional data generation service. Your ONLY task is to create a list of meals for a single day, {{dayOfWeek}}, that strictly matches the provided macronutrient targets for each meal, while adhering to the user's dietary preferences.

**USER DIETARY PREFERENCES & RESTRICTIONS (FOR CONTEXT ONLY):**
{{#if preferredDiet}}- Dietary Preference: {{preferredDiet}}{{/if}}
{{#if allergies.length}}- Allergies to Avoid: {{#each allergies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if dispreferredIngredients.length}}- Disliked Ingredients: {{#each dispreferredIngredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if preferredIngredients.length}}- Favorite Ingredients: {{#each preferredIngredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if preferredCuisines.length}}- Favorite Cuisines: {{#each preferredCuisines}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if dispreferredCuisines.length}}- Cuisines to Avoid: {{#each dispreferredCuisines}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if medicalConditions.length}}- Medical Conditions: {{#each medicalConditions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
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
- **Meal: {{this.mealName}}**
  - **TARGET Calories:** {{this.calories}} kcal
  - **TARGET Protein:** {{this.protein}}g
  - **TARGET Carbohydrates:** {{this.carbs}}g
  - **TARGET Fat:** {{this.fat}}g
{{/each}}

**CRITICAL OUTPUT INSTRUCTIONS:**
1.  Respond with ONLY a valid JSON object matching the provided schema. Do NOT include any text, notes, greetings, or markdown like \`\`\`json outside the JSON object.
2.  For each meal in the targets, create a corresponding meal object in the "meals" array.
3.  Each meal object MUST have a "meal_title" (a short, appetizing name) and a non-empty "ingredients" array.
4.  For each ingredient object MUST have a "name", and the precise "calories", "protein", "carbs", and "fat" values for the portion used in the meal. All values must be numbers.
5.  **Before finalizing your output, you MUST double-check your math.** Sum the macros for each ingredient list to ensure the totals for each meal are within the 5% tolerance of the targets provided above. If they are not, you must adjust the ingredients and recalculate until they are. ONLY output the final, correct version.
`,
});

const generatePersonalizedMealPlanFlow = ai.defineFlow(
  {
    name: 'generate_personalized_meal_plan_flow',
    inputSchema: GeneratePersonalizedMealPlanInputSchema,
    outputSchema: GeneratePersonalizedMealPlanOutputSchema,
  },
  async (
    input: GeneratePersonalizedMealPlanInput
  ): Promise<GeneratePersonalizedMealPlanOutput> => {
    const processedWeeklyPlan: DayPlan[] = [];
    const weekly_summary = {
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
    };

    for (const day_of_week of daysOfWeek) {
      try {
        const daily_prompt_input: DailyPromptInput = {
          day_of_week,
          meal_targets: input.meal_targets!,
          preferred_diet: input.preferred_diet,
          allergies: input.allergies,
          dispreferred_ingredients: input.dispreferrred_ingredients,
          preferred_ingredients: input.preferred_ingredients,
          preferred_cuisines: input.preferred_cuisines,
          dispreferred_cuisines: input.dispreferrred_cuisines,
          medical_conditions: input.medical_conditions,
          medications: input.medications,
        };

        const { output: daily_output } = await dailyPrompt(daily_prompt_input);

        if (
          !daily_output ||
          !daily_output.meals ||
          daily_output.meals.length === 0
        ) {
          console.warn(`AI returned no meals for ${day_of_week}. Skipping.`);
          continue;
        }

        const processedMeals: AIGeneratedMeal[] = daily_output.meals
          .map((meal, index) => {
            if (
              meal === null ||
              !meal.ingredients ||
              meal.ingredients.length === 0
            ) {
              return null;
            }

            const sanitized_ingredients = meal.ingredients.map((ing) => ({
              name: ing.name ?? 'Unknown Ingredient',
              calories: Number(ing.calories) || 0,
              protein: Number(ing.protein) || 0,
              carbs: Number(ing.carbs) || 0,
              fat: Number(ing.fat) || 0,
            }));

            const meal_totals = sanitized_ingredients.reduce(
              (totals, ing) => {
                totals.calories += ing.calories;
                totals.protein += ing.protein;
                totals.carbs += ing.carbs;
                totals.fat += ing.fat;
                return totals;
              },
              { calories: 0, protein: 0, carbs: 0, fat: 0 }
            );

            weekly_summary.total_calories += meal_totals.calories;
            weekly_summary.total_protein += meal_totals.protein;
            weekly_summary.total_carbs += meal_totals.carbs;
            weekly_summary.total_fat += meal_totals.fat;

            return {
              meal_name:
                input.meal_targets![index]?.meal_name || `Meal ${index + 1}`,
              meal_title:
                meal.meal_title ||
                `AI Generated ${
                  input.meal_targets![index]?.meal_name || 'Meal'
                }`,
              ingredients: sanitized_ingredients,
              total_calories: meal_totals.calories || undefined,
              total_protein_g: meal_totals.protein || undefined,
              total_carbs_g: meal_totals.carbs || undefined,
              total_fat_g: meal_totals.fat || undefined,
            } as AIGeneratedMeal;
          })
          .filter((meal): meal is AIGeneratedMeal => meal !== null);

        if (processedMeals.length > 0) {
          processedWeeklyPlan.push({
            day_of_week,
            meals: processedMeals,
          });
        }
      } catch (e) {
        console.error(`Failed to generate meal plan for ${day_of_week}:`, e);
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

    const final_output: GeneratePersonalizedMealPlanOutput = {
      days: processedWeeklyPlan,
      weekly_summary,
    };

    return final_output;
  }
);
