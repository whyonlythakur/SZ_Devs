import { CodeFile } from '@/lib/data';
import { ChevronDown, ChevronRight, File } from 'lucide-react';
import { useState } from 'react';

interface FileDirectoryProps {
  files: CodeFile[];
}

export function FileDirectory({ files }: FileDirectoryProps) {
  const [expandedFiles, setExpandedFiles] = useState<string[]>([]);

  const toggle = (name: string) =>
    setExpandedFiles((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );

  return (
    <div className="rounded-lg border border-[#1E3A5F]/40 bg-[#111] p-6">
      <h2 className="mb-6 text-xl font-bold text-white">Project Files</h2>

      <div className="space-y-2">
        {files.map((file) => {
          const isExpanded = expandedFiles.includes(file.name);
          const lines = file.code.split('\n').length;

          return (
            <div key={file.name} className="animate-fadeInUp">
              <button
                onClick={() => toggle(file.name)}
                className="w-full flex items-center gap-3 rounded-lg border border-[#1E3A5F]/50 bg-[#0d1a2d]/40 px-4 py-3 text-left transition-all hover:border-[#3A8FD4]/40 hover:bg-[#1E3A5F]/20"
              >
                <div className="flex items-center gap-2">
                  {isExpanded
                    ? <ChevronDown className="h-4 w-4 text-[#5BB8F5]" />
                    : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  <File className="h-4 w-4 text-[#3A8FD4]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{file.name}</span>
                    <span className="text-xs border border-[#1E3A5F] bg-[#1E3A5F]/30 text-[#5BB8F5] px-2 py-0.5 rounded">
                      {file.language}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{lines} lines</span>
              </button>

              {isExpanded && (
                <div className="mt-2 ml-4 rounded-lg border border-[#1E3A5F]/30 bg-[#0A0A0A]/80 p-4 overflow-hidden animate-slideInFromLeft">
                  <div className="font-mono text-xs leading-relaxed max-h-96 overflow-y-auto">
                    {file.code.split('\n').slice(0, 15).map((line, idx) => (
                      <div key={idx} className="flex gap-3">
                        <span className="min-w-8 text-right text-gray-600 select-none">{idx + 1}</span>
                        <span className="text-gray-300">{line || ' '}</span>
                      </div>
                    ))}
                    {lines > 15 && (
                      <div className="mt-2 text-center text-gray-500 text-xs py-2">
                        … and {lines - 15} more lines
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-[#1E3A5F]/30 bg-[#1E3A5F]/10 p-4">
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-[#5BB8F5]">Note:</span> Click any file to preview its contents. Use "Download Files" and enter your access code to get all files.
        </p>
      </div>
    </div>
  );
}
