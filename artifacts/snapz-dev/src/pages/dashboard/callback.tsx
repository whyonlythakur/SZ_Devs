import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { exchangeDiscordCode, setToken } from '@/lib/dashboard-api';

export default function CallbackPage() {
  const [, navigate] = useLocation();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) {
      setErr('Missing authorization code.');
      return;
    }
    const redirectUri = `${window.location.origin}/dashboard/callback`;
    exchangeDiscordCode(code, redirectUri)
      .then((r) => {
        setToken(r.token);
        navigate('/dashboard');
      })
      .catch((e) => setErr(e.message));
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      {err ? (
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Login failed</h2>
          <p className="text-sm text-gray-400 mb-4">{err}</p>
          <a href="/dashboard/login" className="text-orange-400 underline">Try again</a>
        </div>
      ) : (
        <div>Signing you in…</div>
      )}
    </div>
  );
}
