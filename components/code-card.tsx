import { Heart, Eye, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Code } from '@/lib/data';

type CodeCardProps = Omit<Code, 'featured' | 'fullDescription' | 'files' | 'technologies' | 'features' | 'accessCode' | 'googleDriveLink'>;

const difficultyColors = {
  Beginner: 'bg-emerald-500/10 text-emerald-300',
  Intermediate: 'bg-yellow-500/10 text-yellow-300',
  Advanced: 'bg-red-500/10 text-red-300',
};

export function CodeCard({
  id,
  title,
  description,
  subcategory,
  difficulty,
  language,
  views,
  likes,
  bannerImage,
}: CodeCardProps) {
  return (
    <Link href={`/codes/${id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-smooth hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-pointer">
        {/* Banner Image */}
        <div className="relative h-24 w-full overflow-hidden bg-secondary">
          {bannerImage ? (
            <Image
              src={bannerImage}
              alt={title}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-primary to-accent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative p-6">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="text-balance pr-2 font-bold text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-2">
              {title}
            </h3>
            <span
              className={`whitespace-nowrap rounded px-2 py-1 text-xs font-medium ${
                difficultyColors[difficulty as keyof typeof difficultyColors] ||
                'bg-gray-500/10 text-gray-300'
              }`}
            >
              {difficulty}
            </span>
          </div>

          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {subcategory}
            </span>
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
              {language}
            </span>
          </div>

          <div className="flex items-center gap-2 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span className="text-sm font-semibold">View Details</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
