import { apiFetch } from './api-client';
import type { Code } from './data';

function mapBot(row: any): Code {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    subcategory: row.subcategory ?? '',
    difficulty: row.difficulty ?? '',
    language: row.language ?? '',
    views: 0,
    likes: 0,
    featured: row.featured ?? false,
    bannerImage: row.banner_image ?? undefined,
    fullDescription: row.full_description ?? undefined,
    technologies: row.technologies ?? [],
    features: row.features ?? [],
    accessCode: row.access_code ?? undefined,
    filelink: row.filelink ?? undefined,
    files: Array.isArray(row.bot_files)
      ? [...row.bot_files]
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((f: any) => ({ name: f.name, language: f.language, code: f.code }))
      : [],
  };
}

export async function fetchVisibleBots(): Promise<Code[]> {
  try {
    const data = await apiFetch('/api/bots');
    return (data.bots ?? []).map(mapBot);
  } catch (e) {
    console.error('fetchVisibleBots', e);
    return [];
  }
}

export async function fetchBotById(id: number): Promise<Code | null> {
  try {
    const data = await apiFetch(`/api/bots/${id}`);
    return data.bot ? mapBot(data.bot) : null;
  } catch {
    return null;
  }
}

export async function fetchAllVisibleBotIds(): Promise<number[]> {
  try {
    const data = await apiFetch('/api/bots');
    return (data.bots ?? []).map((b: any) => b.id);
  } catch {
    return [];
  }
}
