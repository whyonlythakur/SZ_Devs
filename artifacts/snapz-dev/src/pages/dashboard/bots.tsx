import { useEffect, useState } from 'react';
import { dashApi } from '@/lib/dashboard-api';
import { categories } from '@/lib/data';
import { Eye, EyeOff, Pencil, Trash2, Plus, X, Save } from 'lucide-react';

import type { StaffRole } from '@/lib/dashboard-api';

type Role = StaffRole;
const perms = (r: Role) => ({
  create: r !== 'coo',
  edit: r === 'founder' || r === 'ceo',
  del: r !== 'cto',
  visibility: r === 'founder' || r === 'ceo',
});

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Other'];

const empty = {
  title: '', description: '', category: categories[0].id, subcategory: categories[0].subcategories[0].id,
  difficulty: 'Beginner', language: 'JavaScript', banner_image: '',
  full_description: '', technologies: '', features: '',
  access_code: '', filelink: '', is_visible: true, featured: false,
  files: [{ name: '', language: 'javascript', code: '' }],
};

export default function BotsPage() {
  const [bots, setBots] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => dashApi.listBots().then((r) => setBots(r.bots || []));

  useEffect(() => {
    Promise.all([dashApi.me(), load()])
      .then(([m]) => setMe(m.user))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !me) return <div className="text-gray-400">Loading…</div>;
  const p = perms(me.role);
  const frozen = me.is_frozen;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Bots</h1>
          <p className="text-gray-400 text-sm">Manage bot cards shown on the public site.</p>
        </div>
        {p.create && !frozen && (
          <button onClick={() => setCreating(true)}
            className="border border-[#3A8FD4]/60 bg-[#3A8FD4]/10 hover:bg-[#3A8FD4]/20 text-[#5BB8F5] px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-all hover:shadow-[0_0_12px_rgba(58,143,212,0.3)]">
            <Plus className="h-4 w-4" /> New Bot
          </button>
        )}
      </div>

      <div className="border border-[#1E3A5F]/50 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#1E3A5F]/20 text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Visibility</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((b) => (
              <tr key={b.id} className="border-t border-[#1E3A5F]/30 hover:bg-[#1E3A5F]/10 transition-colors">
                <td className="p-3 font-medium text-white">{b.title}</td>
                <td className="p-3 text-gray-400">{b.category}</td>
                <td className="p-3">
                  {b.is_visible
                    ? <span className="text-[#5BB8F5] text-xs">● Visible</span>
                    : <span className="text-gray-600 text-xs">● Hidden</span>}
                </td>
                <td className="p-3 text-right space-x-2">
                  {p.visibility && !frozen && (
                    <button onClick={() => dashApi.toggleVisibility(b.id, !b.is_visible).then(load)}
                      className="p-1.5 rounded hover:bg-[#1E3A5F]/40 text-gray-400 hover:text-[#5BB8F5] transition-colors">
                      {b.is_visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                  {p.edit && !frozen && (
                    <button onClick={() => setEditing(b)} className="p-1.5 rounded hover:bg-[#1E3A5F]/40 text-gray-400 hover:text-[#5BB8F5] transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  {p.del && !frozen && (
                    <button onClick={() => { if (confirm(`Delete "${b.title}"?`)) dashApi.deleteBot(b.id).then(load); }}
                      className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <BotEditor
          initial={editing ? {
            ...editing,
            technologies: (editing.technologies || []).join(', '),
            features: (editing.features || []).join(', '),
            files: editing.bot_files?.length ? editing.bot_files : [{ name: '', language: 'javascript', code: '' }],
          } : empty}
          isEdit={!!editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); load(); }}
        />
      )}
    </div>
  );
}

function BotEditor({ initial, isEdit, onClose, onSaved }: any) {
  const [form, setForm] = useState<any>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const setFile = (i: number, k: string, v: any) =>
    setForm((f: any) => ({ ...f, files: f.files.map((x: any, j: number) => j === i ? { ...x, [k]: v } : x) }));
  const addFile = () => setForm((f: any) => ({ ...f, files: [...f.files, { name: '', language: 'javascript', code: '' }] }));
  const rmFile = (i: number) => setForm((f: any) => ({ ...f, files: f.files.filter((_: any, j: number) => j !== i) }));

  const selectedCat = categories.find((c) => c.id === form.category) ?? categories[0];
  const subcats = selectedCat.subcategories;

  const handleCategoryChange = (catId: string) => {
    const cat = categories.find((c) => c.id === catId) ?? categories[0];
    set('category', catId);
    set('subcategory', cat.subcategories[0]?.id ?? '');
  };

  const inputClass = "w-full bg-[#0A0A0A] border border-[#1E3A5F] rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3A8FD4] transition-colors";
  const selectClass = `${inputClass} cursor-pointer`;

  const submit = async () => {
    setSaving(true); setErr(null);
    try {
      const payload: any = {
        title: form.title, description: form.description, category: form.category,
        subcategory: form.subcategory, difficulty: form.difficulty, language: form.language,
        banner_image: form.banner_image || null, full_description: form.full_description,
        technologies: String(form.technologies || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        features: String(form.features || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        access_code: form.access_code, filelink: form.filelink,
        is_visible: !!form.is_visible, featured: !!form.featured,
        files: form.files.filter((f: any) => f.name && f.code),
      };
      if (isEdit) await dashApi.updateBot({ id: form.id, ...payload });
      else await dashApi.createBot(payload);
      onSaved();
    } catch (e: any) {
      setErr(e.message); setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="border border-[#1E3A5F] bg-[#0d1117] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto"
        style={{ boxShadow: '0 0 40px rgba(58,143,212,0.15)' }}>
        <div className="flex items-center justify-between p-5 border-b border-[#1E3A5F]/40 sticky top-0 bg-[#0d1117] z-10">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit bot' : 'New bot'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#1E3A5F]/40 rounded text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-5 space-y-4 text-sm">
          <Field label="Title">
            <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} placeholder="e.g. Discord Music Bot" />
          </Field>

          <Field label="Short description">
            <input value={form.description} onChange={(e) => set('description', e.target.value)} className={inputClass} placeholder="One-line summary" />
          </Field>

          <Field label="Full description">
            <textarea value={form.full_description || ''} onChange={(e) => set('full_description', e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="Detailed description shown on the code detail page" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select value={form.category} onChange={(e) => handleCategoryChange(e.target.value)} className={selectClass}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Subcategory">
              <select value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} className={selectClass}>
                {subcats.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Difficulty">
              <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)} className={selectClass}>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>

            <Field label="Language">
              <select value={form.language} onChange={(e) => set('language', e.target.value)} className={selectClass}>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Banner image URL">
            <input value={form.banner_image || ''} onChange={(e) => set('banner_image', e.target.value)} className={inputClass} placeholder="https://..." />
          </Field>

          <Field label="Technologies (comma-separated)">
            <input value={form.technologies} onChange={(e) => set('technologies', e.target.value)} className={inputClass} placeholder="e.g. Discord.js, Node.js, MongoDB" />
          </Field>

          <Field label="Features (comma-separated)">
            <input value={form.features} onChange={(e) => set('features', e.target.value)} className={inputClass} placeholder="e.g. Music playback, Queue management" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Access code">
              <input value={form.access_code || ''} onChange={(e) => set('access_code', e.target.value)} className={inputClass} placeholder="e.g. DISCORD-MUSIC-001" />
            </Field>
            <Field label="File link">
              <input value={form.filelink || ''} onChange={(e) => set('filelink', e.target.value)} className={inputClass} placeholder="Download URL" />
            </Field>
          </div>

          <div className="flex gap-6 text-gray-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!form.is_visible} onChange={(e) => set('is_visible', e.target.checked)} className="accent-[#3A8FD4]" />
              Visible to public
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!form.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-[#3A8FD4]" />
              Featured on homepage
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-300">Code files</span>
              <button onClick={addFile} className="text-xs flex items-center gap-1 text-[#5BB8F5] hover:underline">
                <Plus className="h-3 w-3" /> Add file
              </button>
            </div>
            {form.files.map((f: any, i: number) => (
              <div key={i} className="border border-[#1E3A5F]/50 rounded p-3 mb-3 space-y-2">
                <div className="grid grid-cols-[1fr,140px,auto] gap-2">
                  <input placeholder="filename.js" value={f.name} onChange={(e) => setFile(i, 'name', e.target.value)} className={inputClass} />
                  <input placeholder="language" value={f.language} onChange={(e) => setFile(i, 'language', e.target.value)} className={inputClass} />
                  <button onClick={() => rmFile(i)} className="text-gray-500 hover:text-red-400 p-2 rounded hover:bg-red-500/10 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea placeholder="Paste code here…" value={f.code} onChange={(e) => setFile(i, 'code', e.target.value)} className={`${inputClass} min-h-[120px] font-mono text-xs`} />
              </div>
            ))}
          </div>

          {err && <div className="text-red-400 text-sm">{err}</div>}
        </div>

        <div className="p-5 border-t border-[#1E3A5F]/40 flex justify-end gap-2 sticky bottom-0 bg-[#0d1117]">
          <button onClick={onClose} className="px-4 py-2 rounded border border-[#1E3A5F] text-gray-400 hover:bg-[#1E3A5F]/20 transition-colors">Cancel</button>
          <button disabled={saving} onClick={submit}
            className="border border-[#3A8FD4]/60 bg-[#3A8FD4]/10 hover:bg-[#3A8FD4]/20 text-[#5BB8F5] disabled:opacity-50 px-4 py-2 rounded flex items-center gap-2 transition-all hover:shadow-[0_0_12px_rgba(58,143,212,0.3)]">
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <div>
      <label className="block text-xs uppercase text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
