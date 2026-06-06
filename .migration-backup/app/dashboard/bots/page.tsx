'use client';

import { useEffect, useState } from 'react';
import { dashApi } from '@/lib/dashboard-api';
import { Eye, EyeOff, Pencil, Trash2, Plus, X, Save } from 'lucide-react';

type Role = 'founder' | 'ceo' | 'coo' | 'cto';

const perms = (r: Role) => ({
  create: r !== 'coo',
  edit: r === 'founder' || r === 'ceo',
  del: r !== 'cto',
  visibility: r === 'founder' || r === 'ceo',
});

const empty = {
  title: '', description: '', category: 'discord-bot', subcategory: '',
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

  if (loading || !me) return <div>Loading…</div>;
  const p = perms(me.role);
  const frozen = me.is_frozen;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bots</h1>
          <p className="text-gray-400 text-sm">Manage bot cards shown on the public site.</p>
        </div>
        {p.create && !frozen && (
          <button onClick={() => setCreating(true)} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-md flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4" /> New Bot
          </button>
        )}
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Visibility</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((b) => (
              <tr key={b.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="p-3 font-medium">{b.title}</td>
                <td className="p-3 text-gray-400">{b.category}</td>
                <td className="p-3">
                  {b.is_visible ? (
                    <span className="text-green-400 text-xs">● Visible</span>
                  ) : (
                    <span className="text-gray-500 text-xs">● Hidden</span>
                  )}
                </td>
                <td className="p-3 text-right space-x-2">
                  {p.visibility && !frozen && (
                    <button
                      title={b.is_visible ? 'Hide' : 'Show'}
                      onClick={() => dashApi.toggleVisibility(b.id, !b.is_visible).then(load)}
                      className="p-1.5 rounded hover:bg-white/10"
                    >
                      {b.is_visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                  {p.edit && !frozen && (
                    <button onClick={() => setEditing(b)} className="p-1.5 rounded hover:bg-white/10" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  {p.del && !frozen && (
                    <button
                      title="Delete"
                      onClick={() => { if (confirm(`Delete "${b.title}"?`)) dashApi.deleteBot(b.id).then(load); }}
                      className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                    >
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
          initial={editing
            ? {
                ...editing,
                technologies: (editing.technologies || []).join(', '),
                features: (editing.features || []).join(', '),
                files: editing.bot_files?.length ? editing.bot_files : [{ name: '', language: 'javascript', code: '' }],
              }
            : empty}
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
      if (isEdit) {
        await dashApi.updateBot({ id: form.id, ...payload });
      } else {
        await dashApi.createBot(payload);
      }
      onSaved();
    } catch (e: any) {
      setErr(e.message); setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-[#1a0800] border border-orange-900/40 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-[#1a0800] z-10">
          <h2 className="text-xl font-bold">{isEdit ? 'Edit bot' : 'New bot'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <Field label="Title"><input value={form.title} onChange={(e) => set('title', e.target.value)} className="input" /></Field>
          <Field label="Short description"><input value={form.description} onChange={(e) => set('description', e.target.value)} className="input" /></Field>
          <Field label="Full description"><textarea value={form.full_description || ''} onChange={(e) => set('full_description', e.target.value)} className="input min-h-[80px]" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category"><input value={form.category} onChange={(e) => set('category', e.target.value)} className="input" /></Field>
            <Field label="Subcategory"><input value={form.subcategory || ''} onChange={(e) => set('subcategory', e.target.value)} className="input" /></Field>
            <Field label="Difficulty"><input value={form.difficulty || ''} onChange={(e) => set('difficulty', e.target.value)} className="input" /></Field>
            <Field label="Language"><input value={form.language || ''} onChange={(e) => set('language', e.target.value)} className="input" /></Field>
          </div>
          <Field label="Banner image URL"><input value={form.banner_image || ''} onChange={(e) => set('banner_image', e.target.value)} className="input" /></Field>
          <Field label="Technologies (comma-separated)"><input value={form.technologies} onChange={(e) => set('technologies', e.target.value)} className="input" /></Field>
          <Field label="Features (comma-separated)"><input value={form.features} onChange={(e) => set('features', e.target.value)} className="input" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Access code"><input value={form.access_code || ''} onChange={(e) => set('access_code', e.target.value)} className="input" /></Field>
            <Field label="File link (Mega/Drive)"><input value={form.filelink || ''} onChange={(e) => set('filelink', e.target.value)} className="input" /></Field>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_visible} onChange={(e) => set('is_visible', e.target.checked)} /> Visible to public</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Code files</span>
              <button onClick={addFile} className="text-xs flex items-center gap-1 text-orange-400 hover:underline"><Plus className="h-3 w-3" /> Add file</button>
            </div>
            {form.files.map((f: any, i: number) => (
              <div key={i} className="border border-white/10 rounded p-3 mb-3 space-y-2">
                <div className="grid grid-cols-[1fr,140px,auto] gap-2">
                  <input placeholder="filename.js" value={f.name} onChange={(e) => setFile(i, 'name', e.target.value)} className="input" />
                  <input placeholder="language" value={f.language} onChange={(e) => setFile(i, 'language', e.target.value)} className="input" />
                  <button onClick={() => rmFile(i)} className="text-red-400 hover:bg-red-500/20 p-2 rounded"><Trash2 className="h-4 w-4" /></button>
                </div>
                <textarea placeholder="code" value={f.code} onChange={(e) => setFile(i, 'code', e.target.value)} className="input min-h-[120px] font-mono text-xs" />
              </div>
            ))}
          </div>

          {err && <div className="text-red-400 text-sm">{err}</div>}
        </div>
        <div className="p-5 border-t border-white/10 flex justify-end gap-2 sticky bottom-0 bg-[#1a0800]">
          <button onClick={onClose} className="px-4 py-2 rounded hover:bg-white/10">Cancel</button>
          <button disabled={saving} onClick={submit} className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 px-4 py-2 rounded flex items-center gap-2">
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 8px 12px;
          color: white;
          font-size: 13px;
        }
        :global(.input:focus) {
          outline: none;
          border-color: rgb(234, 88, 12);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <div>
      <label className="block text-xs uppercase text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}
