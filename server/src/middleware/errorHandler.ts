import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

interface AppError extends Error {
  status?: number;
}

/**
 * Centralized error handling middleware
 */
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status || 500;
  const message =
    status === 500 ? "Internal Server Error" : err.message || "Unexpected Error";

  // Log full error for debugging
  logger.error(`Error ${status}: ${err.message}`, err);

  res.status(status).json({
    success: false,
    error: message,
  });
}
