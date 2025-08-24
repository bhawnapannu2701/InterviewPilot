// server/src/config/env.ts
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { z } from "zod";

// Always load .env from the server root (works for ts-node-dev and dist)
const ROOT = path.resolve(__dirname, "..", ".."); // -> server/
const ENV_PATH = path.join(ROOT, ".env");

if (fs.existsSync(ENV_PATH)) {
  dotenv.config({ path: ENV_PATH });
} else {
  dotenv.config(); // fallback
}

// Validate env
const Schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  CORS_ORIGIN: z.string().min(1, "Required"),
  JWT_SECRET: z.string().min(1, "Required"),
  MONGO_URI: z.string().min(1, "Required"),
  OPENAI_API_KEY: z.string().min(1, "Required"),
});

const parsed = Schema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ");
  throw new Error(`Invalid environment configuration: ${issues}`);
}

// Export both styles so all imports work
export const ENV = parsed.data;
export function env() { return ENV; }
export default env;
