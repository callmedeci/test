'use server';

import { ai } from '@/ai/genkit';

import {
  AdjustMealIngredientsInputSchema,
  AdjustMealIngredientsOutputSchema,
  type AdjustMealIngredientsInput,
  type AdjustMealIngredientsOutput,
} from '@/lib/schemas';

export async function adjustMealIngredients(
  input: AdjustMealIngredientsInput
): Promise<AdjustMealIngredientsOutput> {
  return adjustMealIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustMealIngredientsPrompt',
  input: { schema: AdjustMealIngredientsInputSchema },
  output: { schema: AdjustMealIngredientsOutputSchema },
  prompt: `You are an expert nutritionist and culinary advisor. Your task is to either:
A) Optimize existing meal ingredients to match target macros, OR
B) Create a new nutritionally complete meal when no ingredients are provided

**-- DUAL-MODE PROCESSING RULES --**
1. **IF INGREDIENTS EXIST (Optimization Mode):**
   - Adjust ONLY ingredient quantities (no additions/removals/substitutions)
   - Maintain the meal's fundamental character (e.g., pizza remains pizza)
   - Ensure adjusted meal remains nutritionally balanced and eatable

2. **IF NO INGREDIENTS (Creation Mode):**
   - Create a COMPLETE meal using these guidelines:
     a. Must include: Protein source + Complex carb + Vegetables/Fruit + Healthy fat
     b. Respect meal type conventions (e.g., no steak for breakfast)
     c. Prioritize user's preferred ingredients ({{#if userProfile.preferred_ingredients.length}}{{{userProfile.preferred_ingredients}}}{{else}}common ingredients{{/if}})
     d. Strictly avoid allergies/dislikes: {{#if userProfile.allergies.length}}{{{userProfile.allergies}}}{{else}}none{{/if}} / {{#if userProfile.dispreferrred_ingredients.length}}{{{userProfile.dispreferrred_ingredients}}}{{else}}none{{/if}}
     e. Match target macros within 5% tolerance

3. **FOR ALL OUTPUTS:**
   - Recalculate ALL nutritional values accurately
   - Ensure meals are practical (<40min prep time)
   - Maintain cultural appropriateness ({{#if userProfile.preferred_cuisines}}{{{userProfile.preferred_cuisines}}}{{else}}global{{/if}} cuisine)
   - Provide clear explanations of nutritional rationale

**User Profile Context:**
[Same profile sections as before]

{{#if originalMeal.ingredients.length}}**Optimization Mode Activated**
Original Meal: {{originalMeal.name}}
Ingredients to optimize:
{{#each originalMeal.ingredients}}
- {{this.name}}: {{this.quantity}} {{this.unit}}
{{/each}}
{{else}}**Creation Mode Activated**
Building new {{originalMeal.name}} meal from scratch
{{/if}}

**Target Macros:**
- Calories: {{targetMacros.calories}}
- Protein: {{targetMacros.protein}}g
- Carbs: {{targetMacros.carbs}}g
- Fat: {{targetMacros.fat}}g

**Meal Construction Principles:**
1. Protein: {{targetMacros.protein}}g ≈ {{math targetMacros.protein divided_by 4}}% of calories
2. Carbs: {{targetMacros.carbs}}g ≈ {{math targetMacros.carbs multiplied_by 4 divided_by targetMacros.calories times 100}}% of calories
3. Fat: {{targetMacros.fat}}g ≈ {{math targetMacros.fat multiplied_by 9 divided_by targetMacros.calories times 100}}% of calories
4. Fiber: Minimum {{math targetMacros.calories divided_by 1000 times 14}}g
5. Sodium: <{{math targetMacros.calories divided_by 1000 times 500}}mg

**Strict Output Requirements:**
[Same JSON structure requirements]`,
});

const adjustMealIngredientsFlow = ai.defineFlow(
  {
    name: 'adjustMealIngredientsFlow',
    inputSchema: AdjustMealIngredientsInputSchema,
    outputSchema: AdjustMealIngredientsOutputSchema,
  },
  async (
    input: AdjustMealIngredientsInput
  ): Promise<AdjustMealIngredientsOutput> => {
    try {
      const { output } = await prompt(input);

      if (!output)
        throw new Error('AI did not return an output for meal adjustment.');

      const validationResult =
        AdjustMealIngredientsOutputSchema.safeParse(output);
      if (!validationResult.success) {
        throw new Error(
          `AI returned data in an unexpected format. Details: ${validationResult.error.message}`
        );
      }

      return validationResult.data;
    } catch (error: any) {
      console.error('Error in adjustMealIngredientsFlow:', error);
      throw new Error(error);
    }
  }
);
