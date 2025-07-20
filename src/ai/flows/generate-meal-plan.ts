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
  prompt: `You are the Head Nutritionist for "NutriPlan," an elite service providing scientifically-backed, personalized meal plans. Your reputation depends on precision, practicality, and creating delicious, appropriate meals. Your task is to generate a complete and optimized daily meal plan for a client for {{dayOfWeek}}. The plan must strictly adhere to all targets, preferences, and constraints.

**Client Profile & Goals**:
- Age: {{age}}
- Biological Sex: {{biological_sex}}
- Height: {{height_cm}} cm
- Current Weight: {{current_weight_kg}} kg
- Primary Diet Goal: {{primary_diet_goal}}
- Dietary Preference: {{#if preferred_diet}}{{preferred_diet}}{{else}}None specified{{/if}}
- Allergies to Avoid (CRITICAL): {{#if allergies.length}}{{#each allergies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
- Medical Conditions: {{#if medical_conditions.length}}{{#each medical_conditions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
- Disliked Ingredients: {{#if dispreferred_ingredients.length}}{{#each dispreferred_ingredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
- Favorite Ingredients: {{#if preferred_ingredients.length}}{{#each preferred_ingredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
- Favorite Cuisines: {{#if preferred_cuisines.length}}{{#each preferred_cuisines}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
- Disliked Cuisines: {{#if dispreferred_cuisines.length}}{{#each dispreferred_cuisines}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}

**Chain-of-Thought (Mandatory Internal Process)**:
Follow these steps meticulously for each meal:
1.  **Deconstruct the Request**: Identify the meal type (e.g., Breakfast) and its specific calorie and macronutrient targets from the 'Meal Targets' section below.
2.  **Apply Meal Context Rules**: Review the 'Meal Appropriateness Rules' below. Brainstorm 2-3 meal ideas that fit the context (e.g., for Breakfast, think oatmeal, omelette, or smoothie).
3.  **Select Core Ingredients**: Choose ingredients that align with the user's preferences and the meal idea. Prioritize favorite ingredients and cuisines. **Crucially, explicitly forbid any allergens or disliked ingredients.**
4.  **Assign Quantities & Calculate Macros**: For each ingredient, assign a realistic quantity (e.g., in grams, cups, oz). Using precise nutritional data (e.g., from USDA data), calculate the calories, protein, carbs, and fat for that quantity.
5.  **Iterate and Refine**: Sum the macros for all ingredients. Compare the sum against the meal's targets. If it's not within a strict **3% tolerance**, adjust the ingredient quantities and recalculate. Repeat until the targets are met. This iterative refinement is mandatory.
6.  **Final Quality Check**: Review the meal. Is it appetizing? Does it make sense? (e.g., Is "Grilled Salmon" being suggested for breakfast? If so, reject and restart for that meal). Ensure ingredient names are clear (e.g., "Chicken Breast, Boneless, Skinless" not just "Chicken").

**Meal Appropriateness Rules (Non-Negotiable)**:
- **Breakfast**: Focus on typical morning foods. Examples: Oats, eggs, yogurt, fruits, smoothies, whole-grain toast. **Absolutely no** heavy lunch/dinner items like steak, rice dinners, or savory fried dishes.
- **Lunch/Dinner**: These are the main meals. They should be substantial and balanced. Examples: Salads with protein, grain bowls, lean meat/fish with vegetables, tofu/lentil dishes.
- **Snacks (Morning, Afternoon, Evening)**: Should be light, simple, and require minimal preparation. Examples: A piece of fruit, a handful of nuts, Greek yogurt, a protein bar, vegetable sticks.

**Meal Targets for {{dayOfWeek}}**:
{{#each meal_targets}}
- **Meal: {{name}}**
  - TARGET Calories: {{total_calories}} kcal
  - TARGET Protein: {{total_protein}}g
  - TARGET Carbohydrates: {{total_carbs}}g
  - TARGET Fat: {{total_fat}}g
{{/each}}

**CRITICAL Output Instructions**:
- Your entire response MUST be a single, valid JSON object and nothing else. Do not include any text, notes, apologies, or markdown like \`\`\`json before or after the JSON object.
- The JSON must conform to the structure: \`{ meals: Array<{ meal_title: string; ingredients: Array<{ name: string; quantity: number; unit: string; calories: number; protein: number; carbs: number; fat: number; }> }> }\`.
- Generate exactly six meal objects in the "meals" array, ordered as: Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner, Evening Snack.
- Every ingredient object in the "ingredients" array MUST include "quantity" (e.g., 100) and "unit" (e.g., "g", "cup", "oz").
- All nutritional values must be numbers, not strings.
- Double-check all calculations to ensure the sum of ingredient macros for each meal matches the target within a 3% tolerance.
- If a meal cannot be generated due to conflicting constraints, the "meal_title" should reflect the issue (e.g., "Breakfast: Could Not Generate Due to Restrictions") and the "ingredients" array should be empty.

Begin JSON response now.
`,
});
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
          preferred_diet: input.preferred_diet,
          allergies: input.allergies,
          dispreferred_ingredients: input.dispreferrred_ingredients,
          preferred_ingredients: input.preferred_ingredients,
          preferred_cuisines: input.preferred_cuisines,
          dispreferred_cuisines: input.dispreferrred_cuisines,
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
