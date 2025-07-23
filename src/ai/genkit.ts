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

//open-ai
export const openaiModel = genkit({
  plugins: [
    openAI({ apiKey: process.env.OPENAI_API_KEY }),
    devLocalVectorstore([
      {
        indexName: 'pdfRAG',
        embedder: googleAI.embedder('gemini-embedding-001'),
      },
    ]),
  ],
  model: gpt4,
});

export const geminiModel = genkit({
  plugins: [
    googleAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY }),

    devLocalVectorstore([
      {
        indexName: 'pdfRAG',
        embedder: googleAI.embedder('gemini-embedding-001'),
      },
    ]),
  ],
  model: googleAI.model('gemini-2.0-flash'),
});

export const pdfIndexer = devLocalIndexerRef('pdfRAG');
export const pdfRetriver = devLocalRetrieverRef('pdfRAG');

export const chunkingConfig = {
  minLength: 1000,
  maxLength: 2000,
  splitter: 'sentence',
  overlap: 100,
  delimiters: '',
} as any;

export async function extractTextFromPdf(filePath: string) {
  const pdfFile = path.resolve(filePath);
  const dataBuffer = await readFile(pdfFile);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Flow to index a single PDF file
export const indexPdfFlow = openaiModel.defineFlow(
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
    const pdfText = await openaiModel.run('extract-text', () =>
      extractTextFromPdf(filePath)
    );

    const chunks = await openaiModel.run('chunk-text', async () =>
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

    await openaiModel.index({
      indexer: pdfIndexer,
      documents,
    });

    return {
      documentsIndexed: documents.length,
      chunks: chunks.length,
    };
  }
);

//Flow to index muliple PDfs from directory
export const indexPdfDirectoryFlow = openaiModel.defineFlow(
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
      const result = await indexPdfFlow({
        filePath,
        metadata: {
          fileName: path.basename(filePath),
          directory: path.dirname(filePath),
        },
      });
      totalDocuments += result.documentsIndexed;
    }

    return {
      filesProcessed: pdfFiles.length,
      totalDocuments,
    };
  }
);

export const pdfMainFlow = openaiModel.defineFlow(
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
    const docs = await openaiModel.retrieve({
      retriever: pdfRetriver,
      query: question,
      options: { k: maxResults },
    });

    const { text } = await openaiModel.generate({
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
      answer: text, // Fixed typo from 'asnwer'
      sources: docs.map((doc) => ({
        content: doc.text.substring(0, 200) + '...',
        metadata: doc.metadata,
        score: doc.metadata?.score,
      })),
    };
  }
);
