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
  prompt: `You are a professional AI nutritionist tasked with creating a HIGHLY PERSONALIZED weekly meal plan. The accuracy and relevance of this plan are CRITICAL for the user's health and satisfaction. You MUST meticulously analyze and incorporate ALL user data provided below.

**USER PROFILE DATA:**
{{{input}}}

**DAILY NUTRITION TARGETS:**
- Daily Calories: {{daily_calories_target}}
- Daily Protein: {{daily_protein_target}}g
- Daily Carbs: {{daily_carbs_target}}g
- Daily Fat: {{daily_fat_target}}g

**CRITICAL PERSONALIZATION REQUIREMENTS:**
1. DIETARY RESTRICTIONS: Strictly follow {{preferredDiet}} diet - ONLY use compatible ingredients.
2. ALLERGIES: NEVER include {{allergies}} - this is a safety imperative.
3. PREFERRED CUISINES: Prioritize {{preferredCuisines}}.
4. AVOID CUISINES: Exclude {{dispreferredCuisines}}.
5. PREFERRED INGREDIENTS: Frequently use {{preferredIngredients}}.
6. AVOID INGREDIENTS: Never use {{dispreferredIngredients}}.
7. MEDICAL CONDITIONS: Adjust for {{medicalConditions}} (e.g., reduce sodium for hypertension).
8. GOAL: Tailor to {{primary_diet_goal}} - adjust portions and macros accordingly.
9. ACTIVITY LEVEL: Account for {{physical_activity_level}}.
10. MICRONUTRIENTS: Emphasize {{preferred_micronutrients}} in selections.

**MEAL TYPE GUIDELINES:**
- Breakfast: Use typical foods like eggs, oatmeal, fruits, yogurt.
- Snacks: Light options like fruits, nuts, small protein portions.
- Lunch and Dinner: Balanced meals with protein, vegetables, carbs.
- Ensure meals suit their time of day.

**MEAL DISTRIBUTION:**
- If {{meal_distributions}} is provided, allocate calories and macros per meal accordingly.
- Otherwise, use: 20% Breakfast, 10% Morning Snack, 25% Lunch, 10% Afternoon Snack, 25% Dinner, 10% Evening Snack.

**MEAL PLAN STRUCTURE:**
Return a JSON object with two top-level properties:
1. "days": Array of 7 day objects (Monday-Sunday)
2. "weekly_summary": Nutritional totals for the week

**DETAILED JSON STRUCTURE:**
"days":
- Array of 7 day objects
- Each day object has:
  - "day_of_week": string (e.g., "Monday")
  - "meals": array of exactly 6 meal objects (Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner, Evening Snack)

Each meal object must have:
- "meal_name": string
- "ingredients": array of ingredient objects
- "total_calories": number
- "total_protein": number
- "total_carbs": number
- "total_fat": number

Each ingredient object must have:
- "name": string
- "quantity_g": number
- "macros": object with:
  - "calories": number
  - "protein_g": number
  - "carbs_g": number
  - "fat_g": number (values for quantity_g)

"weekly_summary":
- "total_calories": number
- "total_protein": number
- "total_carbs": number
- "total_fat": number
- Ensure totals approximate 7 * daily targets.

**ADDITIONAL INSTRUCTIONS:**
- Vary meals across the week for diversity.
- Ensure ingredients complement each other culinarily.
- Use realistic, safe quantities for human consumption.

**VALIDATION CHECKLIST:**
✓ Macros match 7 * daily targets
✓ No allergens or dispreferred items
✓ Meals align with {{preferredDiet}} and {{preferredCuisines}}
✓ Meal types suit their time of day
✓ Calculations are accurate
✓ JSON structure is exact

**IMPORTANT RULES:**
- Use EXACT field names
- NO extra fields in weekly_summary
- ALL values must be realistic and calculated correctly
- Respond with pure JSON only.`,
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
