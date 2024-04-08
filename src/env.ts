import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
  API_BASE_URL: z.string().url().min(1),
  PORT: z.coerce.number().optional(),
})

export const env = envSchema.parse(process.env)
