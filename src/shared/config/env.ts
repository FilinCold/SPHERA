import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

type PublicEnv = z.infer<typeof publicEnvSchema>;

let cachedEnv: PublicEnv | null = null;

export const getPublicEnv = (): PublicEnv => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!parsed.success) {
    const issues = parsed?.error;

    throw new Error(
      `Invalid public environment configuration. Please review your .env file. Details: ${issues}`,
    );
  }

  cachedEnv = Object.freeze(parsed.data) as PublicEnv;
  return cachedEnv;
};

export type AppEnv = PublicEnv["NEXT_PUBLIC_APP_ENV"];
