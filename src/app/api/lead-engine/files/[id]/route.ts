import { NextResponse } from 'next/server';
import { hasLeadDashboardSession } from '@/lib/lead-engine/auth';
import { supabaseRequest, supabaseStorageSignedUrl } from '@/lib/lead-engine/supabase';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await hasLeadDashboardSession())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const result = await supabaseRequest<Array<{ file_path: string | null }>>(
    'leads?select=file_path&id=eq.' + encodeURIComponent(id) + '&limit=1',
  );
  const lead = result.data?.[0];
  if (!result.response?.ok || !lead) {
    return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  }
  if (!lead.file_path) {
    return NextResponse.json({ error: 'This lead has no uploaded file.' }, { status: 404 });
  }

  const signed = await supabaseStorageSignedUrl(lead.file_path, 10 * 60);
  if (!signed.ok || !signed.url) {
    return NextResponse.json({ error: 'Could not open the private project file.' }, { status: 502 });
  }

  return NextResponse.json({ url: signed.url });
}