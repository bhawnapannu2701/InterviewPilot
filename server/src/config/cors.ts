import { env } from "./env";

/**
 * Parse CORS_ORIGIN which may be a comma-separated list.
 * Examples:
 *  - "http://localhost:5173"
 *  - "http://localhost:5173,https://your-app.vercel.app"
 */
function parseOrigins(raw: string): string[] {
  return raw
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Returns an origin value or function for Express CORS middleware.
 * - Allows exact matches from CORS_ORIGIN
 * - Always allows undefined origin (like curl/Postman) to ease testing
 * - In dev, also allows http://localhost:5173 and http://127.0.0.1:5173 if not listed
 */
export function setupCors() {
  const allowed = new Set(parseOrigins(env().CORS_ORIGIN));

  // Helpful dev fallbacks
  if (env().NODE_ENV === "development") {
    allowed.add("http://localhost:5173");
    allowed.add("http://127.0.0.1:5173");
  }

  return (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      // non-browser tools / same-origin
      return cb(null, true);
    }
    if (allowed.has(origin)) {
      return cb(null, true);
    }
    // Some browsers may send trailing slashes or different ports accidentally; we keep it strict for safety.
    cb(new Error(`CORS blocked for origin: ${origin}`));
  };
}
