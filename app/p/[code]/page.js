import { getPageByCode } from '@/lib/sheets';
import { notFound } from 'next/navigation';
import PublicPage from './PublicPage';

export default async function Page({ params }) {
  const { code } = await params;
  const page = await getPageByCode(code);
  if (!page) notFound();
  return <PublicPage page={page} />;
}
