import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
  PORT: z.string(),
});

export const env = envSchema.parse(process.env);
