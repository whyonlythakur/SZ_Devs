import { Router } from "express";
import { readDb, writeDb, type Bot } from "../lib/db";
import { requireSession } from "../middlewares/requireSession";

const router = Router();

/* ── Public: visible bots ─────────────────────────────────── */

router.get("/bots", async (_req, res) => {
  try {
    const { data } = await readDb();
    res.json({ ok: true, bots: data.bots.filter((b) => b.is_visible) });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/bots/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { data } = await readDb();
    const bot = data.bots.find((b) => b.id === id && b.is_visible);
    if (!bot) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, bot });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ── Admin: all bots (session required) ───────────────────── */

router.get("/admin/bots", requireSession, async (_req, res) => {
  try {
    const { data } = await readDb();
    res.json({ ok: true, bots: data.bots });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post("/admin/bots", requireSession, async (req, res) => {
  try {
    const { data, sha } = await readDb();
    const newBot: Bot = {
      id: data.nextId,
      title: req.body.title ?? "",
      description: req.body.description ?? "",
      category: req.body.category ?? "",
      subcategory: req.body.subcategory ?? "",
      difficulty: req.body.difficulty ?? "Beginner",
      language: req.body.language ?? "JavaScript",
      banner_image: req.body.banner_image ?? null,
      full_description: req.body.full_description ?? null,
      technologies: req.body.technologies ?? [],
      features: req.body.features ?? [],
      access_code: req.body.access_code ?? null,
      filelink: req.body.filelink ?? null,
      is_visible: req.body.is_visible ?? false,
      featured: req.body.featured ?? false,
      bot_files: req.body.files ?? [],
      created_at: new Date().toISOString(),
    };
    data.bots.unshift(newBot);
    data.nextId += 1;
    data.audit.unshift({ id: data.audit.length + 1, created_at: new Date().toISOString(), action: "create-bot", actor: "admin", target_type: "bot", target_id: newBot.id, payload: { title: newBot.title } });
    await writeDb(data, sha, `feat: add bot "${newBot.title}"`);
    res.json({ ok: true, bot: newBot });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.patch("/admin/bots/:id", requireSession, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { data, sha } = await readDb();
    const idx = data.bots.findIndex((b) => b.id === id);
    if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });
    const updated: Bot = {
      ...data.bots[idx],
      ...req.body,
      id,
      bot_files: req.body.files ?? data.bots[idx].bot_files,
    };
    data.bots[idx] = updated;
    data.audit.unshift({ id: data.audit.length + 1, created_at: new Date().toISOString(), action: "update-bot", actor: "admin", target_type: "bot", target_id: id, payload: { title: updated.title } });
    await writeDb(data, sha, `chore: update bot "${updated.title}"`);
    res.json({ ok: true, bot: updated });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.delete("/admin/bots/:id", requireSession, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { data, sha } = await readDb();
    const bot = data.bots.find((b) => b.id === id);
    data.bots = data.bots.filter((b) => b.id !== id);
    data.audit.unshift({ id: data.audit.length + 1, created_at: new Date().toISOString(), action: "delete-bot", actor: "admin", target_type: "bot", target_id: id, payload: { title: bot?.title } });
    await writeDb(data, sha, `chore: delete bot ${id}`);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.patch("/admin/bots/:id/visibility", requireSession, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { data, sha } = await readDb();
    const idx = data.bots.findIndex((b) => b.id === id);
    if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });
    data.bots[idx].is_visible = !!req.body.is_visible;
    data.audit.unshift({ id: data.audit.length + 1, created_at: new Date().toISOString(), action: "toggle-visibility", actor: "admin", target_type: "bot", target_id: id, payload: { is_visible: data.bots[idx].is_visible } });
    await writeDb(data, sha, `chore: set bot ${id} visible=${data.bots[idx].is_visible}`);
    res.json({ ok: true, bot: data.bots[idx] });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/admin/audit", requireSession, async (_req, res) => {
  try {
    const { data } = await readDb();
    res.json({ ok: true, log: data.audit.slice(0, 100) });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
