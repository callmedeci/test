'use server';

import { ai } from '@/ai/genkit';
import {
  GeneratePersonalizedMealPlanInputSchema,
  GeneratePersonalizedMealPlanOutputSchema,
  type GeneratePersonalizedMealPlanOutput,
  type GeneratePersonalizedMealPlanInput,
} from '@/lib/schemas';
import { getAIApiErrorMessage } from '@/lib/utils';

export async function generatePersonalizedMealPlan(
  input: GeneratePersonalizedMealPlanInput
): Promise<GeneratePersonalizedMealPlanOutput> {
  return generatePersonalizedMealPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedMealPlanPrompt',
  input: { schema: GeneratePersonalizedMealPlanInputSchema },
  output: { schema: GeneratePersonalizedMealPlanOutputSchema },
  prompt: `You are NutriMind, an elite AI nutritionist. Your task is to create a complete, delicious, and highly personalized 7-day meal plan based on a detailed user profile and specific nutritional targets. The output must be perfect, as it will be used directly in an application.

**[Step 1] Deep Profile Analysis**
First, meticulously analyze every detail of the user's profile. This is the foundation for a truly personalized plan.

**👤 User Profile & Goals:**
- **Bio:** {{age}}-year-old {{biological_sex}}, {{height_cm}} cm, {{current_weight_kg}} kg.
- **Primary Goal:** {{primary_diet_goal}}.
- **Activity Level:** {{physical_activity_level}}.
- **Dietary System:** Follows a strict **{{preferred_diet}}** diet.
- **Allergies (Critical):** Absolutely NO ingredients from this list: {{#if allergies.length}}{{#each allergies}}{{this}} {{/each}}{{else}}None{{/if}}.
- **Cuisine Preferences:**
  - **Likes:** {{#if preferred_cuisines.length}}{{#each preferred_cuisines}}{{this}} {{/each}}{{else}}None specified{{/if}}.
  - **Dislikes:** {{#if dispreferrred_cuisines.length}}{{#each dispreferrred_cuisines}}{{this}} {{/each}}{{else}}None specified{{/if}}.
- **Ingredient Preferences:**
  - **Likes:** {{#if preferred_ingredients.length}}{{#each preferred_ingredients}}{{this}} {{/each}}{{else}}None specified{{/if}}.
  - **Dislikes:** {{#if dispreferrred_ingredients.length}}{{#each dispreferrred_ingredients}}{{this}} {{/each}}{{else}}None specified{{/if}}.
- **Health Context:**
  - **Medical Conditions:** {{#if medical_conditions.length}}{{#each medical_conditions}}{{this}} {{/each}}{{else}}None{{/if}}. Adjust plan accordingly (e.g., lower sodium for hypertension).
  - **Micronutrient Focus:** Emphasize ingredients rich in: {{#if preferred_micronutrients.length}}{{#each preferred_micronutrients}}{{this}} {{/each}}{{else}}None specified{{/if}}.

**[Step 2] Daily Macro Calculation**
Based on the user's profile, determine the target daily calories and macronutrients.
- **Goal:** For **{{primary_diet_goal}}**, a caloric surplus/deficit of 300-500 kcal from maintenance is appropriate.
- **Distribution:** Aim for a balanced macronutrient split (e.g., 40% carbs, 30% protein, 30% fat), but adjust based on the user's diet type (e.g., higher fat for Keto). The final weekly totals must be accurate.

**[Step 3] Meal Plan Generation**
Generate a 7-day meal plan, with each day consisting of six meals: Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner, and Evening Snack. Follow these critical rules:

🧠 **CRITICAL THINKING RULES:**
1.  **Meal Appropriateness:** Each meal must be suitable for its designated time. For example, Breakfast should include typical breakfast foods, not heavy dinner-style meals like 'Steak and Potatoes'.
2.  **Variety is Key:** Ensure variety across the week. Do not repeat the same meal on multiple days unless limited by dietary restrictions. Be creative in suggesting different dishes.
3.  **Complete Meals:** Each meal should be a complete, logical recipe. Do not list isolated ingredients (e.g., "Chicken Breast"); combine them into a full dish.
4.  **Macro Distribution:** Distribute the daily macros logically across the six meals. Breakfast, Lunch, and Dinner should be more substantial, while snacks should be lighter but still nutritious.

**[Step 4] Final JSON Assembly & Validation**
Construct the final JSON object with the following structure:

**Strict JSON Output Format:**
Your response MUST be a JSON object with two top-level keys: "days" and "weekly_summary".

- **\`days\`**: An array of 7 day objects, one for each day of the week (Monday to Sunday).
  - Each day object has:
    - **\`day_of_week\`**: string (e.g., "Monday", "Tuesday", ..., "Sunday").
    - **\`meals\`**: An array of exactly 6 meal objects: "Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Dinner", "Evening Snack".
      - Each meal object has:
        - **\`meal_name\`**: string (one of the six meal types).
        - **\`ingredients\`**: An array of ingredient objects.
          - Each ingredient object has:
            - **\`name\`**: string.
            - **\`quantity\`**: number (amount in grams for this meal).
            - **\`calories\`**: number (per 100g).
            - **\`protein\`**: number (per 100g).
            - **\`carbs\`**: number (per 100g).
            - **\`fat\`**: number (per 100g).
        - **\`total_calories\`**, **\`total_protein\`**, **\`total_carbs\`**, **\`total_fat\`**: number (totals for that meal).
- **\`weekly_summary\`**: An object with the sum of all macros for the entire week.
  - **\`total_calories\`**, **\`total_protein\`**, **\`total_carbs\`**, **\`total_fat\`**: number.

**Example JSON:**
\`\`\`json
{
  "days": [
    {
      "day_of_week": "Monday",
      "meals": [
        {
          "meal_name": "Breakfast",
          "ingredients": [
            {
              "name": "Oats",
              "quantity": 50,
              "calories": 389,
              "protein": 16.9,
              "carbs": 66.3,
              "fat": 6.9
            }
          ],
          "total_calories": 500,
          "total_protein": 30,
          "total_carbs": 60,
          "total_fat": 15
        },
        {
          "meal_name": "Morning Snack",
          "ingredients": [],
          "total_calories": 200,
          "total_protein": 10,
          "total_carbs": 25,
          "total_fat": 8
        },
        {
          "meal_name": "Lunch",
          "ingredients": [],
          "total_calories": 600,
          "total_protein": 35,
          "total_carbs": 70,
          "total_fat": 20
        },
        {
          "meal_name": "Afternoon Snack",
          "ingredients": [],
          "total_calories": 200,
          "total_protein": 10,
          "total_carbs": 25,
          "total_fat": 8
        },
        {
          "meal_name": "Dinner",
          "ingredients": [],
          "total_calories": 700,
          "total_protein": 40,
          "total_carbs": 80,
          "total_fat": 25
        },
        {
          "meal_name": "Evening Snack",
          "ingredients": [],
          "total_calories": 200,
          "total_protein": 10,
          "total_carbs": 25,
          "total_fat": 8
        }
      ]
    }
    // Repeat similar structure for Tuesday through Sunday
  ],
  "weekly_summary": {
    "total_calories": 14000,
    "total_protein": 1050,
    "total_carbs": 1400,
    "total_fat": 466
  }
}
\`\`\`

Ensure that the "days" array contains exactly seven day objects, each with six meal objects as specified. Generate the complete meal plan for all seven days—do not stop after one day. The meal plans for each day should be distinct to maximize variety.

⚠️ **FINAL WARNING:** Before responding, double-check every calculation and ensure the JSON is perfectly formatted with the exact field names shown. Respond ONLY with the pure JSON object. No introductory text, comments, or markdown wrappers.
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
    try {
      const { output } = await prompt(input);
      if (!output) throw new Error('AI did not return output.');

      const validationResult =
        GeneratePersonalizedMealPlanOutputSchema.safeParse(output);
      if (!validationResult.success) {
        console.error(
          'AI output validation error:',
          validationResult.error.flatten()
        );
        throw new Error(
          `AI returned data in an unexpected format. Details: ${validationResult.error.message}`
        );
      }

      return validationResult.data;
    } catch (error: any) {
      console.error('Error in suggestMealsForMacrosFlow:', error);
      throw new Error(getAIApiErrorMessage(error));
    }
  }
);