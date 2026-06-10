import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { dashApi, clearToken, getToken, type StaffUser, type StaffRole } from '@/lib/dashboard-api';
import { LayoutDashboard, Bot, Users, ScrollText, LogOut, Snowflake, Monitor } from 'lucide-react';

const NAV: { href: string; label: string; icon: any; roles: StaffRole[] }[] = [
  { href: '/dashboard',         label: 'Overview',    icon: LayoutDashboard, roles: ['founder','ceo','coo','cto'] },
  { href: '/dashboard/bots',    label: 'Bots',         icon: Bot,             roles: ['founder','ceo','coo','cto'] },
  { href: '/dashboard/preview', label: 'Site Preview', icon: Monitor,         roles: ['founder','ceo','coo','cto'] },
  { href: '/dashboard/staff',   label: 'Staff',        icon: Users,           roles: ['founder','ceo'] },
  { href: '/dashboard/audit',   label: 'Audit Log',    icon: ScrollText,      roles: ['founder','ceo','coo'] },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, navigate] = useLocation();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location === '/dashboard/login' || location === '/dashboard/callback') {
      setLoading(false);
      return;
    }
    if (!getToken()) { navigate('/dashboard/login'); return; }
    dashApi.me()
      .then((r) => setUser(r.user))
      .catch(() => { clearToken(); navigate('/dashboard/login'); })
      .finally(() => setLoading(false));
  }, [location, navigate]);

  if (location === '/dashboard/login' || location === '/dashboard/callback') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
        Loading…
      </div>
    );
  }

  if (!user) return null;

  const visibleNav = NAV.filter((n) => n.roles.includes(user.role));

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] text-white">
      <aside className="w-60 border-r border-[#1E3A5F]/50 bg-[#0d1117] p-4 flex flex-col"
        style={{ boxShadow: '4px 0 20px rgba(58,143,212,0.06)' }}>
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Snapz" className="h-8 w-8 rounded object-contain"
              style={{ filter: 'drop-shadow(0 0 6px rgba(91,184,245,0.4))' }} />
            <div>
              <div className="text-sm font-bold text-white">Snap-Z</div>
              <div className="text-xs text-[#5BB8F5]">Staff Dashboard</div>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {visibleNav.map((n) => {
            const Icon = n.icon;
            const active = location === n.href;
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
                  active
                    ? 'border border-[#3A8FD4]/50 bg-[#3A8FD4]/10 text-[#5BB8F5] shadow-[0_0_10px_rgba(58,143,212,0.15)]'
                    : 'text-gray-400 hover:bg-[#1E3A5F]/20 hover:text-[#5BB8F5]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-[#1E3A5F]/30">
          <div className="flex items-center gap-2 mb-3">
            {user.avatar && <img src={user.avatar} alt="" className="h-8 w-8 rounded-full border border-[#1E3A5F]" />}
            <div className="text-xs">
              <div className="font-medium text-white">{user.username}</div>
              <div className="text-[#5BB8F5] uppercase">{user.role}</div>
            </div>
          </div>
          <button
            onClick={() => { clearToken(); navigate('/dashboard/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md text-gray-400 hover:bg-[#1E3A5F]/20 hover:text-[#5BB8F5] transition-all"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {user.is_frozen && (
          <div className="border-b border-[#1E3A5F]/50 bg-[#1E3A5F]/20 px-6 py-3 flex items-center gap-2 text-sm">
            <Snowflake className="h-4 w-4 text-[#5BB8F5]" />
            <span>Your account is <strong className="text-white">frozen</strong>. You can browse, but cannot make changes until unfrozen.</span>
          </div>
        )}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
