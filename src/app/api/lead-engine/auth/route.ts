import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';

const cookieName = 'bahl_lead_engine_session';
const ttlMs = 8 * 60 * 60 * 1000;

function sign(value: string) {
  return createHmac('sha256', process.env.LEAD_DASHBOARD_SECRET || 'missing-secret').update(value).digest('hex');
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { password?: string };
  if (!process.env.LEAD_DASHBOARD_PASSWORD || !process.env.LEAD_DASHBOARD_SECRET || body.password !== process.env.LEAD_DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Invalid dashboard password.' }, { status: 401 });
  }
  const timestamp = Date.now().toString();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, timestamp + '.' + sign(timestamp), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    maxAge: Math.floor(ttlMs / 1000), path: '/',
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, '', { httpOnly: true, expires: new Date(0), path: '/' });
  return response;
}
