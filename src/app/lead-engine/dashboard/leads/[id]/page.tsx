import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { hasLeadDashboardSession } from '@/lib/lead-engine/auth';
import { supabaseRequest } from '@/lib/lead-engine/supabase';
import LeadActions from './LeadActions';

type Lead = {
  id: string;
  reference: string;
  division: string;
  niche: string;
  name: string;
  phone: string;
  email: string | null;
  role: string;
  organization: string | null;
  project_type: string;
  floors: number;
  drawing_needs: string[];
  deadline: string;
  location: string;
  has_files: boolean;
  file_path: string | null;
  budget: string | null;
  notes: string;
  source: string;
  referrer: string | null;
  lead_score: number;
  status: string;
  revenue: number | null;
  created_at: string;
  contacted_at: string | null;
  quoted_at: string | null;
  won_at: string | null;
  lost_at: string | null;
};

type Event = { id: number; event_type: string; payload: Record<string, unknown>; created_at: string };
type Quote = { id: string; amount: number; currency: string; status: string; sent_at: string | null; accepted_at: string | null; created_at: string };

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await hasLeadDashboardSession())) redirect('/lead-engine/dashboard');

  const { id } = await params;
  const leadResult = await supabaseRequest<Lead[]>(
    'leads?select=id,reference,division,niche,name,phone,email,role,organization,project_type,floors,drawing_needs,deadline,location,has_files,file_path,budget,notes,source,referrer,lead_score,status,revenue,created_at,contacted_at,quoted_at,won_at,lost_at&id=eq.' +
    encodeURIComponent(id) + '&limit=1',
  );
  const lead = leadResult.data?.[0];
  if (!lead) notFound();

  const [eventsResult, quotesResult] = await Promise.all([
    supabaseRequest<Event[]>(
      'lead_events?select=id,event_type,payload,created_at&lead_id=eq.' + encodeURIComponent(id) + '&order=created_at.desc&limit=30',
    ),
    supabaseRequest<Quote[]>(
      'quotes?select=id,amount,currency,status,sent_at,accepted_at,created_at&lead_id=eq.' + encodeURIComponent(id) + '&order=created_at.desc&limit=20',
    ),
  ]);

  const wa = 'https://wa.me/' + lead.phone.replace(/\D/g, '') + '?text=' + encodeURIComponent('Hi ' + lead.name + ', this is Bahl following up on ' + lead.reference + '.');
  const quoteTotal = (quotesResult.data ?? []).reduce((sum, quote) => sum + Number(quote.amount || 0), 0);

  return (
    <main className="section section-muted">
      <div className="container">
        <Link href="/lead-engine/dashboard" className="text-link">← Back to control room</Link>
        <div style={{ display:'flex', justifyContent:'space-between', gap:20, alignItems:'flex-end', flexWrap:'wrap', marginTop:18 }}>
          <div><p className="eyebrow">BAHL / {lead.reference}</p><h1 style={{ margin:'8px 0 8px', fontSize:'clamp(2.3rem,5vw,4.5rem)', letterSpacing:'-.05em', lineHeight:.96 }}>{lead.name}</h1><p style={{ margin:0, color:'#777b84' }}>{lead.project_type} · {lead.location} · score {lead.lead_score}</p></div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}><a className="btn btn--solid" href={'tel:' + lead.phone}>Call</a><a className="btn btn--solid" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>{lead.email && <a className="btn" href={'mailto:' + lead.email}>Email</a>}</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.15fr .85fr', gap:18, marginTop:28 }}>
          <section style={{ background:'#fff', border:'1px solid #e5e1d7', borderRadius:20, padding:24 }}>
            <p className="eyebrow">Project brief</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:14, marginTop:14 }}>
              {[['Role', lead.role],['Organisation', lead.organization || '—'],['Floors', String(lead.floors)],['Deadline', lead.deadline],['Budget', lead.budget || '—'],['Drawing needs', lead.drawing_needs.join(', ')],['Source', lead.source],['Referrer', lead.referrer || '—']].map(([label,value]) => <div key={label}><span className="eyebrow">{label}</span><p style={{ margin:'5px 0 0' }}>{value}</p></div>)}
            </div>
            <div style={{ marginTop:18, paddingTop:18, borderTop:'1px solid #ece9e0' }}><span className="eyebrow">Notes</span><p style={{ whiteSpace:'pre-wrap', lineHeight:1.65 }}>{lead.notes}</p></div>
          </section>

          <div style={{ display:'grid', gap:18, alignContent:'start' }}>
            <section style={{ background:'#101114', color:'#fff', borderRadius:20, padding:24 }}>
              <p className="eyebrow eyebrow--light">Commercial</p>
              <div style={{ display:'grid', gap:10, marginTop:12 }}><div style={{ display:'flex', justifyContent:'space-between' }}><span>Lead score</span><strong>{lead.lead_score}</strong></div><div style={{ display:'flex', justifyContent:'space-between' }}><span>Quote total</span><strong>₦{quoteTotal.toLocaleString()}</strong></div><div style={{ display:'flex', justifyContent:'space-between' }}><span>Revenue</span><strong>₦{Number(lead.revenue || 0).toLocaleString()}</strong></div></div>
            </section>
            <section style={{ background:'#fff', border:'1px solid #e5e1d7', borderRadius:20, padding:24 }}>
              <p className="eyebrow">Timeline</p>
              <div style={{ display:'grid', gap:12, marginTop:12 }}>{(eventsResult.data ?? []).map((event) => <div key={event.id} style={{ paddingBottom:12, borderBottom:'1px solid #ece9e0' }}><strong>{event.event_type.replaceAll('_',' ')}</strong><small style={{ display:'block', color:'#777b84', marginTop:4 }}>{new Date(event.created_at).toLocaleString()}</small></div>)}</div>
            </section>
          </div>
        </div>

        <LeadActions leadId={lead.id} initialStatus={lead.status} initialRevenue={lead.revenue} hasFile={lead.has_files && Boolean(lead.file_path)} />

        <section style={{ marginTop:18, padding:22, background:'#fff', border:'1px solid #e5e1d7', borderRadius:20 }}>
          <p className="eyebrow">Quotes</p>
          {quotesResult.data?.length ? <div style={{ overflowX:'auto' }}><table style={{ width:'100%', borderCollapse:'collapse', marginTop:10 }}><thead><tr>{['Date','Amount','Status','Accepted'].map((head) => <th key={head} style={{ textAlign:'left', padding:'10px 8px', borderBottom:'1px solid #e9e6de' }}>{head}</th>)}</tr></thead><tbody>{quotesResult.data.map((quote) => <tr key={quote.id}><td style={{ padding:'10px 8px' }}>{new Date(quote.created_at).toLocaleString()}</td><td style={{ padding:'10px 8px' }}>₦{Number(quote.amount).toLocaleString()}</td><td style={{ padding:'10px 8px' }}>{quote.status}</td><td style={{ padding:'10px 8px' }}>{quote.accepted_at ? new Date(quote.accepted_at).toLocaleString() : '—'}</td></tr>)}</tbody></table></div> : <p style={{ color:'#777b84' }}>No quote recorded yet.</p>}
        </section>
      </div>
    </main>
  );
}