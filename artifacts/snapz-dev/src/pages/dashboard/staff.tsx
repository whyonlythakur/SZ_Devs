import { useEffect, useState } from 'react';
import { dashApi } from '@/lib/dashboard-api';
import { Snowflake, Sun } from 'lucide-react';

const RANK = { founder: 4, ceo: 3, coo: 2, cto: 1 } as const;

export default function StaffPage() {
  const [me, setMe] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = () => dashApi.listStaff().then((r) => setStaff(r.staff || []));

  useEffect(() => {
    Promise.all([dashApi.me(), load()])
      .then(([m]) => setMe(m.user))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;
  if (err) return <div className="text-red-400">{err}</div>;

  const myRank = RANK[me.role as keyof typeof RANK];
  const canUnfreeze = me.role === 'founder' || me.role === 'ceo';

  const act = async (fn: () => Promise<any>) => {
    try { await fn(); load(); } catch (e: any) { alert(e.message); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Staff</h1>
      <p className="text-gray-400 text-sm mb-6">Founders and CEOs can manage frozen status of subordinates.</p>

      <div className="border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => {
              const sRank = RANK[s.role as keyof typeof RANK];
              const canFreeze = !me.is_frozen && myRank > sRank && !s.is_frozen;
              const showUnfreeze = !me.is_frozen && canUnfreeze && s.is_frozen;
              return (
                <tr key={s.discord_id} className="border-t border-white/5">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {s.avatar && <img src={s.avatar} alt="" className="h-7 w-7 rounded-full" />}
                      <div>
                        <div className="font-medium">{s.username}</div>
                        <div className="text-xs text-gray-500">{s.discord_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><span className="uppercase text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-300">{s.role}</span></td>
                  <td className="p-3">
                    {s.is_frozen
                      ? <span className="text-blue-300 text-xs flex items-center gap-1"><Snowflake className="h-3 w-3" /> Frozen</span>
                      : <span className="text-green-400 text-xs">Active</span>}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {canFreeze && (
                      <button onClick={() => act(() => dashApi.freeze(s.discord_id))} className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700">Freeze</button>
                    )}
                    {showUnfreeze && (
                      <button onClick={() => act(() => dashApi.unfreeze(s.discord_id))} className="px-3 py-1 text-xs rounded bg-green-600 hover:bg-green-700 inline-flex items-center gap-1"><Sun className="h-3 w-3" /> Unfreeze</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
