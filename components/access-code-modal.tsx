'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Lock, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeTitle: string;
  codeNumber?: string;
  botId?: string;
}

export function AccessCodeModal({
  isOpen,
  onClose,
  codeTitle,
  codeNumber,
  botId,
}: AccessCodeModalProps) {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputCodeRef = useRef(inputCode);

  useEffect(() => {
    inputCodeRef.current = inputCode;
  }, [inputCode]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const enteredCode = inputCodeRef.current.trim().toUpperCase();

    try {
      let query = supabase
        .from('access_codes')
        .select('code, is_active, expiry_date, bot_id, bots(file_url)')
        .eq('is_active', true)
        .ilike('code', enteredCode);

      if (botId) {
        query = query.eq('bot_id', botId);
      }

      const { data, error: dbError } = await query.maybeSingle();

      if (dbError) {
        console.error('Database error:', dbError);
        setError('Unable to verify access code right now. Please try again.');
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Invalid access code. Please try again.');
        setLoading(false);
        return;
      }

      if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
        setError('This access code has expired.');
        setLoading(false);
        return;
      }

      const botData = data.bots as { file_url?: string } | null;
      const downloadUrl = botData?.file_url;

      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
        setInputCode('');
        onClose();
      } else {
        setError('Download link not found for this code.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Unable to verify access code right now. Please try again.');
    }

    setLoading(false);
  }, [botId, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-fadeInUp w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-lg shadow-primary/20">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Access Code Required</h2>
              <p className="text-sm text-muted-foreground">For: {codeTitle}</p>
              {codeNumber && (
                <p className="text-sm text-primary font-medium mt-1">Code No. :- {codeNumber}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-smooth hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="accessCode" className="mb-2 block text-sm font-medium text-foreground">
              Enter Discord Channel Access Code
            </label>
            <input
              id="accessCode"
              type="text"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value);
                setError('');
              }}
              placeholder="e.g., Code#000"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled={loading}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="rounded-lg bg-secondary/30 p-3">
            <p className="text-xs text-muted-foreground">
              💡 Tip: The access code is shared in the Snap-Z Development Discord channel. Join our community to{' '}
              <a
                href="https://discord.gg/NHy5Gj7Jw7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                get the code!
              </a>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2.5 font-medium text-foreground transition-smooth hover:bg-secondary/50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-smooth hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
