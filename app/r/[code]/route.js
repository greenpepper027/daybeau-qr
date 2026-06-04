import { redirect } from 'next/navigation';
import { getLinkByCode, updateLinkClicks } from '@/lib/sheets';

export async function GET(req, { params }) {
  const { code } = await params;
  const link = await getLinkByCode(code);

  if (!link) {
    redirect('/not-found');
  }

  // increment clicks async (don't await — keep redirect fast)
  updateLinkClicks(code, link.clicks + 1).catch(() => {});

  redirect(link.original_url);
}
