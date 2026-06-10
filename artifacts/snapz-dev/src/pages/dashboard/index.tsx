import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { dashApi } from '@/lib/dashboard-api';
import { Bot, Eye, EyeOff, Star, FolderOpen, Activity, ArrowRight, Monitor } from 'lucide-react';

interface Stats {
  total: number;
  visible: number;
  hidden: number;
  featured: number;
  categories: Record<string, number>;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({ total: 0, visible: 0, hidden: 0, featured: 0, categories: {} });
  const [recentAudit, setRecentAudit] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashApi.listBots().catch(() => ({ bots: [] })),
      dashApi.listAudit().catch(() => ({ log: [] })),
    ]).then(([botsRes, auditRes]) => {
      const bots: any[] = botsRes.bots || [];
      const categories: Record<string, number> = {};
      bots.forEach((b) => {
        categories[b.category] = (categories[b.category] ?? 0) + 1;
      });
      setStats({
        total: bots.length,
        visible: bots.filter((b) => b.is_visible).length,
        hidden: bots.filter((b) => !b.is_visible).length,
        featured: bots.filter((b) => b.featured).length,
        categories,
      });
      setRecentAudit((auditRes.log || []).slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  const topCategories = Object.entries(stats.categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <p className="text-gray-400 mt-1">Welcome to the Snap-Z staff dashboard.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Bot} label="Total bots" value={stats.total} color="#5BB8F5" />
        <StatCard icon={Eye} label="Visible" value={stats.visible} color="#34d399" />
        <StatCard icon={EyeOff} label="Hidden" value={stats.hidden} color="#6b7280" />
        <StatCard icon={Star} label="Featured" value={stats.featured} color="#fbbf24" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="border border-[#1E3A5F]/50 bg-[#111] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Activity className="h-4 w-4 text-[#5BB8F5]" />
              Recent Activity
            </div>
            <Link href="/dashboard/audit" className="text-xs text-[#5BB8F5] hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-[#1E3A5F]/20 rounded animate-pulse" />
              ))}
            </div>
          ) : recentAudit.length === 0 ? (
            <p className="text-gray-600 text-sm">No activity yet.</p>
          ) : (
            <div className="space-y-2">
              {recentAudit.map((e, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#1E3A5F]/20 last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs text-[#5BB8F5] shrink-0">{e.action}</span>
                    {e.payload?.title && (
                      <span className="text-xs text-gray-500 truncate">"{e.payload.title}"</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 shrink-0 ml-2">
                    {timeAgo(e.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories breakdown */}
        <div className="border border-[#1E3A5F]/50 bg-[#111] rounded-xl p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <FolderOpen className="h-4 w-4 text-[#5BB8F5]" />
            Categories
          </div>
          {topCategories.length === 0 ? (
            <p className="text-gray-600 text-sm">No bots yet.</p>
          ) : (
            <div className="space-y-3">
              {topCategories.map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300 capitalize">{cat.replace(/-/g, ' ')}</span>
                    <span className="text-[#5BB8F5]">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[#1E3A5F]/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#3A8FD4] to-[#5BB8F5] rounded-full transition-all"
                      style={{ width: `${Math.round((count / stats.total) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Site preview card */}
      <div className="border border-[#1E3A5F]/50 bg-[#111] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E3A5F]/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Monitor className="h-4 w-4 text-[#5BB8F5]" />
            Public Site Preview
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#5BB8F5] hover:underline flex items-center gap-1"
            >
              Open in new tab <ArrowRight className="h-3 w-3" />
            </a>
            <Link
              href="/dashboard/preview"
              className="text-xs border border-[#3A8FD4]/50 bg-[#3A8FD4]/10 hover:bg-[#3A8FD4]/20 text-[#5BB8F5] px-3 py-1 rounded transition-all"
            >
              Full preview
            </Link>
          </div>
        </div>
        <div className="relative" style={{ height: 320 }}>
          <iframe
            src="/"
            title="Public site preview"
            className="w-full h-full border-0 pointer-events-none"
            style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '167%', height: '167%' }}
          />
          <div className="absolute inset-0" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/dashboard/bots"
          className="flex items-center gap-3 p-4 border border-[#1E3A5F]/50 bg-[#111] rounded-xl hover:border-[#3A8FD4]/50 hover:bg-[#1E3A5F]/10 transition-all group"
        >
          <div className="h-9 w-9 rounded-lg border border-[#3A8FD4]/40 bg-[#3A8FD4]/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-[#5BB8F5]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-[#5BB8F5] transition-colors">Manage Bots</div>
            <div className="text-xs text-gray-500">Add, edit, or toggle visibility</div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-[#5BB8F5] ml-auto transition-colors" />
        </Link>

        <Link
          href="/dashboard/preview"
          className="flex items-center gap-3 p-4 border border-[#1E3A5F]/50 bg-[#111] rounded-xl hover:border-[#3A8FD4]/50 hover:bg-[#1E3A5F]/10 transition-all group"
        >
          <div className="h-9 w-9 rounded-lg border border-[#3A8FD4]/40 bg-[#3A8FD4]/10 flex items-center justify-center">
            <Monitor className="h-4 w-4 text-[#5BB8F5]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-[#5BB8F5] transition-colors">Site Preview</div>
            <div className="text-xs text-gray-500">See exactly what visitors see</div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-[#5BB8F5] ml-auto transition-colors" />
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="border border-[#1E3A5F]/50 bg-[#111] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase text-gray-500">{label}</span>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="text-3xl font-bold" style={{ color, textShadow: `0 0 12px ${color}60` }}>
        {value}
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
