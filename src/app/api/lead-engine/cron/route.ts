import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseRequest } from '@/lib/lead-engine/supabase';

type FollowupRow = { id: string; lead_id: string; due_at: string; };
type LeadRow = { id: string; reference: string; name: string; phone: string; project_type: string; location: string; lead_score: number; status: string; source: string; };

export async function GET(request: Request) {
  const expected = process.env.LEAD_ENGINE_CRON_SECRET;
  if (!expected || request.headers.get('authorization') !== 'Bearer ' + expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const due = await supabaseRequest<FollowupRow[]>(
    'followups?select=id,lead_id,due_at&status=eq.pending&kind=eq.response_check&due_at=lte.' +
    encodeURIComponent(new Date().toISOString()) + '&limit=25',
  );

  let processed = 0;
  for (const followup of due.data ?? []) {
    const leadResult = await supabaseRequest<LeadRow[]>(
      'leads?select=id,reference,name,phone,project_type,location,lead_score,status,source&id=eq.' +
      encodeURIComponent(followup.lead_id) + '&limit=1',
    );
    const lead = leadResult.data?.[0];

    if (!lead || !['new', 'qualified'].includes(lead.status)) {
      await supabaseRequest('followups?id=eq.' + encodeURIComponent(followup.id), {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'skipped' }),
      });
      continue;
    }

    if (process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        subject: 'Lead response reminder — ' + lead.reference,
        text: [
          'This Bahl lead has been waiting for a response for at least 30 minutes.',
          'Reference: ' + lead.reference,
          'Name: ' + lead.name,
          'Phone: ' + lead.phone,
          'Project: ' + lead.project_type,
          'Location: ' + lead.location,
          'Score: ' + lead.lead_score,
          'Source: ' + lead.source,
        ].join('\n'),
      });
    }

    await supabaseRequest('followups?id=eq.' + encodeURIComponent(followup.id), {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ status: 'sent', sent_at: new Date().toISOString() }),
    });
    await supabaseRequest('lead_events', {
      method: 'POST',
      body: JSON.stringify({
        lead_id: lead.id,
        event_type: 'response_reminder_sent',
        payload: { channel: 'email_internal', due_at: followup.due_at },
      }),
    });
    processed += 1;
  }

  return NextResponse.json({ ok: true, processed });
}
