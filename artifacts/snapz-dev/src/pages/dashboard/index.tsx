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
      <h1 className="text-3xl font-bold mb-2 text-white">Overview</h1>
      <p className="text-gray-400 mb-8">Welcome to the Snap-Z staff dashboard.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total bots" value={stats.total} />
        <StatCard label="Visible to public" value={stats.visible} color="text-emerald-400" />
        <StatCard label="Hidden" value={stats.hidden} color="text-gray-500" />
      </div>
    </div>
  );
}

function StatCard({ label, value, color = 'text-[#5BB8F5]' }: { label: string; value: number; color?: string }) {
  return (
    <div className="border border-[#1E3A5F]/50 bg-[#111] rounded-lg p-5">
      <div className="text-xs uppercase text-gray-500 mb-1">{label}</div>
      <div className={`text-3xl font-bold mt-1 ${color}`}
        style={{ textShadow: '0 0 10px currentColor' }}>
        {value}
      </div>
    </div>
  );
}
