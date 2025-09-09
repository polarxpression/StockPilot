import { z } from "zod";

export const cartridgeSchema = z.object({
  brand: z.string().min(2, {
    message: "Brand must be at least 2 characters.",
  }),
  model: z.string().min(2, {
    message: "Model must be at least 2 characters.",
  }),
  color: z.string().min(2, {
    message: "Color must be at least 2 characters.",
  }),
  stock: z.coerce.number().int().min(0, {
    message: "Stock must be a non-negative number.",
  }),
  reorderThreshold: z.coerce.number().int().min(1, {
    message: "Threshold must be at least 1.",
  }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});
