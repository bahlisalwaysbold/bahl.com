import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { supabaseRequest } from '@/lib/lead-engine/supabase';

const cookieName = 'bahl_lead_engine_session';
const ttlMs = 8 * 60 * 60 * 1000;

function validSession(value: string | undefined) {
  if (!value || !process.env.LEAD_DASHBOARD_PASSWORD || !process.env.LEAD_DASHBOARD_SECRET) return false;
  const parts = value.split('.');
  const timestamp = parts[0];
  const signature = parts[1];
  const age = Date.now() - Number(timestamp);
  if (!timestamp || !signature || !Number.isFinite(age) || age < 0 || age > ttlMs) return false;
  const expected = createHmac('sha256', process.env.LEAD_DASHBOARD_SECRET).update(timestamp).digest('hex');
  try { return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)); } catch { return false; }
}

type LeadRow = {
  id: string; reference: string; name: string; organization: string | null; role: string;
  project_type: string; location: string; lead_score: number; status: string; source: string; created_at: string;
};

export default async function LeadEngineDashboardPage() {
  const cookieStore = await cookies();
  if (!validSession(cookieStore.get(cookieName)?.value)) redirect('/lead-engine/dashboard/login');

  const response = await supabaseRequest<LeadRow[]>(
    'leads?select=id,reference,name,organization,role,project_type,location,lead_score,status,source,created_at&order=created_at.desc&limit=100',
  );
  const leads = response.data ?? [];
  const qualified = leads.filter((lead) => lead.lead_score >= 60).length;
  const active = leads.filter((lead) => !['won', 'lost'].includes(lead.status)).length;
  const won = leads.filter((lead) => lead.status === 'won').length;
  const sourceCounts = leads.reduce<Record<string, number>>((acc, lead) => {
    const source = lead.source || 'direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="section section-muted">
      <div className="container">
        <div className="split-heading">
          <div><p className="eyebrow">BAHL / Lead Engine</p><h1 style={{ margin: '10px 0 0', fontSize: 'clamp(2.4rem,5vw,4.8rem)', lineHeight: .95, letterSpacing: '-.05em' }}>Control room</h1></div>
          <span className="eyebrow">Private</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginTop:42 }}>
          {[['Last 100 leads', leads.length], ['Qualified', qualified], ['Active', active], ['Won', won]].map(([label, value]) => (
            <div key={label} style={{ padding:22, borderRadius:18, background:'#fff', border:'1px solid #e5e1d7' }}>
              <span className="eyebrow">{label}</span><strong style={{ display:'block', marginTop:7, fontSize:'2.1rem' }}>{value}</strong>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.35fr .65fr', gap:18, marginTop:18 }}>
          <div style={{ padding:22, borderRadius:18, background:'#fff', border:'1px solid #e5e1d7', overflowX:'auto' }}>
            <p className="eyebrow">Recent pipeline</p>
            {leads.length === 0 ? <p style={{ color:'#777b84' }}>No leads yet. Add Supabase environment variables and run the SQL setup.</p> : (
              <table style={{ width:'100%', borderCollapse:'collapse', marginTop:12, fontSize:'.86rem' }}>
                <thead><tr>{['Reference','Lead','Project','Location','Score','Status','Source'].map((head) => <th key={head} style={{ textAlign:'left', padding:'10px 8px', borderBottom:'1px solid #e9e6de' }}>{head}</th>)}</tr></thead>
                <tbody>{leads.slice(0,50).map((lead) => (
                  <tr key={lead.id}>
                    <td style={{ padding:'10px 8px', whiteSpace:'nowrap' }}>{lead.reference}</td>
                    <td style={{ padding:'10px 8px', whiteSpace:'nowrap' }}><strong>{lead.name}</strong><br/><span style={{ color:'#777b84' }}>{lead.role}</span></td>
                    <td style={{ padding:'10px 8px' }}>{lead.project_type}</td><td style={{ padding:'10px 8px' }}>{lead.location}</td>
                    <td style={{ padding:'10px 8px', fontWeight:900 }}>{lead.lead_score}</td><td style={{ padding:'10px 8px' }}>{lead.status}</td><td style={{ padding:'10px 8px' }}>{lead.source}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>

          <div style={{ display:'grid', gap:18, alignContent:'start' }}>
            <div style={{ padding:22, borderRadius:18, background:'#101114', color:'#fff' }}>
              <p className="eyebrow eyebrow--light">Source mix</p>
              <div style={{ display:'grid', gap:10, marginTop:12 }}>
                {Object.entries(sourceCounts).sort((a,b) => b[1] - a[1]).map(([source, count]) => (
                  <div key={source} style={{ display:'flex', justifyContent:'space-between', color:'rgba(255,255,255,.72)' }}><span>{source}</span><strong>{count}</strong></div>
                ))}
              </div>
            </div>
            <div style={{ padding:22, borderRadius:18, background:'#fff', border:'1px solid #e5e1d7' }}>
              <p className="eyebrow">Built into the data model</p>
              <h3 style={{ margin:'8px 0 6px' }}>Quote → won → revenue</h3>
              <p style={{ margin:0, color:'#777b84' }}>The next layer can record quotation value and final revenue so source performance can be measured by jobs instead of traffic alone.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
