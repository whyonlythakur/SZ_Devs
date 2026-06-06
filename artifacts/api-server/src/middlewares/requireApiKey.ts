import { type Request, type Response, type NextFunction } from "express";

/**
 * Middleware that requires a valid DASHBOARD_API_KEY in the Authorization header.
 * Usage: Authorization: Bearer <DASHBOARD_API_KEY>
 *
 * Set DASHBOARD_API_KEY as a Replit secret. Any request missing or presenting
 * a wrong key receives 401 before reaching the route handler.
 */
export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = process.env.DASHBOARD_API_KEY;

  if (!apiKey) {
    res.status(500).json({ ok: false, error: "Server misconfiguration: DASHBOARD_API_KEY is not set" });
    return;
  }

  const authHeader = req.headers.authorization ?? "";
  const provided = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : "";

  if (!provided || provided !== apiKey) {
    res.status(401).json({ ok: false, error: "Unauthorized: valid API key required" });
    return;
  }

  next();
}
