import { useState, useRef } from 'react';
import { ExternalLink, RefreshCw, Smartphone, Monitor, Tablet } from 'lucide-react';

type ViewMode = 'desktop' | 'tablet' | 'mobile';

const VIEWPORTS: Record<ViewMode, { width: string; label: string; icon: any }> = {
  desktop: { width: '100%',  label: 'Desktop', icon: Monitor },
  tablet:  { width: '768px', label: 'Tablet',  icon: Tablet },
  mobile:  { width: '390px', label: 'Mobile',  icon: Smartphone },
};

const PAGES = [
  { label: 'Home',     path: '/' },
  { label: 'Browse',   path: '/browse' },
  { label: 'About',    path: '/about' },
];

export default function PreviewPage() {
  const [mode, setMode] = useState<ViewMode>('desktop');
  const [page, setPage] = useState('/');
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = origin + page;

  const reload = () => setKey((k) => k + 1);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-8">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1E3A5F]/50 bg-[#0d1117] shrink-0 flex-wrap gap-y-2">
        <span className="text-sm font-semibold text-white whitespace-nowrap">Site Preview</span>

        {/* Page selector */}
        <div className="flex items-center gap-1 bg-[#0A0A0A] border border-[#1E3A5F]/60 rounded-lg p-1">
          {PAGES.map((p) => (
            <button
              key={p.path}
              onClick={() => setPage(p.path)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                page === p.path
                  ? 'bg-[#3A8FD4]/20 text-[#5BB8F5] border border-[#3A8FD4]/40'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Viewport selector */}
        <div className="flex items-center gap-1 bg-[#0A0A0A] border border-[#1E3A5F]/60 rounded-lg p-1">
          {(Object.keys(VIEWPORTS) as ViewMode[]).map((m) => {
            const { label, icon: Icon } = VIEWPORTS[m];
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                title={label}
                className={`p-1.5 rounded transition-all ${
                  mode === m
                    ? 'bg-[#3A8FD4]/20 text-[#5BB8F5] border border-[#3A8FD4]/40'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>

        {/* URL bar */}
        <div className="flex-1 min-w-0 flex items-center gap-2 bg-[#0A0A0A] border border-[#1E3A5F]/60 rounded-lg px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-xs text-gray-400 truncate font-mono">{url}</span>
        </div>

        <button
          onClick={reload}
          className="p-1.5 rounded border border-[#1E3A5F]/60 hover:border-[#3A8FD4]/50 hover:bg-[#3A8FD4]/10 text-gray-400 hover:text-[#5BB8F5] transition-all"
          title="Reload"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded border border-[#1E3A5F]/60 hover:border-[#3A8FD4]/50 hover:bg-[#3A8FD4]/10 text-gray-400 hover:text-[#5BB8F5] transition-all"
          title="Open in new tab"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Iframe area */}
      <div className="flex-1 overflow-auto bg-[#060606] flex items-start justify-center py-4 px-2">
        <div
          className="relative bg-white rounded-lg overflow-hidden transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
          style={{ width: VIEWPORTS[mode].width, maxWidth: '100%', height: '100%', minHeight: 500 }}
        >
          <iframe
            key={key}
            ref={iframeRef}
            src={url}
            title="Public site preview"
            className="w-full h-full border-0"
            style={{ minHeight: 600 }}
          />
        </div>
      </div>
    </div>
  );
}
