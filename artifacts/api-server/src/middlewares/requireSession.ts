import { type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";

/**
 * Middleware that verifies the HMAC-signed session token issued by /api/auth/discord/callback.
 * Attaches the decoded user payload to req.staffUser.
 */
export async function requireSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!token) {
    res.status(401).json({ ok: false, error: "Unauthorized: no session token" });
    return;
  }

  const secret = process.env.DASHBOARD_API_KEY ?? "changeme";
  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) {
    res.status(401).json({ ok: false, error: "Unauthorized: malformed token" });
    return;
  }

  const payloadB64 = token.slice(0, dotIdx);
  const sig        = token.slice(dotIdx + 1);
  const expected   = crypto.createHmac("sha256", secret).update(payloadB64).digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) {
    res.status(401).json({ ok: false, error: "Unauthorized: invalid token signature" });
    return;
  }

  let payload: any;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    res.status(401).json({ ok: false, error: "Unauthorized: malformed token payload" });
    return;
  }

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    res.status(401).json({ ok: false, error: "Unauthorized: session expired" });
    return;
  }

  (req as any).staffUser = payload;
  next();
}
