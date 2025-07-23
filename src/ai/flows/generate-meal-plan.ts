'use server';

import { geminiModel, indexPdfFlow, pdfRetriver } from '@/ai/genkit';
import {
  GeneratePersonalizedMealPlanInputSchema,
  GeneratePersonalizedMealPlanOutputSchema,
  type GeneratePersonalizedMealPlanInput,
  type GeneratePersonalizedMealPlanOutput,
} from '@/lib/schemas';
import { getAIApiErrorMessage } from '@/lib/utils';
import path from 'path';
import z from 'zod';
import fs from 'fs';
import os from 'os';

export async function generatePersonalizedMealPlan(
  input: GeneratePersonalizedMealPlanInput
): Promise<GeneratePersonalizedMealPlanOutput> {
  return generatePersonalizedMealPlanFlow(input);
}

// Enhanced prompt that includes RAG context
export const prompt = geminiModel.definePrompt({
  name: 'generatePersonalizedMealPlanPrompt',
  input: {
    schema: GeneratePersonalizedMealPlanInputSchema.extend({
      nutritionalContext: z.string().optional(),
      sources: z
        .array(
          z.object({
            content: z.string(),
            metadata: z.record(z.any()),
          })
        )
        .optional(),
    }),
  },
  output: { schema: GeneratePersonalizedMealPlanOutputSchema },
  prompt: `You are NutriMind, an elite AI nutritionist responsible for generating a complete and highly personalized 7-day meal plan. Your output must be a single, perfect JSON object, as it will be directly consumed by an application.

{{#if nutritionalContext}}
**[Additional Nutritional Knowledge Base]**
Use the following evidence-based nutritional information to enhance your meal planning decisions:

{{nutritionalContext}}

{{#if sources}}
**Sources Referenced:**
{{#each sources}}
- {{this.metadata.fileName}} (Chunk {{this.metadata.chunkIndex}})
{{/each}}
{{/if}}

This information should guide your ingredient selection, portion sizing, and nutritional balance recommendations.
{{/if}}

**[Step 1] Analyze User Context**
Meticulously analyze the following user data. This is the foundation for the meal plan.

**User Data & Nutritional Goals (JSON Input):**
\`\`\`json
{
  // User Profile & Preferences
  "age": {{age}},
  "biological_sex": "{{biological_sex}}",
  "height_cm": {{height_cm}},
  "current_weight_kg": {{current_weight_kg}},
  "primary_diet_goal": "{{primary_diet_goal}}",
  "physical_activity_level": "{{physical_activity_level}}",
  "preferred_diet": "{{preferred_diet}}",
  "allergies": [{{#if allergies.length}}"{{#each allergies}}{{this}}", "{{/each}}"{{/if}}],
  "preferred_cuisines": [{{#if preferred_cuisines.length}}"{{#each preferred_cuisines}}{{this}}", "{{/each}}"{{/if}}],
  "dispreferrred_cuisines": [{{#if dispreferrred_cuisines.length}}"{{#each dispreferrred_cuisines}}{{this}}", "{{/each}}"{{/if}}],
  "preferred_ingredients": [{{#if preferred_ingredients.length}}"{{#each preferred_ingredients}}{{this}}", "{{/each}}"{{/if}}],
  "dispreferrred_ingredients": [{{#if dispreferrred_ingredients.length}}"{{#each dispreferrred_ingredients}}{{this}}", "{{/each}}"{{/if}}],
  "medical_conditions": [{{#if medical_conditions.length}}"{{#each medical_conditions}}{{this}}", "{{/each}}"{{/if}}],
  "preferred_micronutrients": [{{#if preferred_micronutrients.length}}"{{#each preferred_micronutrients}}{{this}}", "{{/each}}"{{/if}}],

  // Daily Nutritional Targets (Use these exact values for each day)
  "target_daily_calories": {{meal_data.target_daily_calories}},
  "target_protein_g": {{meal_data.target_protein_g}},
  "target_carbs_g": {{meal_data.target_carbs_g}},
  "target_fat_g": {{meal_data.target_fat_g}}
}
\`\`\`

**[Step 2] Generate the 7-Day Meal Plan**
Create a comprehensive 7-day meal plan from Monday to Sunday. Adhere strictly to the following rules:

🧠 **CRITICAL GENERATION RULES:**
1.  **Full 7-Day Plan:** You MUST generate a complete plan for all seven days of the week (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday). Do not stop after one day.
2.  **Six Meals Per Day:** Each day MUST consist of exactly six meals: "Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Dinner", and "Evening Snack".
3.  **Adhere to Daily Targets:** The sum of calories, protein, carbs, and fat for the six meals of any given day must closely match the \`target_daily_calories\`, \`target_protein_g\`, \`target_carbs_g\`, and \`target_fat_g\` provided in the context above.
4.  **Variety and Creativity:** Ensure variety across the week. Avoid repeating meals. All meals must be complete recipes, not single ingredients (e.g., use "Grilled Chicken Salad with Lemon Vinaigrette" instead of just "Chicken Breast").
5.  **Meal Appropriateness:** Ensure meals are logical for their time slot. Breakfast should be a breakfast-style meal, and snacks should be lighter than main meals.
6.  **Respect All Preferences:** The plan must strictly avoid all allergies and disliked ingredients/cuisines, while prioritizing preferred ones.
{{#if nutritionalContext}}
7.  **Evidence-Based Recommendations:** Incorporate the nutritional knowledge from the provided context to make scientifically-informed decisions about ingredient combinations, cooking methods, and nutritional optimization.
{{/if}}

**[Step 3] Construct the Final JSON**
Assemble the final output as a single, valid JSON object. The structure MUST be exactly as follows.

**Strict JSON Output Format:**
\`\`\`json
{
  "days": [
    {
      "day_of_week": "Monday",
      "meals": [
        {
          "meal_name": "Breakfast",
          "custom_name": "Scrambled Eggs with Spinach and Whole-Wheat Toast",
          "ingredients": [
            { "name": "Eggs", "quantity": 150, "unit": "g", "calories": 155, "protein": 13, "carbs": 1.1, "fat": 11 },
            { "name": "Spinach", "quantity": 50, "unit": "g", "calories": 23, "protein": 2.9, "carbs": 3.6, "fat": 0.4 },
            { "name": "Whole-Wheat Bread", "quantity": 60, "unit": "g", "calories": 247, "protein": 13, "carbs": 41, "fat": 3.2 }
          ],
          "total_calories": 450,
          "total_protein": 30,
          "total_carbs": 40,
          "total_fat": 20
        },
        // ... (Morning Snack, Lunch, Afternoon Snack, Dinner, Evening Snack for Monday)
      ]
    },
    {
      "day_of_week": "Tuesday",
      "meals": [
        // ... (6 meal objects for Tuesday)
      ]
    },
    // ... (Continue for Wednesday, Thursday, Friday, Saturday, Sunday)
  ],
  "weekly_summary": {
    "total_calories": 17500,
    "total_protein": 1400,
    "total_carbs": 1575,
    "total_fat": 622
  }
}
\`\`\`

⚠️ **FINAL VALIDATION CHECK:**
Before responding, double-check your entire output.
- Does the \`days\` array contain exactly 7 objects?
- Does each day object contain exactly 6 meal objects?
- Are all daily and weekly totals calculated correctly based on the ingredients?
- Is the entire response a single JSON object with no extra text, comments, or markdown?

Respond ONLY with the pure, complete JSON object.
`,
});

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

function getTempDir() {
  if (process.env.VERCEL) {
    return '/tmp';
  }
  return os.tmpdir();
}

async function downloadPdf(url: string, localPath: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Ensure directory exists
  const dir = path.dirname(localPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(localPath, buffer);
}

async function initializePDFs() {
  if (isInitialized) return;

  // Prevent multiple simultaneous initializations
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    console.log('Initializing nutrition PDFs...');

    const tempDir = path.join(getTempDir(), 'pdfs');

    if (fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (error) {
        console.warn('Could not clean up temp directory:', error);
      }
    }

    try {
      fs.mkdirSync(tempDir, { recursive: true });
    } catch (error: any) {
      throw new Error(`Cannot create temp directory: ${error.message}`);
    }

    // Process only a subset of PDFs to avoid rate limiting
    const pdfBatches = [[1, 2, 3, 4, 5, 6]];

    for (const batch of pdfBatches) {
      console.log(`Processing batch: ${batch.join(', ')}`);

      for (const i of batch) {
        const url = `https://ptswwleyrtvkfejddmzr.supabase.co/storage/v1/object/public/pdf-files/${i}.pdf`;
        const localPath = path.join(tempDir, `${i}.pdf`);

        try {
          await downloadPdf(url, localPath);

          await indexPdfFlow({
            filePath: localPath,
            metadata: {
              fileName: `${i}.pdf`,
              type: 'nutrition-guide',
              indexed_at: new Date().toISOString(),
              originalUrl: url,
            },
          });

          console.log(`✓ Successfully processed: ${i}.pdf`);

          // Clean up temp file immediately
          try {
            fs.unlinkSync(localPath);
          } catch (unlinkError) {
            console.warn(
              `Could not delete temp file ${localPath}:`,
              unlinkError
            );
          }
        } catch (error: any) {
          console.warn(`⚠ Failed to process ${i}.pdf:`, error.message);

          // Clean up temp file on error too
          try {
            if (fs.existsSync(localPath)) {
              fs.unlinkSync(localPath);
            }
          } catch (unlinkError) {
            console.warn(
              `Could not delete temp file ${localPath}:`,
              unlinkError
            );
          }

          // If it's a rate limit error, break and wait
          if (
            error.message.includes('429') ||
            error.message.includes('Too Many Requests')
          ) {
            console.log('Rate limit hit, stopping batch processing...');
            break;
          }
        }
      }

      // Wait between batches to avoid rate limiting
      if (batch !== pdfBatches[pdfBatches.length - 1]) {
        console.log('Waiting 2 minutes before next batch...');
        await new Promise((resolve) => setTimeout(resolve, 120000)); // 2 minutes
      }
    }

    isInitialized = true;
    console.log('PDF initialization complete!');
  })();

  return initializationPromise;
}

const generatePersonalizedMealPlanFlow = geminiModel.defineFlow(
  {
    name: 'generatePersonalizedMealPlanFlow',
    inputSchema: GeneratePersonalizedMealPlanInputSchema,
    outputSchema: GeneratePersonalizedMealPlanOutputSchema,
  },
  async (
    input: GeneratePersonalizedMealPlanInput
  ): Promise<GeneratePersonalizedMealPlanOutput> => {
    try {
      // Try to initialize PDFs, but don't fail if it doesn't work
      try {
        await initializePDFs();
      } catch (initError: any) {
        console.warn(
          'PDF initialization failed, continuing without RAG context:',
          initError.message
        );
      }

      // Step 1: Retrieve relevant nutritional context based on user profile
      const { nutritionalContext, sources } = await retrieveNutritionalContext(
        input
      );

      console.log('✅', nutritionalContext);
      console.log('✅', sources);

      // Step 2: Generate meal plan with enhanced nutritional context
      const { output } = await prompt({
        ...input,
        nutritionalContext,
        sources,
      });

      console.log('🗿🗿', output);

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
      console.error('Error in generatePersonalizedMealPlanFlow:', error);
      throw new Error(getAIApiErrorMessage(error));
    }
  }
);

// Helper function to retrieve nutritional context based on user profile
async function retrieveNutritionalContext(
  input: GeneratePersonalizedMealPlanInput
): Promise<{
  nutritionalContext: string;
  sources: any[];
}> {
  try {
    const searchQueries: string[] = [];

    // Build search queries based on user profile data
    searchQueries.push(`${input.primary_diet_goal} nutrition requirements`);
    searchQueries.push(`${input.preferred_diet} diet guidelines`);

    if (input.physical_activity_level) {
      searchQueries.push(`${input.physical_activity_level} activity nutrition`);
    }

    // Add medical condition specific searches
    if (input.medical_conditions && input.medical_conditions.length > 0) {
      input.medical_conditions.forEach((condition) => {
        searchQueries.push(`${condition} dietary guidelines nutrition`);
      });
    }

    // Add micronutrient specific searches
    if (
      input.preferred_micronutrients &&
      input.preferred_micronutrients.length > 0
    ) {
      input.preferred_micronutrients.forEach((nutrient) => {
        searchQueries.push(`${nutrient} food sources requirements`);
      });
    }

    // Add cuisine-specific nutrition info
    if (input.preferred_cuisines && input.preferred_cuisines.length > 0) {
      input.preferred_cuisines.slice(0, 2).forEach((cuisine) => {
        searchQueries.push(`${cuisine} cuisine nutritional profile`);
      });
    }

    // Retrieve relevant context from PDF documents
    let nutritionalContext = '';
    const allSources: any[] = [];
    const seenContent = new Set<string>(); // Prevent duplicate content

    // Increase the number of queries processed (was 3, now 5)
    const limitedQueries = searchQueries.slice(0, 5);

    for (const query of limitedQueries) {
      try {
        // Significantly increase k value to get more chunks per query
        const docs = await geminiModel.retrieve({
          retriever: pdfRetriver,
          query: query,
          options: {
            k: 15, // Increased from 1 to 15 chunks per query
          },
        });

        if (docs.length > 0) {
          nutritionalContext += `\n\n**Nutritional Context for ${query}:**\n`;

          // Filter out duplicate content and add unique chunks
          const uniqueDocs = docs.filter((doc) => {
            const contentHash = doc.text.substring(0, 100); // Use first 100 chars as hash
            if (seenContent.has(contentHash)) return false;

            seenContent.add(contentHash);
            return true;
          });

          nutritionalContext += uniqueDocs
            .map((doc, idx) => `[Reference ${idx + 1}]: ${doc.text}`)
            .join('\n\n');

          allSources.push(
            ...uniqueDocs.map((doc) => ({
              content: doc.text.substring(0, 300) + '...', // Show more content preview
              metadata: doc.metadata,
              score: doc.metadata?.score,
            }))
          );
        }
      } catch (retrievalError: any) {
        console.warn(
          `Failed to retrieve context for query "${query}":`,
          retrievalError.message
        );
        // Continue with other queries
      }

      // Add small delay between queries to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`Retrieved ${allSources.length} unique sources`);
    console.log(`Context length: ${nutritionalContext.length} characters`);

    return {
      nutritionalContext: nutritionalContext.trim(),
      sources: allSources,
    };
  } catch (error: any) {
    console.warn('Failed to retrieve nutritional context:', error.message);
    return {
      nutritionalContext: '',
      sources: [],
    };
  }
}

process.on('exit', () => {
  const tempDir = path.join(getTempDir(), 'pdfs');
  if (fs.existsSync(tempDir)) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
});
