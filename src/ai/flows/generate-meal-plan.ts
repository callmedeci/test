'use server';

import {
  GeneratePersonalizedMealPlanInputSchema,
  GeneratePersonalizedMealPlanOutputSchema,
  type GeneratePersonalizedMealPlanOutput,
  type GeneratePersonalizedMealPlanInput,
} from '@/lib/schemas';
import { getAIApiErrorMessage } from '@/lib/utils';
import { geminiModel, openaiModel } from '../genkit';

export async function generatePersonalizedMealPlan(
  input: GeneratePersonalizedMealPlanInput
): Promise<GeneratePersonalizedMealPlanOutput> {
  return generatePersonalizedMealPlanFlow(input);
}

const prompt = geminiModel.definePrompt({
  name: 'generatePersonalizedMealPlanPrompt',
  input: { schema: GeneratePersonalizedMealPlanInputSchema },
  output: { schema: GeneratePersonalizedMealPlanOutputSchema },

  prompt: `You are NutriMind, an elite AI nutritionist. Your single most important task is to create a COMPLETE and FULLY-DETAILED 7-day meal plan. The output must be a perfect, unabridged JSON object.

**[Step 1] In-Depth User Profile Analysis**
Analyze every detail of the user's profile to create a truly personalized plan.
... (Keep your user profile section exactly the same) ...

**[Step 2] Internal Plan of Action (Do Not Output This Plan)**
Before generating the JSON, you will perform these steps internally:
1.  Calculate the user's target daily calories and macros.
2.  Design a unique and appropriate set of six meals for **Monday**.
3.  Design a unique and appropriate set of six meals for **Tuesday**.
4.  Design a unique and appropriate set of six meals for **Wednesday**.
5.  Design a unique and appropriate set of six meals for **Thursday**.
6.  Design a unique and appropriate set of six meals for **Friday**.
7.  Design a unique and appropriate set of six meals for **Saturday**.
8.  Design a unique and appropriate set of six meals for **Sunday**.
9.  Calculate the final weekly summary totals based on ALL SEVEN days.
10. Assemble the complete JSON object as specified below.

**[Step 3] 7-Day Meal Plan Generation**
Generate the 7-day meal plan based on your internal plan. Follow these non-negotiable rules:

🧠 **CRITICAL THINKING RULES:**
1.  **COMPLETE 7-DAY OUTPUT:** You absolutely must generate the full plan for all seven days, from Monday to Sunday. Incomplete plans are unacceptable.
2.  **EXACT MEAL NAMES:** Each day must contain six meals, named exactly: "Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Dinner", and "Evening Snack".
3.  **VARIETY AND APPROPRIATENESS:** Ensure meal variety across the week. Meals must be logical for their time of day.
4.  **COMPLETE MEALS:** Do not list single ingredients. Create full dishes (e.g., "Salmon with Roasted Asparagus").

**[Step 4] Final JSON Assembly**
Your response MUST be a single, valid JSON object and nothing else. The 'days' array must contain 7 elements.

**Strict JSON Output Format Example (Showing Monday and Tuesday):**
\`\`\`json
{
  "days": [
    {
      "day_of_week": "Monday",
      "meals": [
        { "meal_name": "Breakfast", "ingredients": [{"name": "Greek Yogurt", "quantity": 150, "calories": 150, "protein": 15, "carbs": 8, "fat": 6}], "total_calories": 450, "total_protein": 30, "total_carbs": 50, "total_fat": 15 },
        { "meal_name": "Morning Snack", "ingredients": [], "total_calories": 200, "total_protein": 10, "total_carbs": 25, "total_fat": 8 },
        { "meal_name": "Lunch", "ingredients": [], "total_calories": 600, "total_protein": 40, "total_carbs": 60, "total_fat": 20 },
        { "meal_name": "Afternoon Snack", "ingredients": [], "total_calories": 200, "total_protein": 10, "total_carbs": 25, "total_fat": 8 },
        { "meal_name": "Dinner", "ingredients": [], "total_calories": 700, "total_protein": 45, "total_carbs": 70, "total_fat": 25 },
        { "meal_name": "Evening Snack", "ingredients": [], "total_calories": 150, "total_protein": 10, "total_carbs": 15, "total_fat": 5 }
      ]
    },
    {
      "day_of_week": "Tuesday",
      "meals": [
        { "meal_name": "Breakfast", "ingredients": [{"name": "Oatmeal with Berries", "quantity": 50, "calories": 300, "protein": 10, "carbs": 55, "fat": 5}], "total_calories": 450, "total_protein": 30, "total_carbs": 50, "total_fat": 15 },
        { "meal_name": "Morning Snack", "ingredients": [], "total_calories": 200, "total_protein": 10, "total_carbs": 25, "total_fat": 8 },
        { "meal_name": "Lunch", "ingredients": [], "total_calories": 600, "total_protein": 40, "total_carbs": 60, "total_fat": 20 },
        { "meal_name": "Afternoon Snack", "ingredients": [], "total_calories": 200, "total_protein": 10, "total_carbs": 25, "total_fat": 8 },
        { "meal_name": "Dinner", "ingredients": [], "total_calories": 700, "total_protein": 45, "total_carbs": 70, "total_fat": 25 },
        { "meal_name": "Evening Snack", "ingredients": [], "total_calories": 150, "total_protein": 10, "total_carbs": 15, "total_fat": 5 }
      ]
    }
    // ... and so on for Wednesday, Thursday, Friday, Saturday, and Sunday.
  ],
  "weekly_summary": {
    "total_calories": 16100,
    "total_protein": 1050,
    "total_carbs": 1750,
    "total_fat": 567
  }
}
\`\`\`

⚠️ **FINAL COMMAND:** Generate the entire, unabridged 7-day meal plan. Do not truncate the output. The final JSON object must be complete.
`,
});

const generatePersonalizedMealPlanFlow = openaiModel.defineFlow(
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

      console.log('AI OUTPUT 🔥🔥', output);

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

      return output;
    } catch (error: any) {
      console.error('Error in suggestMealsForMacrosFlow:', error);
      throw new Error(getAIApiErrorMessage(error));
    }
  }
);
