import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPages, appendPage } from '@/lib/sheets';
import { nanoid } from 'nanoid';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const pages = await getPages();
  return Response.json(pages);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, subtitle, theme_color, items, config, custom_code } = body;

  const code = custom_code?.trim() || nanoid(7);
  const id = nanoid(21);

  const existing = await getPages();
  if (existing.some((p) => p.code === code)) {
    return Response.json({ error: '이미 사용 중인 코드입니다.' }, { status: 409 });
  }

  await appendPage({ id, code, title: title || '', subtitle: subtitle || '', theme_color: theme_color || '#f43f5e', items: items || [], config: config || {} });
  return Response.json({ id, code, title, subtitle, theme_color, items, config }, { status: 201 });
}
