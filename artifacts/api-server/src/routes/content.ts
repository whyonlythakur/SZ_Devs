import { Router, type IRouter, type Request, type Response } from "express";
import { readJsonFile, writeJsonFile } from "../lib/github";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const CONTENT_FILE = "data/content.json";

/**
 * GET /api/content
 * Returns the current content stored in data/content.json on GitHub.
 */
router.get("/content", async (_req: Request, res: Response) => {
  try {
    const { content } = await readJsonFile(CONTENT_FILE);
    res.json({ ok: true, data: content });
  } catch (err: any) {
    logger.error({ err }, "Failed to read content from GitHub");
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * POST /api/content
 * Body: { data: <any JSON value to save>, message?: <optional commit message> }
 *
 * Workflow:
 *  1. Fetch current file from GitHub to get the latest SHA.
 *  2. Merge/replace with the incoming data.
 *  3. Commit the updated file back to the repo.
 *  Vercel (or any CI) will detect the push and redeploy automatically.
 */
router.post("/content", async (req: Request, res: Response) => {
  const { data: newData, message } = req.body as {
    data: unknown;
    message?: string;
  };

  if (newData === undefined) {
    res.status(400).json({ ok: false, error: 'Request body must include a "data" field' });
    return;
  }

  try {
    const { sha } = await readJsonFile(CONTENT_FILE);

    await writeJsonFile(
      CONTENT_FILE,
      newData,
      sha,
      message ?? `chore: update content.json via dashboard`,
    );

    res.json({ ok: true, message: "Content committed to GitHub successfully" });
  } catch (err: any) {
    logger.error({ err }, "Failed to commit content to GitHub");
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
