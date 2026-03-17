'use client';

import { codes } from '@/lib/data';
import { FileDirectory } from '@/components/file-directory';
import { Navbar } from '@/components/navbar';
import { AccessCodeModal } from '@/components/access-code-modal';
import { Lock } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CodeDetailPage() {
  const params = useParams();
  const codeId = parseInt(params.id as string);
  const code = codes.find((c) => c.id === codeId);
  const [showAccessModal, setShowAccessModal] = useState(false);

  if (!code) {
    return (
      <>
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">Code Not Found</h1>
            <p className="mb-8 text-muted-foreground">The code snippet you're looking for doesn't exist.</p>
            <Link href="/codes" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-smooth hover:shadow-lg hover:shadow-primary/30">
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-secondary">
          {code.bannerImage ? (
            <Image
              src={code.bannerImage}
              alt={code.title}
              fill
              className="object-cover opacity-80"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-primary to-accent opacity-80" />
          )}
        </div>

        {/* Content */}
        <div className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8 rounded-lg border border-border bg-card p-8 -mt-20 relative z-10">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{code.title}</h1>
                    <span className={`rounded px-3 py-1 text-xs font-medium ${difficultyColors[code.difficulty as keyof typeof difficultyColors] || 'bg-gray-500/10 text-gray-300'}`}>
                      {code.difficulty}
                    </span>
                  </div>
                  <p className="mb-4 text-lg text-muted-foreground">{code.description}</p>
                </div>
              </div>

              {/* Stats and Actions */}
              <div className="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div></div>

                {code.accessCode && code.filelink && (
                  <button
                    onClick={() => setShowAccessModal(true)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:shadow-lg hover:shadow-primary/30"
                  >
                    <Lock className="h-4 w-4" />
                    Download Files
                    <span className="ml-1 rounded bg-primary-foreground/20 px-1.5 py-0.5 text-xs text-primary-foreground">
                      #{code.accessCode.replace('Code#', '')}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card/50 p-4">
                <div className="text-xs text-muted-foreground">Language</div>
                <div className="mt-1 font-semibold text-foreground">{code.language}</div>
              </div>
              <div className="rounded-lg border border-border bg-card/50 p-4">
                <div className="text-xs text-muted-foreground">Category</div>
                <div className="mt-1 font-semibold text-foreground capitalize">{code.category}</div>
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

            {/* Full Description */}
            <div className="mb-8 rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold text-foreground">About This Code</h2>
              <p className="text-muted-foreground leading-relaxed">{code.fullDescription}</p>
            </div>

            {/* File Directory */}
            {code.files && code.files.length > 0 && (
              <div className="mb-8">
                <FileDirectory files={code.files} />
              </div>
            )}

            {/* Features */}
            {code.features && code.features.length > 0 && (
              <div className="mb-8 rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-bold text-foreground">Features</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {code.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-12 flex justify-center">
              <Link href="/codes" className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 font-semibold text-foreground transition-smooth hover:border-primary hover:bg-card/80">
                ← Back to All Codes
              </Link>
            </div>
          </div>
        </div>

        {/* Access Code Modal */}
        {code.accessCode && code.filelink && (
          <AccessCodeModal
            isOpen={showAccessModal}
            onClose={() => setShowAccessModal(false)}
            correctCode={code.accessCode}
            filelink={code.filelink}
            codeTitle={code.title}
            codeNumber={code.accessCode.replace('Code#', '')}
          />
        )}
      </div>
    </>
  );
}
