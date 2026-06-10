import { Router } from "express";
import { requireApiKey } from "../middlewares/requireApiKey";

const router = Router();

/**
 * POST /api/auth/login
 * Body: { key: string }
 * Returns the key back as a token if it matches DASHBOARD_API_KEY.
 */
router.post("/auth/login", (req, res) => {
  const apiKey = process.env.DASHBOARD_API_KEY;
  if (!apiKey) {
    res.status(500).json({ ok: false, error: "Server misconfiguration" });
    return;
  }
  const provided = (req.body?.key ?? "").trim();
  if (!provided || provided !== apiKey) {
    res.status(401).json({ ok: false, error: "Invalid API key" });
    return;
  }
  res.json({
    ok: true,
    token: provided,
    user: { username: "Admin", role: "admin", avatar: null, is_frozen: false },
  });
});

/**
 * GET /api/auth/me
 * Verifies the current token and returns the user.
 */
router.get("/auth/me", requireApiKey, (req, res) => {
  res.json({
    ok: true,
    user: { username: "Admin", role: "admin", avatar: null, is_frozen: false },
  });
});

export default router;
