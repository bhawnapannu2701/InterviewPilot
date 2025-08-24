import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User";
import { env } from "../config/env";

const router = Router();

const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

function signToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, env().JWT_SECRET, { expiresIn: "7d" });
}

function setAuthCookie(res: any, token: string) {
  const isProd = env().NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * POST /api/v1/auth/signup
 */
router.post("/signup", async (req, res, next) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten() });
    }
    const { name, email, password } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = signToken({ id: user._id.toString(), email: user.email });
    setAuthCookie(res, token);

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/auth/login
 */
router.post("/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = signToken({ id: user._id.toString(), email: user.email });
    setAuthCookie(res, token);

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/auth/logout
 */
router.post("/logout", (req, res) => {
  const isProd = env().NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.json({ success: true });
});

/**
 * GET /api/v1/auth/me
 * Returns the logged-in user's profile if the JWT cookie is valid.
 */
router.get("/me", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(200).json({ success: true, user: null });

  try {
    const decoded = jwt.verify(token, env().JWT_SECRET) as { id: string; email: string };
    const user = await User.findById(decoded.id).select("_id name email");
    return res.json({ success: true, user });
  } catch {
    return res.status(200).json({ success: true, user: null });
  }
});

export default router;
