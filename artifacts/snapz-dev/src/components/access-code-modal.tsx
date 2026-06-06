import { useState, useCallback } from 'react';
import { Lock, X } from 'lucide-react';

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeTitle: string;
  codeNumber?: string;
  expectedAccessCode: string;
  filelink: string;
}

export function AccessCodeModal({
  isOpen,
  onClose,
  codeTitle,
  codeNumber,
  expectedAccessCode,
  filelink,
}: AccessCodeModalProps) {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const entered = inputCode.trim().toUpperCase();
    const expected = expectedAccessCode.trim().toUpperCase();
    if (entered === expected) {
      window.open(filelink, '_blank');
      setInputCode('');
      onClose();
    } else {
      setError('Invalid access code. Please try again.');
    }
    setLoading(false);
  }, [inputCode, expectedAccessCode, filelink, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="animate-fadeInUp w-full max-w-md rounded-lg border border-[#1E3A5F] bg-[#111] p-8"
        style={{ boxShadow: '0 0 40px rgba(58,143,212,0.2), 0 0 80px rgba(58,143,212,0.08)' }}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#1E3A5F] bg-[#1E3A5F]/30"
              style={{ boxShadow: '0 0 12px rgba(58,143,212,0.3)' }}>
              <Lock className="h-6 w-6 text-[#5BB8F5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Access Code Required</h2>
              <p className="text-sm text-gray-400">For: {codeTitle}</p>
              {codeNumber && (
                <p className="text-sm text-[#5BB8F5] font-medium mt-0.5">Code No. :- {codeNumber}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="accessCode" className="mb-2 block text-sm font-medium text-gray-300">
              Enter Discord Channel Access Code
            </label>
            <input
              id="accessCode"
              type="text"
              value={inputCode}
              onChange={(e) => { setInputCode(e.target.value); setError(''); }}
              placeholder="e.g., DISCORD-MUSIC-001"
              className="w-full rounded-lg border border-[#1E3A5F] bg-[#0A0A0A] px-4 py-2.5 text-white placeholder-gray-600 transition-all focus:border-[#3A8FD4] focus:outline-none focus:ring-2 focus:ring-[#3A8FD4]/30"
              style={{ boxShadow: 'none' }}
              disabled={loading}
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <div className="rounded-lg border border-[#1E3A5F]/50 bg-[#1E3A5F]/10 p-3">
            <p className="text-xs text-gray-400">
              💡 <span className="text-[#5BB8F5]">Tip:</span> The access code is shared in the Snap-Z Development Discord channel. Join our community to{' '}
              <a href="https://discord.gg/NHy5Gj7Jw7" target="_blank" rel="noopener noreferrer"
                className="text-[#5BB8F5] font-medium hover:underline" style={{ textShadow: '0 0 6px rgba(91,184,245,0.4)' }}>
                get the code!
              </a>
            </p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} disabled={loading}
              className="flex-1 rounded-lg border border-[#1E3A5F] bg-transparent px-4 py-2.5 font-medium text-gray-300 transition-all hover:border-[#3A8FD4]/40 hover:bg-[#1E3A5F]/20">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 rounded-lg border border-[#3A8FD4] bg-[#3A8FD4]/10 px-4 py-2.5 font-medium text-[#5BB8F5] transition-all hover:bg-[#3A8FD4]/20 hover:shadow-[0_0_16px_rgba(58,143,212,0.4)] disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
