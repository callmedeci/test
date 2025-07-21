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
- **Allergies (Critical):** Absolutely NO ingredients from this list: {{#if allergies.length}}{{join allergies ", "}}{{else}}None{{/if}}.
- **Cuisine Preferences:**
  - **Likes:** {{#if preferred_cuisines.length}}{{join preferred_cuisines ", "}}{{else}}None specified{{/if}}.
  - **Dislikes:** {{#if dispreferrred_cuisines.length}}{{join dispreferrred_cuisines ", "}}{{else}}None specified{{/if}}.
- **Ingredient Preferences:**
  - **Likes:** {{#if preferred_ingredients.length}}{{join preferred_ingredients ", "}}{{else}}None specified{{/if}}.
  - **Dislikes:** {{#if dispreferrred_ingredients.length}}{{join dispreferrred_ingredients ", "}}{{else}}None specified{{/if}}.
- **Health Context:**
  - **Medical Conditions:** {{#if medical_conditions.length}}{{join medical_conditions ", "}}{{else}}None{{/if}}. Adjust plan accordingly (e.g., lower sodium for hypertension).
  - **Micronutrient Focus:** Emphasize ingredients rich in: {{#if preferred_micronutrients.length}}{{join preferred_micronutrients ", "}}{{else}}None specified{{/if}}.

**[Step 2] Daily Macro Calculation**
Based on the user's profile, determine the target daily calories and macronutrients.
- **Goal:** For **{{primary_diet_goal}}**, a caloric surplus/deficit of 300-500 kcal from maintenance is appropriate.
- **Distribution:** Aim for a balanced macronutrient split (e.g., 40% carbs, 30% protein, 30% fat), but adjust based on the user's diet type (e.g., higher fat for Keto). The final weekly totals must be accurate.

**[Step 3] Meal Plan Generation**
Create the 7-day plan, following these critical rules:

🧠 **CRITICAL THINKING RULES:**
1.  **Meal Appropriateness:** Meals MUST be appropriate for their designated time. Do not suggest heavy, dinner-style meals like 'Steak and Potatoes' for 'Breakfast'. Breakfast should be breakfast food, lunch should be lunch food.
2.  **Variety is Key:** Strive for variety across the week. Do not suggest the exact same meal multiple days in a row. Show creativity.
3.  **Create Real Meals:** Each meal must be a complete, logical recipe. Do not list just one or two isolated ingredients (e.g., "Chicken Breast"). Combine it with other foods to make a full dish.
4.  **Logical Macro Distribution:** Distribute the daily macros logically across the 5 meals. Breakfast and Lunch should be substantial, with smaller, appropriate snacks in between.

**[Step 4] Final JSON Assembly & Validation**
Construct the final JSON object. The structure MUST be exactly as follows to match the application's requirements.

**Strict JSON Output Format:**
Your response MUST be a JSON object with two top-level keys: "days" and "weekly_summary".

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
        }
      ]
    }
  ],
  "weekly_summary": {
    "total_calories": 14000,
    "total_protein": 1050,
    "total_carbs": 1400,
    "total_fat": 466
  }
}
\`\`\`

**Breakdown of the required structure:**
- **\`days\`**: An array of 7 day objects (one for each day of the week).
  - Each day object has:
    - **\`day_of_week\`**: string (e.g., "Monday", "Tuesday").
    - **\`meals\`**: An array of exactly 5 meal objects ("Breakfast", "Snack 1", "Lunch", "Snack 2", "Dinner").
      - Each meal object has:
        - **\`meal_name\`**: string.
        - **\`ingredients\`**: An array of ingredient objects.
          - Each ingredient object has a FLAT structure:
            - **\`name\`**: string.
            - **\`quantity\`**: number (the amount for this meal in grams).
            - **\`calories\`**: number (per 100g of the ingredient).
            - **\`protein\`**: number (per 100g).
            - **\`carbs\`**: number (per 100g).
            - **\`fat\`**: number (per 100g).
        - **\`total_calories\`**, **\`total_protein\`**, **\`total_carbs\`**, **\`total_fat\`**: number (The calculated total for that specific meal).
- **\`weekly_summary\`**: An object containing the sum of all macros for the entire week.
  - **\`total_calories\`**, **\`total_protein\`**, **\`total_carbs\`**, **\`total_fat\`**: number.

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
