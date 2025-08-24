/* Centralized logger (can be replaced with Winston/Pino if needed) */
export const logger = {
  info: (msg: string, ...args: unknown[]) => {
    console.log(`ℹ️  ${msg}`, ...args);
  },
  warn: (msg: string, ...args: unknown[]) => {
    console.warn(`⚠️  ${msg}`, ...args);
  },
  error: (msg: string, ...args: unknown[]) => {
    console.error(`❌ ${msg}`, ...args);
  },
  debug: (msg: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`🐛 ${msg}`, ...args);
    }
  },
};
