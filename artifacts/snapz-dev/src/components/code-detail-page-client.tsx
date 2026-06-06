import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Lock } from 'lucide-react';
import type { Code } from '@/lib/data';
import { fetchBotById } from '@/lib/bots';
import { FileDirectory } from '@/components/file-directory';
import { Navbar } from '@/components/navbar';
import { AccessCodeModal } from '@/components/access-code-modal';

interface CodeDetailPageClientProps {
  codeId: number;
}

const difficultyColors = {
  Beginner: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  Intermediate: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
  Advanced: 'bg-red-500/10 text-red-300 border border-red-500/20',
};

export function CodeDetailPageClient({ codeId }: CodeDetailPageClientProps) {
  const [code, setCode] = useState<Code | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAccessModal, setShowAccessModal] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchBotById(codeId)
      .then((c) => { if (active) setCode(c); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [codeId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
          <p className="text-gray-500">Loading…</p>
        </div>
      </>
    );
  }

  if (!code) {
    return (
      <>
        <Navbar />
        <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-white">Code Not Found</h1>
            <p className="mb-8 text-gray-400">This snippet doesn't exist or is hidden.</p>
            <Link href="/codes"
              className="inline-flex items-center justify-center rounded-lg border border-[#3A8FD4] bg-[#3A8FD4]/10 px-6 py-3 font-semibold text-[#5BB8F5] transition-all hover:shadow-[0_0_16px_rgba(58,143,212,0.3)]">
              Back to Codes
            </Link>
          </div>
        </div>
      </>
    );
  }

  const displayCodeNumber = code.accessCode?.includes('#') ? code.accessCode.split('#').pop() : code.accessCode;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-[#0d1a2d]">
          {code.bannerImage ? (
            <img src={code.bannerImage} alt={code.title} className="h-full w-full object-cover opacity-70" />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-[#1E3A5F] to-[#3A8FD4]/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        </div>

        <div className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Header card */}
            <div className="relative z-10 -mt-20 mb-8 rounded-lg border border-[#1E3A5F] bg-[#111] p-8"
              style={{ boxShadow: '0 0 30px rgba(58,143,212,0.1)' }}>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">{code.title}</h1>
                    <span className={`rounded px-3 py-1 text-xs font-medium ${difficultyColors[code.difficulty as keyof typeof difficultyColors] || 'bg-gray-500/10 text-gray-300'}`}>
                      {code.difficulty}
                    </span>
                  </div>
                  <p className="text-lg text-gray-400">{code.description}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-[#1E3A5F]/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div />
                {code.accessCode && (
                  <button
                    onClick={() => setShowAccessModal(true)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#3A8FD4] bg-[#3A8FD4]/10 px-4 py-2 text-sm font-medium text-[#5BB8F5] transition-all hover:bg-[#3A8FD4]/20 hover:shadow-[0_0_16px_rgba(58,143,212,0.35)]"
                  >
                    <Lock className="h-4 w-4" />
                    Download Files
                    <span className="ml-1 rounded border border-[#3A8FD4]/30 bg-[#1E3A5F]/50 px-1.5 py-0.5 text-xs">
                      #{displayCodeNumber}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Meta grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Language', value: code.language },
                { label: 'Category', value: code.category },
              ].map((m) => (
                <div key={m.label} className="rounded-lg border border-[#1E3A5F]/40 bg-[#111]/50 p-4">
                  <div className="text-xs text-gray-500">{m.label}</div>
                  <div className="mt-1 font-semibold capitalize text-white">{m.value}</div>
                </div>
              ))}
              <div className="rounded-lg border border-[#1E3A5F]/40 bg-[#111]/50 p-4">
                <div className="text-xs text-gray-500">Technologies</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {code.technologies?.map((t) => (
                    <span key={t} className="inline-block rounded border border-[#1E3A5F] bg-[#1E3A5F]/30 px-2 py-0.5 text-xs font-medium text-[#5BB8F5]">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* About */}
            {code.fullDescription && (
              <div className="mb-8 rounded-lg border border-[#1E3A5F]/40 bg-[#111] p-6">
                <h2 className="mb-4 text-xl font-bold text-white">About This Code</h2>
                <p className="leading-relaxed text-gray-400">{code.fullDescription}</p>
              </div>
            )}

            {/* Files */}
            {code.files && code.files.length > 0 && (
              <div className="mb-8"><FileDirectory files={code.files} /></div>
            )}

            {/* Features */}
            {code.features && code.features.length > 0 && (
              <div className="mb-8 rounded-lg border border-[#1E3A5F]/40 bg-[#111] p-6">
                <h2 className="mb-4 text-xl font-bold text-white">Features</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {code.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#3A8FD4]"
                        style={{ boxShadow: '0 0 6px rgba(58,143,212,0.6)' }} />
                      <span className="text-gray-400">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <Link href="/codes"
                className="inline-flex items-center justify-center rounded-lg border border-[#1E3A5F] bg-[#111] px-6 py-3 font-semibold text-gray-300 transition-all hover:border-[#3A8FD4]/50 hover:text-[#5BB8F5] hover:shadow-[0_0_12px_rgba(58,143,212,0.2)]">
                ← Back to All Codes
              </Link>
            </div>
          </div>
        </div>

        {code.accessCode && code.filelink && (
          <AccessCodeModal
            isOpen={showAccessModal}
            onClose={() => setShowAccessModal(false)}
            codeTitle={code.title}
            codeNumber={displayCodeNumber}
            expectedAccessCode={code.accessCode}
            filelink={code.filelink}
          />
        )}
      </div>
    </>
  );
}
