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
        <div className="flex h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </>
    );
  }

  if (!code) {
    return (
      <>
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">Code Not Found</h1>
            <p className="mb-8 text-muted-foreground">The code snippet you're looking for doesn't exist or is hidden.</p>
            <Link
              href="/codes"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-smooth hover:shadow-lg hover:shadow-primary/30"
            >
              Back to Codes
            </Link>
          </div>
        </div>
      </>
    );
  }

  const difficultyColors = {
    Beginner: 'bg-emerald-500/10 text-emerald-300',
    Intermediate: 'bg-yellow-500/10 text-yellow-300',
    Advanced: 'bg-red-500/10 text-red-300',
  };

  const displayCodeNumber = code.accessCode?.includes('#') ? code.accessCode.split('#').pop() : code.accessCode;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="relative h-48 w-full overflow-hidden bg-secondary">
          {code.bannerImage ? (
            <img src={code.bannerImage} alt={code.title} className="h-full w-full object-cover opacity-80" />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-primary to-accent opacity-80" />
          )}
        </div>

        <div className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="relative z-10 -mt-20 mb-8 rounded-lg border border-border bg-card p-8">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{code.title}</h1>
                    <span
                      className={`rounded px-3 py-1 text-xs font-medium ${difficultyColors[code.difficulty as keyof typeof difficultyColors] || 'bg-gray-500/10 text-gray-300'}`}
                    >
                      {code.difficulty}
                    </span>
                  </div>
                  <p className="mb-4 text-lg text-muted-foreground">{code.description}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div></div>
                {code.accessCode && (
                  <button
                    onClick={() => setShowAccessModal(true)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:shadow-lg hover:shadow-primary/30"
                  >
                    <Lock className="h-4 w-4" />
                    Download Files
                    <span className="ml-1 rounded bg-primary-foreground/20 px-1.5 py-0.5 text-xs text-primary-foreground">
                      #{displayCodeNumber}
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card/50 p-4">
                <div className="text-xs text-muted-foreground">Language</div>
                <div className="mt-1 font-semibold text-foreground">{code.language}</div>
              </div>
              <div className="rounded-lg border border-border bg-card/50 p-4">
                <div className="text-xs text-muted-foreground">Category</div>
                <div className="mt-1 font-semibold capitalize text-foreground">{code.category}</div>
              </div>
              <div className="rounded-lg border border-border bg-card/50 p-4">
                <div className="text-xs text-muted-foreground">Technologies</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {code.technologies && code.technologies.map((tech) => (
                    <span key={tech} className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {code.fullDescription && (
              <div className="mb-8 rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-bold text-foreground">About This Code</h2>
                <p className="leading-relaxed text-muted-foreground">{code.fullDescription}</p>
              </div>
            )}

            {code.files && code.files.length > 0 && (
              <div className="mb-8">
                <FileDirectory files={code.files} />
              </div>
            )}

            {code.features && code.features.length > 0 && (
              <div className="mb-8 rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-bold text-foreground">Features</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {code.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <Link
                href="/codes"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 font-semibold text-foreground transition-smooth hover:border-primary hover:bg-card/80"
              >
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
