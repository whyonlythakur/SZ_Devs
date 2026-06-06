import { supabase } from './supabase';
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
    views: row.views ?? 0,
    likes: row.likes ?? 0,
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
          .map((f) => ({ name: f.name, language: f.language, code: f.code }))
      : [],
  };
}

export async function fetchVisibleBots(): Promise<Code[]> {
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('is_visible', true)
    .order('id', { ascending: false });
  if (error) {
    console.error('fetchVisibleBots', error);
    return [];
  }
  return (data ?? []).map(mapBot);
}

export async function fetchBotById(id: number): Promise<Code | null> {
  const { data, error } = await supabase
    .from('bots')
    .select('*, bot_files(*)')
    .eq('id', id)
    .eq('is_visible', true)
    .maybeSingle();
  if (error || !data) return null;
  return mapBot(data);
}

export async function fetchAllVisibleBotIds(): Promise<number[]> {
  const { data, error } = await supabase
    .from('bots')
    .select('id')
    .eq('is_visible', true);
  if (error || !data) return [];
  return data.map((r: any) => r.id);
}
