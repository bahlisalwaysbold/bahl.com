import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const leadSessionCookie = 'bahl_lead_engine_session';
export const leadSessionTtlMs = 8 * 60 * 60 * 1000;

export function signLeadSession(timestamp: string) {
  return createHmac('sha256', process.env.LEAD_DASHBOARD_SECRET || 'missing-secret')
    .update(timestamp)
    .digest('hex');
}

export function createLeadSessionValue(timestamp = Date.now().toString()) {
  return timestamp + '.' + signLeadSession(timestamp);
}

export function validLeadSession(value: string | undefined) {
  if (!value || !process.env.LEAD_DASHBOARD_SECRET) return false;
  const [timestamp, signature] = value.split('.');
  const age = Date.now() - Number(timestamp);
  if (!timestamp || !signature || !Number.isFinite(age) || age < 0 || age > leadSessionTtlMs) return false;
  const expected = signLeadSession(timestamp);
  if (signature.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function hasLeadDashboardSession() {
  const cookieStore = await cookies();
  return validLeadSession(cookieStore.get(leadSessionCookie)?.value);
}