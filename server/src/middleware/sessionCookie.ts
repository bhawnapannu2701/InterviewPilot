import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

/**
 * Middleware to ensure every user has a session cookie.
 * This is separate from auth login; it's for anonymous tracking of mock sessions.
 */
export function sessionCookie(req: Request, res: Response, next: NextFunction) {
  const cookieName = "session_id";
  let sessionId = req.signedCookies?.[cookieName];

  if (!sessionId) {
    sessionId = randomUUID();
    res.cookie(cookieName, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  }

  // attach to request for downstream handlers
  (req as any).sessionId = sessionId;
  next();
}
