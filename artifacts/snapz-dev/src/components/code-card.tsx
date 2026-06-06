import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Code } from '@/lib/data';

type CodeCardProps = Omit<Code, 'featured' | 'fullDescription' | 'files' | 'technologies' | 'features' | 'accessCode' | 'filelink'>;

const difficultyColors = {
  Beginner: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  Intermediate: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
  Advanced: 'bg-red-500/10 text-red-300 border border-red-500/20',
};

export function CodeCard({
  id,
  title,
  description,
  subcategory,
  difficulty,
  language,
  bannerImage,
}: CodeCardProps) {
  return (
    <Link href={`/codes/${id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-[#1E3A5F]/50 bg-[#111] transition-all duration-300 hover:border-[#3A8FD4]/60 hover:shadow-[0_0_20px_rgba(58,143,212,0.15)] hover:-translate-y-1 cursor-pointer">
        <div className="relative h-24 w-full overflow-hidden bg-[#0d1a2d]">
          {bannerImage ? (
            <img
              src={bannerImage}
              alt={title}
              className="h-full w-full object-cover opacity-75 group-hover:opacity-95 transition-opacity duration-300"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-[#1E3A5F] to-[#3A8FD4]/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
        </div>

        {/* Blue left border accent on hover */}
        <div className="absolute left-0 top-0 h-full w-0.5 bg-[#3A8FD4] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_rgba(58,143,212,0.8)]" />

        <div className="relative p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="text-balance pr-2 font-bold text-white transition-colors duration-300 group-hover:text-[#5BB8F5] line-clamp-2">
              {title}
            </h3>
            <span className={`whitespace-nowrap rounded px-2 py-1 text-xs font-medium ${difficultyColors[difficulty as keyof typeof difficultyColors] || 'bg-gray-500/10 text-gray-300'}`}>
              {difficulty}
            </span>
          </div>

          <p className="mb-4 text-sm text-gray-400 line-clamp-2">{description}</p>

          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-block rounded-full border border-[#1E3A5F] bg-[#1E3A5F]/30 px-3 py-1 text-xs text-[#5BB8F5]">
              {subcategory}
            </span>
            <span className="inline-block rounded-full border border-[#3A8FD4]/30 bg-[#3A8FD4]/10 px-3 py-1 text-xs text-[#3A8FD4]">
              {language}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#5BB8F5] opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span className="text-sm font-semibold" style={{ textShadow: '0 0 8px rgba(91,184,245,0.5)' }}>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
