import { Response } from "express";

type Data = Record<string, any> | any[] | string | number | null;

export function ok(res: Response, data: Data = null, extra: Record<string, any> = {}) {
  return res.status(200).json({ success: true, data, ...extra });
}

export function created(res: Response, data: Data = null, extra: Record<string, any> = {}) {
  return res.status(201).json({ success: true, data, ...extra });
}

export function badRequest(res: Response, message = "Bad Request", extra: Record<string, any> = {}) {
  return res.status(400).json({ success: false, error: message, ...extra });
}

export function unauthorized(res: Response, message = "Unauthorized") {
  return res.status(401).json({ success: false, error: message });
}

export function forbidden(res: Response, message = "Forbidden") {
  return res.status(403).json({ success: false, error: message });
}

export function notFound(res: Response, message = "Not Found") {
  return res.status(404).json({ success: false, error: message });
}

export function serverError(res: Response, message = "Internal Server Error") {
  return res.status(500).json({ success: false, error: message });
}
