import { readJsonFile, writeJsonFile } from "./github";

const DB_PATH = "db/data.json";

export interface BotFile {
  name: string;
  language: string;
  code: string;
  sort_order?: number;
}

export interface Bot {
  id: number;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  difficulty: string;
  language: string;
  banner_image: string | null;
  full_description: string | null;
  technologies: string[];
  features: string[];
  access_code: string | null;
  filelink: string | null;
  is_visible: boolean;
  featured: boolean;
  bot_files: BotFile[];
  created_at: string;
}

export interface DbData {
  bots: Bot[];
  nextId: number;
  audit: AuditEntry[];
}

export interface AuditEntry {
  id: number;
  created_at: string;
  action: string;
  actor: string;
  target_type: string;
  target_id: number | null;
  payload: any;
}

const DEFAULT: DbData = { bots: [], nextId: 1, audit: [] };

export async function readDb(): Promise<{ data: DbData; sha: string }> {
  try {
    const { content, sha } = await readJsonFile(DB_PATH);
    const data: DbData = {
      ...DEFAULT,
      ...content,
    };
    return { data, sha };
  } catch (e: any) {
    if (e.status === 404 || (e.message && e.message.includes("404"))) {
      return { data: { ...DEFAULT }, sha: "" };
    }
    throw e;
  }
}

export async function writeDb(
  data: DbData,
  sha: string,
  message = "chore: update db via dashboard",
): Promise<string> {
  return await writeJsonFile(DB_PATH, data, sha, message);
}
