import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getLinks, appendLink } from '@/lib/sheets';
import { nanoid } from 'nanoid';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const links = await getLinks();
  return Response.json(links);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, original_url, custom_code } = await req.json();
  if (!original_url) return Response.json({ error: 'original_url required' }, { status: 400 });

  const code = custom_code?.trim() || nanoid(7);
  const id = nanoid(21);

  // check duplicate code
  const existing = await getLinks();
  if (existing.some((l) => l.code === code)) {
    return Response.json({ error: '이미 사용 중인 코드입니다.' }, { status: 409 });
  }

  await appendLink({ id, code, title: title || '', original_url });
  return Response.json({ id, code, title, original_url }, { status: 201 });
}
