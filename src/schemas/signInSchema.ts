import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(), // Isme hum email ya username dono accept kar rahe hain
  password: z.string(),
});