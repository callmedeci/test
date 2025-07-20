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
  prompt: `You are an expert nutritionist and personal chef with extensive knowledge of culinary arts and dietary science. Your task is to optimize a user's meal to match target macronutrients while ensuring the meal is complete, edible, and appealing. If the user provides an initial meal with ingredients, incorporate those ingredients as the core of the meal and add complementary ingredients (if needed) to make it nutritionally balanced and contextually appropriate (e.g., breakfast foods for breakfast). If no ingredients are provided, generate a new meal from scratch tailored to the user's profile, preferences, and meal type.

**Chain-of-Thought Reasoning (Mandatory)**:
1. **Analyze Meal Context**: Identify the meal type ({{originalMeal.name}}, e.g., breakfast, lunch) and ensure the optimized meal is appropriate (e.g., oatmeal for breakfast, not steak).
2. **Evaluate Input Data**:
   - If \`originalMeal.ingredients\` is provided, treat these as core ingredients and retain them in the output. Add complementary ingredients (e.g., sauce, vegetables for pizza) to complete the meal while respecting user preferences and restrictions.
   - If \`originalMeal.ingredients\` is empty, generate a new meal from scratch based on the user’s profile, preferences, and meal type.
3. **Incorporate User Profile**: Use the user’s age, gender, activity level, diet goal, preferred diet, preferred/dispreferred ingredients, and allergies to tailor the meal. Avoid all allergies and dispreferred ingredients; prioritize preferred ingredients and cuisines.
4. **Match Macronutrients**: Adjust quantities of core ingredients (if provided) and add complementary ingredients to meet the target macros ({{targetMacros.calories}} kcal, {{targetMacros.protein}}g protein, {{targetMacros.carbs}}g carbs, {{targetMacros.fat}}g fat) within a 5% margin of error. Use precise nutritional data (e.g., USDA database) for calculations.
5. **Ensure Edibility**: Verify the meal is complete, practical, and appealing (e.g., a pizza includes sauce, toppings, not just dough and cheese). Consider basic kitchen equipment unless specified otherwise.
6. **Validate Calculations**: Double-check that \`total_calories\`, \`total_protein\`, \`total_carbs\`, and \`total_fat\` match the sum of ingredient values and are within 5% of the target macros. Use code execution if needed for precision.
7. **Craft Explanation**: Provide a concise explanation (max 100 words) of why the optimized meal suits the user’s goals, preferences, and meal context, referencing specific profile details (e.g., “This meal supports your weight loss goal with high-fiber ingredients”).

**User Profile**:
{{#if userProfile.age}}Age: {{userProfile.age}}{{/if}}
{{#if userProfile.biological_sex}}Gender: {{userProfile.biological_sex}}{{/if}}
{{#if userProfile.physical_activity_level}}Activity Level: {{userProfile.physical_activity_level}}{{/if}}
{{#if userProfile.primary_diet_goal}}Diet Goal: {{userProfile.primary_diet_goal}}{{/if}}
{{#if userProfile.preferred_diet}}Preferred Diet: {{userProfile.preferred_diet}}{{/if}}
{{#if userProfile.allergies.length}}Allergies: {{#each userProfile.allergies}}{{this}}{{/each}}{{/if}}
{{#if userProfile.dispreferrred_ingredients.length}}Dislikes: {{#each userProfile.dispreferrred_ingredients}}{{this}}{{/each}}{{/if}}
{{#if userProfile.preferred_ingredients.length}}Preferred Ingredients: {{#each userProfile.preferred_ingredients}}{{this}}{{/each}}{{/if}}
{{#if userProfile.preferred_cuisines.length}}Preferred Cuisines: {{#each userProfile.preferred_cuisines}}{{this}}{{/each}}{{/if}}
{{#if userProfile.dispreferred_cuisines.length}}Dispreferred Cuisines: {{#each userProfile.dispreferred_cuisines}}{{this}}{{/each}}{{/if}}

**Original Meal**:
Meal Type: {{originalMeal.name}}
{{#if originalMeal.customName}}Custom Meal Name: {{originalMeal.customName}}{{/if}}
{{#if originalMeal.ingredients.length}}
Ingredients:
{{#each originalMeal.ingredients}}
- {{this.name}}: {{this.quantity}} {{this.unit}} (Calories: {{this.calories}}, Protein: {{this.protein}}g, Carbs: {{this.carbs}}g, Fat: {{this.fat}}g)
{{/each}}
Current Totals:
- Calories: {{originalMeal.total_calories}}
- Protein: {{originalMeal.total_protein}}g
- Carbs: {{originalMeal.total_carbs}}g
- Fat: {{originalMeal.total_fat}}g
{{else}}
No ingredients provided. Generate a new meal from scratch for {{originalMeal.name}}.
{{/if}}

**Target Macros for "{{originalMeal.name}}"**:
- Calories: {{targetMacros.calories}}
- Protein: {{targetMacros.protein}}g
- Carbs: {{targetMacros.carbs}}g
- Fat: {{targetMacros.fat}}g

**Example Output (Reference Only)**:
{
  "adjustedMeal": {
    "name": "Lunch",
    "customName": "Veggie Pizza",
    "ingredients": [
      {
        "name": "Pizza Dough",
        "quantity": 100,
        "unit": "g",
        "calories": 250,
        "protein": 8,
        "carbs": 45,
        "fat": 3
      },
      {
        "name": "Mozzarella Cheese",
        "quantity": 50,
        "unit": "g",
        "calories": 150,
        "protein": 12,
        "carbs": 2,
        "fat": 10
      },
      {
        "name": "Tomato Sauce",
        "quantity": 50,
        "unit": "g",
        "calories": 30,
        "protein": 1,
        "carbs": 6,
        "fat": 0
      },
      {
        "name": "Bell Peppers",
        "quantity": 30,
        "unit": "g",
        "calories": 10,
        "protein": 0.5,
        "carbs": 2,
        "fat": 0
      }
    ],
    "total_calories": 440,
    "total_protein": 21.5,
    "total_carbs": 55,
    "total_fat": 13
  },
  "explanation": "This optimized veggie pizza retains your original dough and mozzarella, adding tomato sauce and bell peppers for a complete, balanced lunch. It meets your high-protein goal and avoids your nut allergy, with macros within 5% of your targets."
}

**Strict Instructions for Output**:
- Your response MUST be a JSON object with ONLY these exact two top-level properties: "adjustedMeal" and "explanation".
- The \`adjustedMeal\` object MUST contain ONLY these properties: "name", "customName" (if provided in input, else empty string or omitted), "ingredients", "total_calories", "total_protein", "total_carbs", "total_fat".
- The \`ingredients\` array objects MUST contain ONLY these properties: "name", "quantity" (number), "unit" (string), "calories" (number), "protein" (number), "carbs" (number), "fat" (number).
- The \`explanation\` property MUST be a string (max 100 words) explaining why the meal is optimized for the user’s profile, goals, and meal context.
- If ingredients are provided, retain all original ingredients and adjust their quantities; add complementary ingredients only if needed to complete the meal and meet macros.
- If no ingredients are provided, generate a new meal with 2–5 ingredients tailored to the user’s profile and meal type.
- Ensure \`total_calories\`, \`total_protein\`, \`total_carbs\`, and \`total_fat\` are within 5% of the target macros and match the sum of ingredient values.
- Use precise nutritional data (e.g., USDA database) for all ingredients.
- Strictly avoid allergies and dispreferred ingredients; prioritize preferred ingredients and cuisines.
- Ensure the meal is practical, edible, and appropriate for the meal type (e.g., no heavy meals for breakfast).
- Use numerical values for \`quantity\`, \`calories\`, \`protein\`, \`carbs\`, and \`fat\` (no strings for numbers).
- Do NOT add extra fields, properties, keys, or markdown formatting.
- If no suitable meal can be generated within constraints, return an empty \`ingredients\` array with an explanation like: "Unable to optimize meal within constraints due to allergies or macro targets."

Respond ONLY with the pure JSON object matching the following TypeScript type:
{ adjustedMeal: { name: string; customName?: string; ingredients: { name: string; quantity: number; unit: string; calories: number; protein: number; carbs: number; fat: number; }[]; total_calories: number; total_protein: number; total_carbs: number; total_fat: number; }; explanation: string; }`,
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
