import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

/**
 * Middleware to enforce JWT authentication.
 * - Reads token from HttpOnly cookie "token"
 * - Verifies it with JWT_SECRET
 * - Attaches decoded payload to req.user
 */
export function authRequired(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, env().JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}
