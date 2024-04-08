// src/env.ts
import { z } from "zod";
var envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
  API_BASE_URL: z.string().url().min(1),
  PORT: z.coerce.number().optional()
});
var env = envSchema.parse(process.env);

export {
  env
};
