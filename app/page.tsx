'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { CodeCard } from '@/components/code-card';
import { codes, stats as defaultStats } from '@/lib/data';
import { ArrowRight, Github, Youtube, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';

const YOUTUBE_URL = 'https://youtube.com/@whyonlythakur';

export default function Home() {
  const featuredCodes = codes.filter((code) => code.id === 1);
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    async function fetchYouTubeStats() {
      try {
        const response = await fetch('/api/youtube-stats');
        const data = await response.json();
        
        if (data.subscribers !== undefined) {
          // Filter to only show codes that are visible on the website
          const visibleCodes = codes.filter((code) => code.id === 1);
          const codeSnippets = visibleCodes.length;
          const totalViews = codes.reduce((sum, code) => sum + code.views, 0);
          
          const formatNumber = (num: number) => {
            if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            return num.toString();
          };
          
          setStats([
            { value: codeSnippets.toString(), label: 'Code Snippets', description: 'Ready to use' },
            { value: formatNumber(data.totalViews), label: 'Total Views', description: 'On our channel' },
            { value: formatNumber(data.subscribers), label: 'Community', description: 'Subscribers' },
            { value: data.videoCount.toString(), label: 'Tutorials', description: 'On YouTube' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch YouTube stats:', error);
      }
    }
    
    fetchYouTubeStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a0800 25%, #2d0e00 50%, #1a0800 75%, #000000 100%)' }}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-1/4 top-1/4 h-[500px] w-[500px] rounded-full blur-3xl animate-pulse-glow" style={{ background: 'radial-gradient(circle, rgba(255,110,0,0.25) 0%, transparent 70%)' }} />
          <div className="absolute -right-1/4 top-1/3 h-[400px] w-[400px] rounded-full blur-3xl animate-pulse-glow" style={{ background: 'radial-gradient(circle, rgba(255,110,0,0.2) 0%, transparent 70%)', animationDelay: '1s' }} />
          <div className="absolute left-1/3 bottom-0 h-[300px] w-[600px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,110,0,0.1) 0%, transparent 70%)' }} />
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="animate-fadeInUp mb-6 inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary transition-smooth">
   <span className="mr-2 font-mono font-bold opacity-80" aria-hidden="true">
      &gt;_
   </span>
   Snap-Z Development
</div>


            <h1 className="animate-fadeInUp mb-6 text-4xl font-bold text-balance leading-tight text-foreground sm:text-5xl lg:text-6xl" style={{ animationDelay: '0.1s' }}>
              Welcome to <br />
              Snap-Z Development
            </h1>

            <p className="animate-fadeInUp mb-8 text-balance text-lg text-muted-foreground sm:text-xl" style={{ animationDelay: '0.2s' }}>
              Professional Discord Bot Development. Download source codes, watch tutorials, and build powerful bots.
            </p>

            <div className="animate-fadeInUp flex flex-col gap-4 sm:flex-row justify-center" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/codes"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-smooth hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
              >
                Explore All Codes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 font-semibold text-foreground transition-smooth hover:border-primary hover:shadow-lg hover:bg-card/80"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mb-1 text-sm font-medium text-foreground">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Codes Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 animate-fadeInUp">
            <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
              Featured Code Snippets
            </h2>
            <p className="text-lg text-muted-foreground">
              Handpicked tutorials and code examples to get you started
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCodes.map((code, idx) => (
              <div key={code.id} className="animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CodeCard {...code} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/codes"
              className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-6 py-3 font-semibold text-primary transition-all duration-300 hover:bg-primary/20"
            >
              View All Snippets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-4 font-bold text-foreground">Snap-Z Development</h3>
              <p className="text-sm text-muted-foreground">
                Creating quality web development tutorials and code snippets.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/codes"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Code Snippets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2024 Snap-Z Development. All rights reserved. Built with{' '}
              <span className="text-primary">Next.js</span> and{' '}
              <span className="text-accent">Tailwind CSS</span>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
