import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';

const cookieName = 'bahl_lead_engine_session';
const ttlMs = 8 * 60 * 60 * 1000;

function sign(value: string) {
  return createHmac('sha256', process.env.LEAD_DASHBOARD_SECRET || 'missing-secret').update(value).digest('hex');
}

function valid(value: string) {
  const parts = value.split('.');
  const timestamp = parts[0];
  const signature = parts[1];
  const age = Date.now() - Number(timestamp);
  if (!timestamp || !signature || !Number.isFinite(age) || age < 0 || age > ttlMs) return false;
  const expected = sign(timestamp);
  try { return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)); } catch { return false; }
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
