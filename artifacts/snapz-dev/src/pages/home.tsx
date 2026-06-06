import { Link } from 'wouter';
import { Navbar } from '@/components/navbar';
import { CodeCard } from '@/components/code-card';
import { stats as defaultStats, type Code } from '@/lib/data';
import { fetchVisibleBots } from '@/lib/bots';
import { ArrowRight, Github, Youtube, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';

const YOUTUBE_URL = 'https://youtube.com/@SnapZ_HQ';

export default function Home() {
  const [codes, setCodes] = useState<Code[]>([]);
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    fetchVisibleBots().then(setCodes);
  }, []);

  const featuredCodes = codes.filter((c) => c.featured).length > 0
    ? codes.filter((c) => c.featured)
    : codes.slice(0, 6);

  useEffect(() => {
    async function fetchYouTubeStats() {
      try {
        const YOUTUBE_API_KEY = 'AIzaSyCJXtZQT-6OI2vjNTLZhlNR5qiZcUHZq7A';
        const CHANNEL_HANDLE = '@SnapZ_HQ';
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?forHandle=${CHANNEL_HANDLE}&part=statistics&key=${YOUTUBE_API_KEY}`
        );
        const channelData = await response.json();
        if (channelData.items && channelData.items.length > 0) {
          const ytStats = channelData.items[0].statistics;
          const fmt = (n: number) => {
            if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            return n.toString();
          };
          setStats([
            { value: codes.length.toString(), label: 'Code Snippets', description: 'Ready to use' },
            { value: fmt(parseInt(ytStats.viewCount || '0')), label: 'Total Views', description: 'On our channel' },
            { value: fmt(parseInt(ytStats.subscriberCount || '0')), label: 'Community', description: 'Subscribers' },
            { value: ytStats.videoCount || '0', label: 'Tutorials', description: 'On YouTube' },
          ]);
        }
      } catch (e) {
        console.error('YouTube stats:', e);
      }
    }
    fetchYouTubeStats();
  }, [codes.length]);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-36 sm:px-6 lg:px-8">
        {/* Background glow orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-1/4 top-1/4 h-[500px] w-[500px] rounded-full blur-3xl animate-pulse-glow"
            style={{ background: 'radial-gradient(circle, rgba(58,143,212,0.18) 0%, transparent 70%)' }} />
          <div className="absolute -right-1/4 top-1/3 h-[400px] w-[400px] rounded-full blur-3xl animate-pulse-glow"
            style={{ background: 'radial-gradient(circle, rgba(91,184,245,0.12) 0%, transparent 70%)', animationDelay: '1.5s' }} />
          <div className="absolute left-1/2 bottom-0 h-[200px] w-[600px] -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(30,58,95,0.4) 0%, transparent 70%)' }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(91,184,245,1) 1px, transparent 1px), linear-gradient(90deg, rgba(91,184,245,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fadeInUp mb-6 inline-flex items-center gap-2 rounded-full border border-[#1E3A5F] bg-[#1E3A5F]/20 px-4 py-1.5 text-sm text-[#5BB8F5]"
            style={{ boxShadow: '0 0 12px rgba(58,143,212,0.2)' }}>
            <span className="font-mono font-bold opacity-80">&gt;_</span>
            Snap-Z Development
          </div>

          <h1 className="animate-fadeInUp mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            style={{ animationDelay: '0.1s' }}>
            Welcome to{' '}
            <span className="text-[#5BB8F5]" style={{ textShadow: '0 0 20px rgba(91,184,245,0.5)' }}>
              Snap-Z Development
            </span>
          </h1>

          <p className="animate-fadeInUp mb-10 text-lg text-gray-400 sm:text-xl"
            style={{ animationDelay: '0.2s' }}>
            Professional Discord Bot Development. Download source codes, watch tutorials, and build powerful bots.
          </p>

          <div className="animate-fadeInUp flex flex-col gap-4 sm:flex-row justify-center"
            style={{ animationDelay: '0.3s' }}>
            <Link
              href="/codes"
              className="inline-flex items-center justify-center rounded-lg border border-[#3A8FD4] bg-[#3A8FD4]/10 px-6 py-3 font-semibold text-[#5BB8F5] transition-all duration-300 hover:bg-[#3A8FD4]/20 hover:shadow-[0_0_20px_rgba(58,143,212,0.4)] hover:scale-105"
            >
              Explore All Codes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-[#1E3A5F] bg-transparent px-6 py-3 font-semibold text-white transition-all duration-300 hover:border-[#3A8FD4]/50 hover:bg-[#1E3A5F]/20"
            >
              Watch on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#1E3A5F]/40 bg-[#0d1117] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="mb-2 text-3xl font-bold text-[#5BB8F5] sm:text-4xl"
                  style={{ textShadow: '0 0 12px rgba(91,184,245,0.4)' }}>
                  {stat.value}
                </div>
                <div className="mb-1 text-sm font-medium text-white">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured codes */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 animate-fadeInUp">
            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
              Featured <span className="text-[#5BB8F5]">Code Snippets</span>
            </h2>
            <p className="text-gray-400">Handpicked tutorials and code examples to get you started</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCodes.map((code, idx) => (
              <div key={code.id} className="animate-fadeInUp" style={{ animationDelay: `${idx * 0.08}s` }}>
                <CodeCard {...code} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/codes"
              className="inline-flex items-center gap-2 rounded-lg border border-[#3A8FD4]/50 bg-[#3A8FD4]/10 px-6 py-3 font-semibold text-[#5BB8F5] transition-all duration-300 hover:bg-[#3A8FD4]/20 hover:shadow-[0_0_16px_rgba(58,143,212,0.3)]"
            >
              View All Snippets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E3A5F]/40 bg-[#0d1117] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid gap-8 sm:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <img src="/logo.png" alt="Snapz Development" className="h-8 w-8 rounded object-contain" />
                <h3 className="font-bold text-white">Snap-Z <span className="text-[#5BB8F5]">Development</span></h3>
              </div>
              <p className="text-sm text-gray-500">Creating quality web development tutorials and code snippets.</p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/codes" className="text-gray-400 hover:text-[#5BB8F5] transition-colors">Code Snippets</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-[#5BB8F5] transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-[#5BB8F5] transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Follow Us</h4>
              <div className="flex gap-4">
                {[Youtube, Github, Twitter].map((Icon, i) => (
                  <a key={i} href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"
                    className="text-gray-500 transition-all hover:text-[#5BB8F5]"
                    style={{ transition: 'color 0.2s, text-shadow 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'drop-shadow(0 0 6px rgba(91,184,245,0.7))'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}>
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-[#1E3A5F]/30 pt-8 text-center text-sm text-gray-600">
            <p>
              &copy; 2024 Snap-Z Development. All rights reserved. Built with{' '}
              <span className="text-[#3A8FD4]">React</span> and{' '}
              <span className="text-[#5BB8F5]">Tailwind CSS</span>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
