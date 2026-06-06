import { CodeFile } from '@/lib/data';
import { ChevronDown, ChevronRight, File } from 'lucide-react';
import { useState } from 'react';

interface FileDirectoryProps {
  files: CodeFile[];
}

export function FileDirectory({ files }: FileDirectoryProps) {
  const [expandedFiles, setExpandedFiles] = useState<string[]>([]);

  const toggleFile = (fileName: string) => {
    setExpandedFiles((prev) =>
      prev.includes(fileName)
        ? prev.filter((f) => f !== fileName)
        : [...prev, fileName]
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-6 text-xl font-bold text-foreground">Project Files</h2>

      <div className="space-y-2">
        {files.map((file) => {
          const isExpanded = expandedFiles.includes(file.name);
          const fileLines = file.code.split('\n').length;

          return (
            <div key={file.name} className="animate-fadeInUp">
              <button
                onClick={() => toggleFile(file.name)}
                className="w-full flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-4 py-3 text-left transition-smooth hover:border-primary/50 hover:bg-secondary/50"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-primary" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <File className="h-4 w-4 text-accent" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{file.name}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {file.language}
                    </span>
                  </div>
                </div>

                <span className="text-xs text-muted-foreground">
                  {fileLines} lines
                </span>
              </button>

              {isExpanded && (
                <div className="mt-2 ml-4 rounded-lg border border-border/30 bg-background/50 p-4 overflow-hidden animate-slideInFromLeft">
                  <div className="font-mono text-xs text-muted-foreground leading-relaxed max-h-96 overflow-y-auto">
                    {file.code.split('\n').slice(0, 15).map((line, idx) => (
                      <div key={idx} className="flex gap-3">
                        <span className="min-w-8 text-right text-muted-foreground/50 select-none">
                          {idx + 1}
                        </span>
                        <span className="text-foreground/80">{line || ' '}</span>
                      </div>
                    ))}
                    {fileLines > 15 && (
                      <div className="mt-2 text-center text-muted-foreground text-xs py-2">
                        ... and {fileLines - 15} more lines
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg bg-accent/5 border border-accent/20 p-4">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-accent">Note:</span> Click on any file to preview its contents. To download all files, click the "Download Files" button and enter your access code.
        </p>
      </div>
    </div>
  );
}
