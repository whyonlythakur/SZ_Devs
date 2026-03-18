import { notFound } from 'next/navigation';
import { codes } from '@/lib/data';
import { CodeDetailPageClient } from '@/components/code-detail-page-client';

export function generateStaticParams() {
  return codes.map((code) => ({ id: code.id.toString() }));
}

interface CodeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CodeDetailPage({ params }: CodeDetailPageProps) {
  const { id } = await params;
  const codeId = Number(id);
  const code = codes.find((c) => c.id === codeId);

  if (!code) {
    notFound();
  }

  return <CodeDetailPageClient codeId={codeId} />;
}

