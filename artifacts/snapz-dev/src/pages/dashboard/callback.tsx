import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiFetch } from '@/lib/api-client';
import { setToken } from '@/lib/dashboard-api';

export default function CallbackPage() {
  const [, navigate] = useLocation();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code  = params.get('code');
    const error = params.get('error');

    if (error || !code) {
      setErr(error === 'access_denied' ? 'You cancelled the Discord login.' : (error ?? 'No code returned from Discord.'));
      return;
    }

    const redirectUri = `${window.location.origin}/dashboard/callback`;

    apiFetch('/api/auth/discord/callback', {
      method: 'POST',
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    })
      .then((r) => {
        setToken(r.token);
        navigate('/dashboard');
      })
      .catch((e) => {
        setErr(e.message ?? 'Login failed');
      });
  }, [navigate]);

  if (err) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4">
        <div className="max-w-md w-full border border-red-500/30 bg-[#111] rounded-xl p-8 text-center">
          <div className="text-red-400 text-lg font-semibold mb-2">Login failed</div>
          <p className="text-gray-400 text-sm mb-6">{err}</p>
          <a
            href="/dashboard/login"
            className="text-[#5BB8F5] hover:underline text-sm"
          >
            ← Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]"
      style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(58,143,212,0.08) 0%, transparent 60%)' }}
    >
      <div className="text-center">
        <div className="h-10 w-10 border-2 border-[#3A8FD4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Verifying your Discord roles…</p>
      </div>
    </div>
  );
}
