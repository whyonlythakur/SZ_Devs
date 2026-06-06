import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { dashApi, clearToken, getToken, StaffUser } from '@/lib/dashboard-api';
import { LayoutDashboard, Bot, Users, ScrollText, LogOut, Snowflake } from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['founder','ceo','coo','cto'] },
  { href: '/dashboard/bots', label: 'Bots', icon: Bot, roles: ['founder','ceo','coo','cto'] },
  { href: '/dashboard/staff', label: 'Staff', icon: Users, roles: ['founder','ceo'] },
  { href: '/dashboard/audit', label: 'Audit Log', icon: ScrollText, roles: ['founder','ceo'] },
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
    if (!getToken()) {
      navigate('/dashboard/login');
      return;
    }
    dashApi.me()
      .then((r) => setUser(r.user))
      .catch(() => {
        clearToken();
        navigate('/dashboard/login');
      })
      .finally(() => setLoading(false));
  }, [location, navigate]);

  if (location === '/dashboard/login' || location === '/dashboard/callback') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading…
      </div>
    );
  }

  if (!user) return null;

  const visibleNav = NAV.filter((n) => n.roles.includes(user.role));

  return (
    <div className="min-h-screen flex bg-black text-white">
      <aside className="w-60 border-r border-orange-900/30 bg-gradient-to-b from-black to-[#1a0800] p-4 flex flex-col">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-bold">Z</div>
            <div>
              <div className="text-sm font-bold">Snap-Z</div>
              <div className="text-xs text-orange-400">Staff Dashboard</div>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {visibleNav.map((n) => {
            const Icon = n.icon;
            const active = location === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${active ? 'bg-orange-600/20 text-orange-300' : 'text-gray-300 hover:bg-white/5'}`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            {user.avatar && <img src={user.avatar} alt="" className="h-8 w-8 rounded-full" />}
            <div className="text-xs">
              <div className="font-medium">{user.username}</div>
              <div className="text-orange-400 uppercase">{user.role}</div>
            </div>
          </div>
          <button
            onClick={() => { clearToken(); navigate('/dashboard/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md text-gray-300 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {user.is_frozen && (
          <div className="bg-blue-900/40 border-b border-blue-500/50 px-6 py-3 flex items-center gap-2 text-sm">
            <Snowflake className="h-4 w-4 text-blue-300" />
            <span>Your account is <strong>frozen</strong>. You can browse, but cannot make changes until a Founder or CEO unfreezes you.</span>
          </div>
        )}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
