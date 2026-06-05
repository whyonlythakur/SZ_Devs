import { createClient } from "npm:@supabase/supabase-js@2";
import { signJWT } from "../_shared/jwt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const GUILD_ID = "1473425849360318494";
const ROLE_MAP: Record<string, "founder" | "ceo" | "coo" | "cto"> = {
  "1473426512173862983": "founder",
  "1510976897327038555": "ceo",
  "1510976982983249940": "coo",
  "1510977038683472073": "cto",
};
// Priority: founder > ceo > coo > cto
const ROLE_PRIORITY = ["founder", "ceo", "coo", "cto"] as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    // GET ?action=login&redirect_uri=... → returns Discord OAuth URL
    if (req.method === "GET" && url.searchParams.get("action") === "login") {
      const redirectUri = url.searchParams.get("redirect_uri");
      if (!redirectUri) {
        return json({ error: "redirect_uri required" }, 400);
      }
      const clientId = Deno.env.get("DISCORD_CLIENT_ID")!;
      const scopes = ["identify", "guilds.members.read"].join(" ");
      const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${
        encodeURIComponent(redirectUri)
      }&response_type=code&scope=${encodeURIComponent(scopes)}&prompt=consent`;
      return json({ url: authUrl });
    }

    // POST { code, redirect_uri } → exchange + role check + JWT
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const { code, redirect_uri } = await req.json();
    if (!code || !redirect_uri) {
      return json({ error: "code and redirect_uri required" }, 400);
    }

    const clientId = Deno.env.get("DISCORD_CLIENT_ID")!;
    const clientSecret = Deno.env.get("DISCORD_CLIENT_SECRET")!;
    const botToken = Deno.env.get("DISCORD_BOT_TOKEN")!;
    const jwtSecret = Deno.env.get("SESSION_JWT_SECRET")!;

    // 1. Exchange code for access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri,
      }),
    });
    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return json({ error: "Discord token exchange failed", detail: t }, 400);
    }
    const tokens = await tokenRes.json();

    // 2. Get user identity
    const meRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!meRes.ok) return json({ error: "Failed to fetch Discord user" }, 400);
    const me = await meRes.json();
    const discordId = me.id as string;
    const username = (me.global_name || me.username) as string;
    const avatar = me.avatar
      ? `https://cdn.discordapp.com/avatars/${discordId}/${me.avatar}.png`
      : null;

    // 3. Fetch member roles via bot (more reliable than guilds.members.read)
    const memberRes = await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${discordId}`,
      { headers: { Authorization: `Bot ${botToken}` } },
    );
    if (!memberRes.ok) {
      return json({
        error: "You are not a member of the Snap-Z guild.",
      }, 403);
    }
    const member = await memberRes.json();
    const memberRoles: string[] = member.roles || [];

    // 4. Determine highest role
    let role: "founder" | "ceo" | "coo" | "cto" | null = null;
    for (const r of ROLE_PRIORITY) {
      const roleId = Object.entries(ROLE_MAP).find(([, v]) => v === r)?.[0];
      if (roleId && memberRoles.includes(roleId)) {
        role = r;
        break;
      }
    }
    if (!role) {
      return json({
        error:
          "You do not have a staff role (FOUNDER/CEO/COO/CTO) in the Discord guild.",
      }, 403);
    }

    // 5. Upsert staff_users
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: existing } = await supabase
      .from("staff_users")
      .select("is_frozen")
      .eq("discord_id", discordId)
      .maybeSingle();

    await supabase.from("staff_users").upsert({
      discord_id: discordId,
      username,
      avatar,
      role,
      // Preserve frozen state on re-login
      is_frozen: existing?.is_frozen ?? false,
    }, { onConflict: "discord_id" });

    // 6. Mint JWT
    const token = await signJWT(
      { sub: discordId, role, username, avatar },
      jwtSecret,
    );

    return json({
      token,
      user: { discord_id: discordId, username, avatar, role },
    });
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
