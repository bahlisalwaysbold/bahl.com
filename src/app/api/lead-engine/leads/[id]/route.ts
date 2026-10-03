import { NextResponse } from 'next/server';
import { hasLeadDashboardSession } from '@/lib/lead-engine/auth';
import { supabaseRequest } from '@/lib/lead-engine/supabase';

const allowedStatuses = new Set(['new', 'qualified', 'contacted', 'quoted', 'won', 'lost']);
const allowedQuoteStatuses = new Set(['draft', 'sent', 'accepted', 'declined']);

type LeadRow = {
  id: string;
  reference: string;
  status: string;
  contacted_at: string | null;
  quoted_at: string | null;
  won_at: string | null;
  lost_at: string | null;
};

function money(value: unknown) {
  if (value === undefined || value === null || value === '') return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000_000_000) {
    throw new Error('Invalid monetary value.');
  }
  return Math.round(amount * 100) / 100;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await hasLeadDashboardSession())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: 'Missing lead id.' }, { status: 400 });

  const body = await request.json().catch(() => null) as {
    status?: string;
    quoteAmount?: number | string | null;
    quoteStatus?: string;
    revenue?: number | string | null;
  } | null;

  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  if (body.status && !allowedStatuses.has(body.status)) {
    return NextResponse.json({ error: 'That pipeline status is not valid.' }, { status: 400 });
  }

  if (body.quoteStatus && !allowedQuoteStatuses.has(body.quoteStatus)) {
    return NextResponse.json({ error: 'That quote status is not valid.' }, { status: 400 });
  }

  let quoteAmount: number | null = null;
  let revenue: number | null = null;
  try {
    quoteAmount = money(body.quoteAmount);
    revenue = money(body.revenue);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid amount.' }, { status: 400 });
  }

  const current = await supabaseRequest<LeadRow[]>(
    'leads?select=id,reference,status,contacted_at,quoted_at,won_at,lost_at&id=eq.' +
    encodeURIComponent(id) + '&limit=1',
  );
  const lead = current.data?.[0];
  if (!current.response?.ok || !lead) {
    return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  }

  const now = new Date().toISOString();
  const nextStatus = body.status || lead.status;
  const update: Record<string, unknown> = {};

  if (body.status) update.status = body.status;
  if (revenue !== null) {
    update.revenue = revenue;
    if (nextStatus === 'won' && !lead.won_at) update.won_at = now;
  }
  if (nextStatus === 'contacted' && !lead.contacted_at) update.contacted_at = now;
  if (nextStatus === 'quoted' && !lead.quoted_at) update.quoted_at = now;
  if (nextStatus === 'won' && !lead.won_at) update.won_at = now;
  if (nextStatus === 'lost' && !lead.lost_at) update.lost_at = now;

  let updatedLead = lead;
  if (Object.keys(update).length > 0) {
    const saved = await supabaseRequest<LeadRow[]>(
      'leads?id=eq.' + encodeURIComponent(id),
      {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(update),
      },
    );
    if (!saved.response?.ok || !saved.data?.[0]) {
      return NextResponse.json({ error: 'Could not update the lead.' }, { status: 502 });
    }
    updatedLead = saved.data[0];
  }

  if (quoteAmount !== null) {
    const quoteStatus = body.quoteStatus || (nextStatus === 'won' ? 'accepted' : nextStatus === 'quoted' ? 'sent' : 'draft');
    const quote = await supabaseRequest('quotes', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        lead_id: id,
        amount: quoteAmount,
        currency: 'NGN',
        status: quoteStatus,
        sent_at: quoteStatus === 'sent' || quoteStatus === 'accepted' ? now : null,
        accepted_at: quoteStatus === 'accepted' ? now : null,
      }),
    });
    if (!quote.response?.ok) {
      return NextResponse.json({ error: 'Lead updated, but the quote could not be saved.' }, { status: 502 });
    }
  }

  const events = [];
  if (body.status) events.push({ event_type: 'status_changed', payload: { from: lead.status, to: body.status } });
  if (quoteAmount !== null) events.push({ event_type: 'quote_recorded', payload: { amount: quoteAmount, status: body.quoteStatus || null } });
  if (revenue !== null) events.push({ event_type: 'revenue_recorded', payload: { revenue } });

  for (const event of events) {
    await supabaseRequest('lead_events', {
      method: 'POST',
      body: JSON.stringify({ lead_id: id, ...event }),
    });
  }

  return NextResponse.json({ ok: true, lead: updatedLead });
}