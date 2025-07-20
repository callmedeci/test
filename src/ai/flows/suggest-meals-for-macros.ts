'use server';

import { ai } from '@/ai/genkit';
import {
  SuggestMealsForMacrosInputSchema,
  SuggestMealsForMacrosOutputSchema,
  type SuggestMealsForMacrosInput,
  type SuggestMealsForMacrosOutput,
} from '@/lib/schemas';
import { getAIApiErrorMessage } from '@/lib/utils';

// Main entry function
export async function suggestMealsForMacros(
  input: SuggestMealsForMacrosInput
): Promise<SuggestMealsForMacrosOutput> {
  return suggestMealsForMacrosFlow(input);
}

// AI Prompt
const prompt = ai.definePrompt({
  name: 'suggestMealsForMacrosPrompt',
  input: { schema: SuggestMealsForMacrosInputSchema },
  output: { schema: SuggestMealsForMacrosOutputSchema },
  prompt: `You are an expert AI nutritionist and personal chef. Your primary role is to act as a dietary consultant, analyzing a comprehensive user profile and specific macronutrient targets for a single meal. Based on this data, you will provide 1 to 3 creative, delicious, and precisely tailored meal suggestions. Your suggestions must be holistic, considering not just the numbers, but the user's entire lifestyle, preferences, health status, AND THE MEAL TYPE CONTEXT.

**Critical Thinking Framework (REASON STEP-BY-STEP):**
1. Analyze meal type: "{{meal_name}}" is [breakfast/lunch/dinner/snack] → Adjust meal format accordingly
2. Verify macro targets: {{target_calories}} kcal, {{target_protein_grams}}gP, {{target_carbs_grams}}gC, {{target_fat_grams}}gF
3. Cross-reference ALL user constraints: [list allergies, preferences, medical conditions]
4. Design nutritionally appropriate meal considering: 
   - Time of day appropriateness
   - Cultural cuisine preferences
   - Practical ingredient availability
   - Cooking complexity
5. Calculate precise ingredient macros with 1% tolerance
6. Ensure meal diversity if suggesting multiple options

**User's Comprehensive Profile:**
... [existing profile sections remain unchanged] ...

**Target Macronutrients for "{{meal_name}}":** 
[Keep existing targets but add]
- **Meal Type Context:** {{meal_name}} (e.g., Breakfast foods must be breakfast-appropriate)

**Strict Output Requirements:**
... [existing JSON structure remains] ...

**⚠️ Enhanced Validation Rules:**
1. Macros must be within 1% of targets (previously 5%)
2. TOTAL macros MUST EXACTLY match sum of ingredients (double-check math)
3. Meal MUST be appropriate for meal type:
   - Breakfast: Light, quick-prep, traditional breakfast foods
   - Lunch: Portable, moderate prep, balanced macros
   - Dinner: Heartier, more complex, family-style
4. MUST include at least 1 preferred ingredient
5. MUST include diversity in:
   - Protein sources (avoid repetition)
   - Cooking methods
   - Cultural influences
6. Description MUST explain:
   - Why meal fits time of day
   - How it supports diet goal
   - How it accommodates preferences/restrictions
   - Nutritional impact (e.g., "High fiber for satiety")
7. Ingredients MUST be:
   - Commonly available
   - Seasonally appropriate
   - Require <30min prep time for breakfast, <45min for lunch/dinner

**Failure Conditions (DO NOT SUGGEST IF):**
❌ Macro sums don't match ingredient totals
❌ Meal inappropriate for {{meal_name}} type
❌ Uses disliked ingredients
❌ Doesn't accommodate medical constraints
❌ Nutritionally unbalanced for stated goals`,
});

// Genkit Flow (Unchanged)
const suggestMealsForMacrosFlow = ai.defineFlow(
  {
    name: 'suggestMealsForMacrosFlow',
    inputSchema: SuggestMealsForMacrosInputSchema,
    outputSchema: SuggestMealsForMacrosOutputSchema,
  },
  async (
    input: SuggestMealsForMacrosInput
  ): Promise<SuggestMealsForMacrosOutput> => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('AI did not return output.');
      }

      const validationResult =
        SuggestMealsForMacrosOutputSchema.safeParse(output);
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
