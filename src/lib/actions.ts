"use server";

import {
  generateRestockAlerts,
  type GenerateRestockAlertsInput,
} from "@/ai/flows/generate-restock-alerts";

export async function runGenerateRestockAlerts(
  input: GenerateRestockAlertsInput
) {
  try {
    const result = await generateRestockAlerts(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      error: `Failed to generate report: ${errorMessage}`,
    };
  }
}
