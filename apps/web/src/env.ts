import { z } from 'zod';

/**
 * Boundary validation for environment variables (12-factor III).
 *
 * Validates `process.env` once at module load. Server vars live on `env`,
 * client-exposed vars (must start with `NEXT_PUBLIC_`) live on `clientEnv`.
 *
 * Keep this file small. If it grows past ~30 lines, the project probably
 * has too many env vars — group them in feature-specific config modules.
 */

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url().optional(),
  // Free Stats NZ Aotearoa Data Explorer subscription key
  // (https://portal.apis.stats.govt.nz). Optional: keyless access covers the
  // dataflow catalogue and AGR_* tables as CSV; the key unlocks codelists,
  // jsondata, and the remaining tables. Server-only, never expose to the client.
  STATS_NZ_SUBSCRIPTION_KEY: z.string().optional(),
  // DigitalNZ (National Library) v3 API key (https://api.digitalnz.org/v3).
  // Optional: the search endpoint answers keyless; the key raises the rate
  // limit. Server-only, never expose to the client.
  DIGITAL_NZ_API_KEY: z.string().optional(),
});

const clientSchema = z.object({
  // Unused today; kept for future metadata/OG tags. Defaulted so local and
  // CI builds without the var still pass; the Pages deploy sets the real URL.
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

export const env = serverSchema.parse(process.env);

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
