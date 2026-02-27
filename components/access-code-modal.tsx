'use client';

import { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctCode: string;
  driveLink: string;
  codeTitle: string;
  codeNumber?: string;
}

export function AccessCodeModal({
  isOpen,
  onClose,
  correctCode,
  driveLink,
  codeTitle,
  codeNumber,
}: AccessCodeModalProps) {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (inputCode.trim().toUpperCase() === correctCode.toUpperCase()) {
      // Redirect to Google Drive
      window.open(driveLink, '_blank');
      setInputCode('');
      onClose();
    } else {
      setError('Invalid access code. Please try again.');
    }
    setLoading(false);
  };

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
              placeholder="e.g., REACT001"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled={loading}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <div className="rounded-lg bg-secondary/30 p-3">
            <p className="text-xs text-muted-foreground">
              💡 Tip: The access code is shared in the Snap-Z Development Discord channel. Join our community to {" "}
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
