import { useEffect, useState } from 'react';
import { dashApi } from '@/lib/dashboard-api';

export default function AuditPage() {
  const [log, setLog] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    dashApi.listAudit().then((r) => setLog(r.log || [])).catch((e) => setErr(e.message));
  }, []);

  if (err) return <div className="text-red-400">{err}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Audit Log</h1>
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="p-3">When</th>
              <th className="p-3">Actor</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {log.map((e) => (
              <tr key={e.id} className="border-t border-white/5">
                <td className="p-3 text-xs text-gray-400">{new Date(e.created_at).toLocaleString()}</td>
                <td className="p-3 text-xs"><span className="uppercase text-orange-300">{e.actor_role}</span> · {e.actor_discord_id}</td>
                <td className="p-3 font-mono text-xs">{e.action}</td>
                <td className="p-3 text-xs text-gray-400">{e.target_type}:{e.target_id}</td>
                <td className="p-3 text-xs text-gray-400 max-w-[300px] truncate">{e.payload ? JSON.stringify(e.payload) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
