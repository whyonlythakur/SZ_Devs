'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeDisplayProps {
  code: string;
  language: string;
  filename: string;
}

export function CodeDisplay({ code, language, filename }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-secondary/20 transition-smooth">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary/50" />
          <span className="text-sm font-mono text-muted-foreground">{filename}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium text-muted-foreground transition-smooth hover:bg-border hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
}
