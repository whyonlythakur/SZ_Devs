import { notFound } from 'next/navigation';
import { codes } from '@/lib/data';
import { CodeDetailPageClient } from '@/components/code-detail-page-client';

export function generateStaticParams() {
  return codes.map((code) => ({ id: code.id.toString() }));
}

interface CodeDetailPageProps {
  params: {
    id: string;
  };
}

export default function CodeDetailPage({ params }: CodeDetailPageProps) {
  const codeId = Number(params.id);
  const code = codes.find((c) => c.id === codeId);

  if (!code) {
    notFound();
  }

  return <CodeDetailPageClient codeId={codeId} />;
}

