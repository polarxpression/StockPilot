import { z } from "zod";

export const cartridgeSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  model: z.string().min(2, {
    message: "Model must be at least 2 characters.",
  }),
  stock: z.coerce.number().int().min(0, {
    message: "Stock must be a non-negative number.",
  }),
  reorderThreshold: z.coerce.number().int().min(0, {
    message: "Threshold must be a non-negative number.",
  }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});
