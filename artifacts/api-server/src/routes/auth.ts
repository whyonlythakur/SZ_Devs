import { Router } from "express";
import { requireSession } from "../middlewares/requireSession";

const router = Router();

const CLIENT_ID     = process.env.DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const GUILD_ID      = process.env.DISCORD_GUILD_ID!;

const ROLE_MAP: Record<string, string> = {
  [process.env.DISCORD_ROLE_FOUNDER!]: "founder",
  [process.env.DISCORD_ROLE_CEO!]:     "ceo",
  [process.env.DISCORD_ROLE_COO!]:     "coo",
  [process.env.DISCORD_ROLE_CTO!]:     "cto",
};

/** Build the Discord OAuth2 URL the frontend should redirect to */
router.get("/auth/discord/url", (req, res) => {
  const redirectUri = (req.query.redirect_uri as string) ?? "";
  const state = Buffer.from(JSON.stringify({ redirectUri })).toString("base64url");
  const params = new URLSearchParams({
    client_id:     CLIENT_ID,
    redirect_uri:  redirectUri,
    response_type: "code",
    scope:         "identify guilds.members.read",
    state,
  });
  res.json({ ok: true, url: `https://discord.com/api/oauth2/authorize?${params}` });
});

/** Exchange code → token → user info → role → signed session token */
router.post("/auth/discord/callback", async (req, res) => {
  const { code, redirect_uri } = req.body ?? {};
  if (!code || !redirect_uri) {
    res.status(400).json({ ok: false, error: "Missing code or redirect_uri" });
    return;
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type:    "authorization_code",
        code,
        redirect_uri,
      }),
    });
    const tokenData = await tokenRes.json() as any;
    if (!tokenRes.ok || !tokenData.access_token) {
      res.status(401).json({ ok: false, error: tokenData.error_description ?? "Token exchange failed" });
      return;
    }
    const accessToken: string = tokenData.access_token;

    // 2. Fetch Discord user
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await userRes.json() as any;
    if (!userRes.ok) {
      res.status(401).json({ ok: false, error: "Failed to fetch Discord user" });
      return;
    }

    // 3. Fetch guild member to read roles
    const memberRes = await fetch(
      `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const member = await memberRes.json() as any;
    if (!memberRes.ok) {
      res.status(403).json({ ok: false, error: "You must be a member of the Snap-Z Discord server." });
      return;
    }

    // 4. Map Discord role IDs → staff rank
    const memberRoleIds: string[] = member.roles ?? [];
    let role: string | null = null;
    // Priority: founder > ceo > coo > cto
    for (const rank of ["founder", "ceo", "coo", "cto"]) {
      const roleId = Object.keys(ROLE_MAP).find((id) => ROLE_MAP[id] === rank);
      if (roleId && memberRoleIds.includes(roleId)) {
        role = rank;
        break;
      }
    }

    if (!role) {
      res.status(403).json({ ok: false, error: "You don't have a staff role in the Snap-Z server." });
      return;
    }

    // 5. Build a simple signed session token: base64(payload).signature
    const payload = {
      discord_id: user.id,
      username:   user.username,
      avatar:     user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null,
      role,
      is_frozen:  false,
      exp:        Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    };
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const secret     = process.env.DASHBOARD_API_KEY ?? "changeme";
    const crypto     = await import("crypto");
    const sig        = crypto.createHmac("sha256", secret).update(payloadB64).digest("hex");
    const token      = `${payloadB64}.${sig}`;

    res.json({ ok: true, token, user: payload });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/** GET /api/auth/me — verify session token and return user */
router.get("/auth/me", requireSession, (req: any, res) => {
  res.json({ ok: true, user: req.staffUser });
});

export default router;
