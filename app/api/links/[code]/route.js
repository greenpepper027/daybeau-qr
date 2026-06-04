import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteLink, updateLink } from '@/lib/sheets';

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { code } = await params;
  const body = await req.json();
  await updateLink(code, body);
  return Response.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { code } = await params;
  await deleteLink(code);
  return Response.json({ ok: true });
}
