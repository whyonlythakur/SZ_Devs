// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";
import { verifyJWT } from "../_shared/jwt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

type Role = "founder" | "ceo" | "coo" | "cto";
const RANK: Record<Role, number> = { founder: 4, ceo: 3, coo: 2, cto: 1 };

interface SessionClaims {
  sub: string;
  role: Role;
  username: string;
  avatar: string | null;
  exp: number;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function getSession(req: Request): Promise<
  { ok: true; claims: SessionClaims; staff: any } | { ok: false; res: Response }
> {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { ok: false, res: json({ error: "Unauthorized" }, 401) };
  }
  const token = auth.slice(7);
  const claims = await verifyJWT<SessionClaims>(
    token,
    Deno.env.get("SESSION_JWT_SECRET")!,
  );
  if (!claims) return { ok: false, res: json({ error: "Invalid token" }, 401) };

  const { data: staff } = await supabase
    .from("staff_users")
    .select("*")
    .eq("discord_id", claims.sub)
    .maybeSingle();
  if (!staff) {
    return { ok: false, res: json({ error: "Staff record not found" }, 404) };
  }
  return { ok: true, claims, staff };
}

async function audit(actor: any, action: string, target?: any, payload?: any) {
  await supabase.from("audit_log").insert({
    actor_discord_id: actor.discord_id,
    actor_role: actor.role,
    action,
    target_type: target?.type ?? null,
    target_id: target?.id ? String(target.id) : null,
    payload: payload ?? null,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action") ?? "";

  const session = await getSession(req);
  if (!session.ok) return session.res;
  const { staff } = session;
  const role = staff.role as Role;
  const frozen = staff.is_frozen as boolean;

  // Read-only actions allowed even when frozen
  const readOnly = new Set(["me", "list-bots", "list-staff", "list-audit"]);

  if (!readOnly.has(action) && frozen) {
    return json({
      error: "Your account is frozen. Contact a Founder or CEO to unfreeze.",
    }, 403);
  }

  try {
    switch (action) {
      case "me":
        return json({ user: staff });

      case "list-bots": {
        const { data, error } = await supabase
          .from("bots")
          .select("*, bot_files(*)")
          .order("id", { ascending: false });
        if (error) throw error;
        return json({ bots: data });
      }

      case "list-staff": {
        if (role !== "founder" && role !== "ceo") {
          return json({ error: "Forbidden" }, 403);
        }
        const { data, error } = await supabase
          .from("staff_users")
          .select("*")
          .order("role");
        if (error) throw error;
        return json({ staff: data });
      }

      case "list-audit": {
        if (role !== "founder" && role !== "ceo") {
          return json({ error: "Forbidden" }, 403);
        }
        const { data, error } = await supabase
          .from("audit_log")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);
        if (error) throw error;
        return json({ log: data });
      }

      case "create-bot": {
        // founder, ceo, cto can create
        if (role === "coo") return json({ error: "Forbidden" }, 403);
        const body = await req.json();
        const { files = [], ...bot } = body;
        const { data: newBot, error } = await supabase
          .from("bots")
          .insert({ ...bot, created_by: staff.discord_id })
          .select()
          .single();
        if (error) throw error;
        if (files.length) {
          await supabase.from("bot_files").insert(
            files.map((f: any, i: number) => ({
              bot_id: newBot.id,
              name: f.name,
              language: f.language,
              code: f.code,
              sort_order: i,
            })),
          );
        }
        await audit(staff, "bot.create", { type: "bot", id: newBot.id }, {
          title: newBot.title,
        });
        return json({ bot: newBot });
      }

      case "update-bot": {
        // founder, ceo only
        if (role !== "founder" && role !== "ceo") {
          return json({ error: "Forbidden" }, 403);
        }
        const body = await req.json();
        const { id, files, ...patch } = body;
        const { data: updated, error } = await supabase
          .from("bots")
          .update(patch)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        if (Array.isArray(files)) {
          await supabase.from("bot_files").delete().eq("bot_id", id);
          if (files.length) {
            await supabase.from("bot_files").insert(
              files.map((f: any, i: number) => ({
                bot_id: id,
                name: f.name,
                language: f.language,
                code: f.code,
                sort_order: i,
              })),
            );
          }
        }
        await audit(staff, "bot.update", { type: "bot", id }, patch);
        return json({ bot: updated });
      }

      case "delete-bot": {
        // founder, ceo, coo
        if (role === "cto") return json({ error: "Forbidden" }, 403);
        const { id } = await req.json();
        const { error } = await supabase.from("bots").delete().eq("id", id);
        if (error) throw error;
        await audit(staff, "bot.delete", { type: "bot", id });
        return json({ ok: true });
      }

      case "toggle-visibility": {
        // founder, ceo
        if (role !== "founder" && role !== "ceo") {
          return json({ error: "Forbidden" }, 403);
        }
        const { id, is_visible } = await req.json();
        const { data, error } = await supabase
          .from("bots")
          .update({ is_visible })
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        await audit(staff, "bot.visibility", { type: "bot", id }, {
          is_visible,
        });
        return json({ bot: data });
      }

      case "freeze": {
        const { discord_id } = await req.json();
        const { data: target } = await supabase
          .from("staff_users")
          .select("*")
          .eq("discord_id", discord_id)
          .maybeSingle();
        if (!target) return json({ error: "Target not found" }, 404);
        if (RANK[role] <= RANK[target.role as Role]) {
          return json({
            error: "You cannot freeze someone at or above your rank.",
          }, 403);
        }
        await supabase
          .from("staff_users")
          .update({
            is_frozen: true,
            frozen_by: staff.discord_id,
            frozen_at: new Date().toISOString(),
          })
          .eq("discord_id", discord_id);
        await audit(staff, "staff.freeze", {
          type: "staff",
          id: discord_id,
        });
        return json({ ok: true });
      }

      case "unfreeze": {
        // founder, ceo only
        if (role !== "founder" && role !== "ceo") {
          return json({ error: "Forbidden" }, 403);
        }
        const { discord_id } = await req.json();
        await supabase
          .from("staff_users")
          .update({ is_frozen: false, frozen_by: null, frozen_at: null })
          .eq("discord_id", discord_id);
        await audit(staff, "staff.unfreeze", {
          type: "staff",
          id: discord_id,
        });
        return json({ ok: true });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500);
  }
});
