import { CodeDetailPageClient } from '@/components/code-detail-page-client';
import { fetchAllVisibleBotIds } from '@/lib/bots';

export const dynamicParams = true;

export async function generateStaticParams() {
  const ids = await fetchAllVisibleBotIds();
  return ids.map((id) => ({ id: id.toString() }));
}

interface CodeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CodeDetailPage({ params }: CodeDetailPageProps) {
  const { id } = await params;
  return <CodeDetailPageClient codeId={Number(id)} />;
}
