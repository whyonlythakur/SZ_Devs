import { useState } from 'react';
import { useLocation } from 'wouter';
import { dashApi, setToken } from '@/lib/dashboard-api';
import { KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [key, setKey] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const r = await dashApi.login(key.trim());
      setToken(r.token);
      navigate('/dashboard');
    } catch (e: any) {
      setErr(e.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4"
      style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(58,143,212,0.08) 0%, transparent 60%)' }}
    >
      <div
        className="max-w-md w-full border border-[#1E3A5F] bg-[#111] rounded-xl p-8"
        style={{ boxShadow: '0 0 40px rgba(58,143,212,0.12)' }}
      >
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Snapz Development"
            className="h-16 w-16 mx-auto rounded-xl object-contain mb-4"
            style={{ filter: 'drop-shadow(0 0 12px rgba(91,184,245,0.5))' }}
          />
          <h1 className="text-2xl font-bold text-white">Staff Dashboard</h1>
          <p className="text-gray-400 mt-2 text-sm">Enter your dashboard API key to continue.</p>
        </div>

        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">API Key</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your dashboard key"
                className="w-full bg-[#0A0A0A] border border-[#1E3A5F] rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#3A8FD4] transition-colors"
                autoFocus
                required
              />
            </div>
          </div>

          {err && <p className="text-sm text-red-400">{err}</p>}

          <button
            type="submit"
            disabled={loading || !key.trim()}
            className="w-full border border-[#3A8FD4]/60 bg-[#3A8FD4]/10 hover:bg-[#3A8FD4]/20 disabled:opacity-50 text-[#5BB8F5] font-semibold py-3 rounded-lg transition-all hover:shadow-[0_0_16px_rgba(58,143,212,0.35)]"
          >
            {loading ? 'Verifying…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-600 text-center">
          Access is restricted to Snap-Z staff only.
        </p>
      </div>
    </div>
  );
}
