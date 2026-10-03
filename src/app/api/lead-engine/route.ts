import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { randomBytes, randomUUID } from 'node:crypto';
import { leadEngineConfig, scoreLead, type LeadInput } from '@/lib/lead-engine/config';
import { supabaseRequest, supabaseStorageUpload } from '@/lib/lead-engine/supabase';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedMime = new Set(['application/pdf', 'application/zip', 'application/x-zip-compressed', 'application/octet-stream']);

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function reference() {
  return 'BAHL-' + new Date().toISOString().slice(0, 10).replaceAll('-', '') + '-' + randomBytes(3).toString('hex').toUpperCase();
}

function parseForm(form: FormData): LeadInput | null {
  const floors = Number(text(form, 'floors'));
  const drawingNeeds = form.getAll('drawingNeeds').filter((value): value is string => typeof value === 'string');
  const input: LeadInput = {
    name: text(form, 'name'),
    phone: text(form, 'phone'),
    email: text(form, 'email'),
    role: text(form, 'role'),
    organization: text(form, 'organization'),
    projectType: text(form, 'projectType'),
    floors,
    drawingNeeds,
    deadline: text(form, 'deadline'),
    location: text(form, 'location'),
    hasFiles: form.get('file') instanceof File,
    budget: text(form, 'budget'),
    notes: text(form, 'notes'),
    source: text(form, 'source'),
    referrer: text(form, 'referrer'),
    serviceConsent: text(form, 'serviceConsent') === 'true',
    marketingOptIn: text(form, 'marketingOptIn') === 'true',
  };
  if (!input.name || !input.phone || !input.role || !input.projectType || !input.location ||
      !input.notes || input.notes.length < 15 || !input.deadline || !input.drawingNeeds.length || !input.serviceConsent ||
      !Number.isFinite(floors) || floors < 1 || floors > 60) return null;
  if (input.email && !emailPattern.test(input.email)) return null;
  return input;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    if (text(form, 'website')) return NextResponse.json({ ok: true, reference: 'FILTERED' });

    const input = parseForm(form);
    if (!input) return NextResponse.json({ error: 'Please complete the project form with valid details.' }, { status: 400 });

    let filePath = '';
    const entry = form.get('file');
    if (entry instanceof File && entry.size > 0) {
      if (entry.size > 15 * 1024 * 1024) return NextResponse.json({ error: 'Project files must be 15 MB or smaller.' }, { status: 400 });
      const extension = entry.name.split('.').pop()?.toLowerCase() || '';
      if (!['pdf', 'dwg', 'dxf', 'zip'].includes(extension)) {
        return NextResponse.json({ error: 'Supported files are PDF, DWG, DXF and ZIP.' }, { status: 400 });
      }
      if (entry.type && !allowedMime.has(entry.type) && !['dwg', 'dxf'].includes(extension)) {
        return NextResponse.json({ error: 'That file type is not supported.' }, { status: 400 });
      }
      const safeName = entry.name.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-120);
      filePath = new Date().toISOString().slice(0, 10) + '/' + randomUUID() + '-' + safeName;
      const upload = await supabaseStorageUpload(filePath, entry);
      if (!upload.configured) {
        return NextResponse.json({ error: 'Project file storage is not configured yet. You can submit without the file and send it on WhatsApp.' }, { status: 503 });
      }
      if (!upload.ok) return NextResponse.json({ error: 'We could not save the file securely. Please submit again or send the file on WhatsApp.' }, { status: 502 });
    }

    const ref = reference();
    const score = scoreLead({ ...input, filePath, hasFiles: Boolean(filePath) || input.hasFiles });
    const createdAt = new Date().toISOString();
    const leadRecord = {
      reference: ref,
      division: leadEngineConfig.division,
      niche: leadEngineConfig.slug,
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      role: input.role,
      organization: input.organization || null,
      project_type: input.projectType,
      floors: input.floors,
      drawing_needs: input.drawingNeeds,
      deadline: input.deadline,
      location: input.location,
      has_files: Boolean(filePath),
      file_path: filePath || null,
      budget: input.budget || null,
      notes: input.notes,
      source: input.source || 'direct',
      referrer: input.referrer || null,
      lead_score: score,
      status: score >= 60 ? 'qualified' : 'new',
      service_consent: input.serviceConsent,
      marketing_opt_in: input.marketingOptIn,
      created_at: createdAt,
    };

    let stored = false;
    let delivered = false;
    const saved = await supabaseRequest<Array<{ id: string; reference: string }>>('leads', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(leadRecord),
    });

    if (saved.response?.ok) {
      stored = true;
      const leadId = saved.data?.[0]?.id ?? null;
      await supabaseRequest('lead_events', {
        method: 'POST',
        body: JSON.stringify({
          lead_id: leadId,
          event_type: 'lead_created',
          payload: { source: input.source || 'direct', lead_score: score },
        }),
      });
      await supabaseRequest('followups', {
        method: 'POST',
        body: JSON.stringify({
          lead_id: leadId,
          kind: 'response_check',
          due_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          status: 'pending',
        }),
      });
    } else if (saved.response && !saved.response.ok) {
      console.error('[Lead Engine] Supabase insert failed', await saved.response.text());
    }

    const leadText = Object.entries(leadRecord)
      .map(([key, value]) => key + ': ' + (Array.isArray(value) ? value.join(', ') : value ?? ''))
      .join('\n');

    if (process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const result = await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        subject: 'NEW BAHL LEAD — ' + input.projectType + ' / score ' + score + ' / ' + ref,
        text: leadText,
      });
      if (!result.error) delivered = true;
    }

    if (process.env.LEAD_WEBHOOK_URL) {
      const webhook = await fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leadRecord, reference: ref, leadScore: score }),
        cache: 'no-store',
      });
      if (webhook.ok) delivered = true;
    }

    return NextResponse.json({ ok: true, reference: ref, leadScore: score, stored, delivered });
  } catch (error) {
    console.error('[Lead Engine] submit error', error);
    return NextResponse.json({ error: 'Unable to receive the enquiry right now. Please use WhatsApp instead.' }, { status: 500 });
  }
}
