// src/ai/flows/generate-restock-alerts.ts
'use server';
/**
 * @fileOverview An AI-powered tool that analyzes historical cartridge usage data,
 * predicts potential stockouts, and suggests the optimal time of day to receive these alerts.
 *
 * - generateRestockAlerts - A function that generates restock alerts based on historical data.
 * - GenerateRestockAlertsInput - The input type for the generateRestockAlerts function.
 * - GenerateRestockAlertsOutput - The return type for the generateRestockAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRestockAlertsInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical data of cartridge usage, including cartridge type and usage date.'
    ),
  reorderThresholds: z
    .string()
    .describe(
      'Reorder thresholds for each cartridge type, including cartridge type and reorder point.'
    ),
});
export type GenerateRestockAlertsInput = z.infer<
  typeof GenerateRestockAlertsInputSchema
>;

const GenerateRestockAlertsOutputSchema = z.object({
  alerts: z
    .string()
    .describe(
      'A report listing all cartridges that are below their reorder threshold, including suggested reorder quantities and optimal alert time.'
    ),
});
export type GenerateRestockAlertsOutput = z.infer<
  typeof GenerateRestockAlertsOutputSchema
>;

export async function generateRestockAlerts(
  input: GenerateRestockAlertsInput
): Promise<GenerateRestockAlertsOutput> {
  return generateRestockAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRestockAlertsPrompt',
  input: {schema: GenerateRestockAlertsInputSchema},
  output: {schema: GenerateRestockAlertsOutputSchema},
  prompt: `You are an AI-powered stock management tool.

  Analyze the historical cartridge usage data and reorder thresholds provided to predict potential stockouts before thresholds are reached. Suggest the optimal time of day to receive these alerts based on usage patterns.

  Historical Data: {{{historicalData}}}
  Reorder Thresholds: {{{reorderThresholds}}}

  Based on this data, generate a restock alert report.
  The report should include:
  - Cartridge types that are predicted to fall below their reorder threshold.
  - Suggested reorder quantities for each cartridge type.
  - The optimal time of day to receive the alerts to proactively manage inventory and avoid disruptions.
`,
});

const generateRestockAlertsFlow = ai.defineFlow(
  {
    name: 'generateRestockAlertsFlow',
    inputSchema: GenerateRestockAlertsInputSchema,
    outputSchema: GenerateRestockAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
