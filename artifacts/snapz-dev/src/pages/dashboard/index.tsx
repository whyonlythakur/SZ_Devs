import { useEffect, useState } from 'react';
import { dashApi } from '@/lib/dashboard-api';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ total: 0, visible: 0, hidden: 0 });

  useEffect(() => {
    dashApi.listBots().then((r) => {
      const bots = r.bots || [];
      setStats({
        total: bots.length,
        visible: bots.filter((b: any) => b.is_visible).length,
        hidden: bots.filter((b: any) => !b.is_visible).length,
      });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Overview</h1>
      <p className="text-gray-400 mb-8">Welcome to the Snap-Z staff dashboard.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total bots" value={stats.total} />
        <StatCard label="Visible to public" value={stats.visible} />
        <StatCard label="Hidden" value={stats.hidden} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <div className="text-xs uppercase text-gray-400">{label}</div>
      <div className="text-3xl font-bold mt-1 text-orange-400">{value}</div>
    </div>
  );
}
