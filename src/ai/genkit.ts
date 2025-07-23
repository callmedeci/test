import { Document, genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import openAI, { gpt4 } from 'genkitx-openai';

import {
  devLocalIndexerRef,
  devLocalRetrieverRef,
  devLocalVectorstore,
} from '@genkit-ai/dev-local-vectorstore';
import path from 'path';
import { readFile } from 'fs/promises';
import pdf from 'pdf-parse';

import { chunk } from 'llm-chunk';

// Set working directory to /tmp for serverless environments
if (process.env.VERCEL) {
  process.chdir('/tmp');
}

const vectorStoreConfig = {
  indexName: 'pdfRAG',
  embedder: googleAI.embedder('text-embedding-004'),
};

//open-ai
export const openaiModel = genkit({
  plugins: [
    openAI({ apiKey: process.env.OPENAI_API_KEY }),
    devLocalVectorstore([vectorStoreConfig]),
  ],
  model: gpt4,
});

export const geminiModel = genkit({
  plugins: [
    googleAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY }),
    devLocalVectorstore([vectorStoreConfig]),
  ],
  model: googleAI.model('gemini-2.0-flash'),
});

export const pdfIndexer = devLocalIndexerRef('pdfRAG');
export const pdfRetriver = devLocalRetrieverRef('pdfRAG');

export const chunkingConfig = {
  minLength: 600,
  maxLength: 1500,
  splitter: 'sentence',
  overlap: 150,
  delimiters: '',
} as any;

// Rate limiting utility
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 50, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();

    // Remove old requests outside the time window
    this.requests = this.requests.filter(
      (time) => now - time < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest) + 1000; // Add 1s buffer
      console.log(`Rate limit reached, waiting ${waitTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.waitIfNeeded(); // Recursive call to check again
    }

    this.requests.push(now);
  }
}

const embedRateLimiter = new RateLimiter(50, 60000);

export async function extractTextFromPdf(filePath: string) {
  const pdfFile = path.resolve(filePath);
  const dataBuffer = await readFile(pdfFile);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Flow to index a single PDF file with rate limiting
export const indexPdfFlow = geminiModel.defineFlow(
  {
    name: 'indexPdf',
    inputSchema: z.object({
      filePath: z.string().describe('PDF file path'),
      metadata: z.record(z.any().optional()),
    }),
    outputSchema: z.object({
      documentsIndexed: z.number(),
      chunks: z.number(),
    }),
  },
  async ({ filePath, metadata = {} }) => {
    try {
      const pdfText = await geminiModel.run('extract-text', () =>
        extractTextFromPdf(filePath)
      );

      const chunks = await geminiModel.run('chunk-text', async () =>
        chunk(pdfText, chunkingConfig)
      );

      const documents = chunks.map((text, index) => {
        return Document.fromText(text, {
          filePath,
          chunkIndex: index,
          totalChunk: chunks.length,
          ...metadata,
        });
      });

      // Rate limit before indexing (which involves embedding)
      await embedRateLimiter.waitIfNeeded();

      await geminiModel.index({
        indexer: pdfIndexer,
        documents,
      });

      return {
        documentsIndexed: documents.length,
        chunks: chunks.length,
      };
    } catch (error: any) {
      if (error.status === 429) {
        console.log('Rate limited, waiting 2 minutes before retry...');
        await new Promise((resolve) => setTimeout(resolve, 120000)); // Wait 2 minutes
        return indexPdfFlow({ filePath, metadata }); // Retry
      }
      throw error;
    }
  }
);

//Flow to index muliple PDfs from directory
export const indexPdfDirectoryFlow = geminiModel.defineFlow(
  {
    name: 'indexPdfDirectory',
    inputSchema: z.object({
      directoryPath: z.string().describe('directory path file path'),
      filePattern: z.string().optional().default('**/*.pdf'),
    }),
    outputSchema: z.object({
      filesProcessed: z.number(),
      totalDocuments: z.number(),
    }),
  },
  async ({ directoryPath, filePattern }) => {
    const glob = await import('glob');

    const pdfFiles = glob.sync(path.join(directoryPath, filePattern));

    let totalDocuments = 0;

    // Process files sequentially to avoid overwhelming the system
    for (const filePath of pdfFiles) {
      try {
        const result = await indexPdfFlow({
          filePath,
          metadata: {
            fileName: path.basename(filePath),
            directory: path.dirname(filePath),
          },
        });
        totalDocuments += result.documentsIndexed;

        // Add delay between files to prevent rate limiting
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
      } catch (error: any) {
        console.error(`Failed to process ${filePath}:`, error.message);
      }
    }

    return {
      filesProcessed: pdfFiles.length,
      totalDocuments,
    };
  }
);

export const pdfMainFlow = geminiModel.defineFlow(
  {
    name: 'pdfMainFlow',
    inputSchema: z.object({
      question: z.string().describe('User question'),
      maxResults: z.number().optional().default(5),
      temperature: z.number().optional().default(0.3),
    }),
    outputSchema: z.object({
      answer: z.string(),
      sources: z.array(
        z.object({
          content: z.string(),
          metadata: z.record(z.any()).optional(),
          score: z.number().optional(),
        })
      ),
    }),
  },
  async ({ question, maxResults, temperature }) => {
    // Rate limit before retrieval (which involves embedding)
    await embedRateLimiter.waitIfNeeded();

    const docs = await geminiModel.retrieve({
      retriever: pdfRetriver,
      query: question,
      options: { k: maxResults },
    });

    const { text } = await geminiModel.generate({
      prompt: `
    You are a helpful AI assistant that answers questions based on the provided document context.
    Use only the information from the provided documents to answer the question.
    If you cannot find the answer in the provided context, say so clearly.
    Always cite which documents or sources you're referencing when possible.

    Context Documents: ${docs
      .map((doc, idx) => `[Document ${idx + 1}]: ${doc.text}`)
      .join('\n\n')}

    Question: ${question}

    Please provide a comprehensive answer based on the context above.`,
      config: {
        temperature,
      },
    });

    return {
      answer: text,
      sources: docs.map((doc) => ({
        content: doc.text.substring(0, 200) + '...',
        metadata: doc.metadata,
        score: doc.metadata?.score,
      })),
    };
  }
);
