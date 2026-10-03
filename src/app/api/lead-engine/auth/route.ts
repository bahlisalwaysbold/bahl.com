import { NextRequest, NextResponse } from 'next/server';
import {
  createLeadSessionValue,
  leadSessionCookie,
  leadSessionTtlMs,
} from '@/lib/lead-engine/auth';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { password?: string };
  if (
    !process.env.LEAD_DASHBOARD_PASSWORD ||
    !process.env.LEAD_DASHBOARD_SECRET ||
    body.password !== process.env.LEAD_DASHBOARD_PASSWORD
  ) {
    return NextResponse.json({ error: 'Invalid dashboard password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(leadSessionCookie, createLeadSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: Math.floor(leadSessionTtlMs / 1000),
    path: '/',
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(leadSessionCookie, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });
  return response;
}