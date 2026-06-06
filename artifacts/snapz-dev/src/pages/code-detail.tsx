import { useParams } from 'wouter';
import { CodeDetailPageClient } from '@/components/code-detail-page-client';

export default function CodeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || '0', 10);
  return <CodeDetailPageClient codeId={id} />;
}
