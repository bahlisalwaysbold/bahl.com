import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, string>;
    const required = ['name', 'phone', 'location', 'message', 'division', 'service'];
    for (const field of required) if (!body[field]?.trim()) return NextResponse.json({ error: `Please complete ${field}.` }, { status: 400 });
    if (body.email && !emailPattern.test(body.email)) return NextResponse.json({ error: 'Please check the email address.' }, { status: 400 });
    if (body.website?.trim()) return NextResponse.json({ ok: true });

    const lead = {
      createdAt: new Date().toISOString(),
      name: body.name.trim(), phone: body.phone.trim(), email: body.email?.trim() || '',
      division: body.division.trim(), service: body.service.trim(), projectType: body.projectType?.trim() || '',
      location: body.location.trim(), budget: body.budget?.trim() || '', message: body.message.trim(),
    };
    let delivered = false;

    if (process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const result = await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        subject: `New Bahl website enquiry — ${lead.division}`,
        text: Object.entries(lead).map(([key, value]) => `${key}: ${value}`).join('\n'),
      });
      if (!result.error) delivered = true;
    }

    if (process.env.LEAD_WEBHOOK_URL) {
      const response = await fetch(process.env.LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead), cache: 'no-store' });
      if (response.ok) delivered = true;
    }

    if (!delivered) console.info('[Bahl contact lead — delivery not configured]', lead);
    return NextResponse.json({ ok: true, configured: delivered });
  } catch {
    return NextResponse.json({ error: 'Unable to submit this enquiry right now. Please use WhatsApp instead.' }, { status: 500 });
  }
}
