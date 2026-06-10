import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiFetch } from '@/lib/api-client';
import { setToken } from '@/lib/dashboard-api';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    // If we already have a token from a previous session, go straight to dashboard
    const existing = localStorage.getItem('snapz_staff_session');
    if (existing) navigate('/dashboard');
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setErr(null);
    try {
      // Ask the API server for the OAuth URL so the redirect_uri is correct
      const redirectUri = `${window.location.origin}/dashboard/callback`;
      const { url } = await apiFetch(`/api/auth/discord/url?redirect_uri=${encodeURIComponent(redirectUri)}`);
      window.location.href = url;
    } catch (e: any) {
      setErr(e.message ?? 'Failed to start login');
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
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Snapz Development"
            className="h-16 w-16 mx-auto rounded-xl object-contain mb-4"
            style={{ filter: 'drop-shadow(0 0 12px rgba(91,184,245,0.5))' }}
          />
          <h1 className="text-2xl font-bold text-white">Staff Dashboard</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Sign in with your Discord account. Access is granted based on your role in the Snap-Z server.
          </p>
        </div>

        {err && (
          <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center">
            {err}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(88,101,242,0.4)]"
        >
          {loading ? (
            <span className="animate-pulse">Redirecting…</span>
          ) : (
            <>
              <DiscordIcon />
              Login with Discord
            </>
          )}
        </button>

        <p className="mt-6 text-xs text-gray-600 text-center">
          Only Snap-Z staff with a valid server role can access the dashboard.
        </p>
      </div>
    </div>
  );
}

function DiscordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );
}
