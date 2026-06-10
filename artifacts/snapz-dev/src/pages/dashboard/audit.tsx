import { useEffect, useState } from 'react';
import { dashApi } from '@/lib/dashboard-api';

export default function AuditPage() {
  const [log, setLog] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    dashApi.listAudit()
      .then((r) => setLog(r.log || []))
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Audit Log</h1>

      {err && <p className="text-red-400 text-sm mb-4">{err}</p>}

      {log.length === 0 && !err ? (
        <div className="border border-[#1E3A5F]/40 bg-[#111] rounded-lg p-8 text-center text-gray-500 text-sm">
          No audit entries yet. Actions taken in the dashboard will appear here.
        </div>
      ) : (
        <div className="border border-[#1E3A5F]/50 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#1E3A5F]/20 text-left text-xs uppercase text-gray-400">
              <tr>
                <th className="p-3">When</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {log.map((e, i) => (
                <tr key={i} className="border-t border-[#1E3A5F]/30 hover:bg-[#1E3A5F]/10 transition-colors">
                  <td className="p-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(e.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 font-mono text-xs text-[#5BB8F5]">{e.action}</td>
                  <td className="p-3 text-xs text-gray-400">
                    {e.target_type}:{e.target_id}
                  </td>
                  <td className="p-3 text-xs text-gray-400 max-w-[300px] truncate">
                    {e.payload ? JSON.stringify(e.payload) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
