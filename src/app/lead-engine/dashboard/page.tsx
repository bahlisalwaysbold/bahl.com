import Link from 'next/link';
import { redirect } from 'next/navigation';
import { hasLeadDashboardSession } from '@/lib/lead-engine/auth';
import { supabaseRequest } from '@/lib/lead-engine/supabase';

type LeadRow = {
  id: string;
  reference: string;
  name: string;
  organization: string | null;
  role: string;
  project_type: string;
  location: string;
  lead_score: number;
  status: string;
  source: string;
  has_files: boolean;
  revenue: number | null;
  created_at: string;
};

type QuoteRow = { amount: number | null; status: string; };

const statusOrder = ['new', 'qualified', 'contacted', 'quoted', 'won', 'lost'];

export default async function LeadEngineDashboardPage() {
  if (!(await hasLeadDashboardSession())) redirect('/lead-engine/dashboard/login');

  const [leadsResult, quotesResult] = await Promise.all([
    supabaseRequest<LeadRow[]>(
      'leads?select=id,reference,name,organization,role,project_type,location,lead_score,status,source,has_files,revenue,created_at&order=created_at.desc&limit=100',
    ),
    supabaseRequest<QuoteRow[]>(
      'quotes?select=amount,status&order=created_at.desc&limit=500',
    ),
  ]);

  const leads = leadsResult.data ?? [];
  const quotes = quotesResult.data ?? [];
  const qualified = leads.filter((lead) => lead.lead_score >= 60).length;
  const active = leads.filter((lead) => !['won', 'lost'].includes(lead.status)).length;
  const won = leads.filter((lead) => lead.status === 'won').length;
  const revenue = leads.reduce((sum, lead) => sum + Number(lead.revenue || 0), 0);
  const quotedValue = quotes.reduce((sum, quote) => sum + Number(quote.amount || 0), 0);

  const sourceCounts = leads.reduce<Record<string, number>>((acc, lead) => {
    const source = lead.source || 'direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="section section-muted">
      <div className="container">
        <div className="split-heading">
          <div>
            <p className="eyebrow">BAHL / Lead Engine</p>
            <h1 style={{ margin: '10px 0 0', fontSize: 'clamp(2.4rem,5vw,4.8rem)', lineHeight: .95, letterSpacing: '-.05em' }}>
              Control room
            </h1>
          </div>
          <Link className="btn btn--solid" href="/lead-engine">View public planner</Link>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,minmax(0,1fr))', gap:14, marginTop:42 }}>
          {[
            ['Last 100 leads', leads.length],
            ['Qualified', qualified],
            ['Active', active],
            ['Won', won],
            ['Revenue', '₦' + revenue.toLocaleString()],
          ].map(([label, value]) => (
            <div key={String(label)} style={{ padding:22, borderRadius:18, background:'#fff', border:'1px solid #e5e1d7' }}>
              <span className="eyebrow">{label}</span>
              <strong style={{ display:'block', marginTop:7, fontSize:'1.9rem' }}>{value}</strong>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.35fr .65fr', gap:18, marginTop:18 }}>
          <div style={{ padding:22, borderRadius:18, background:'#fff', border:'1px solid #e5e1d7', overflowX:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', gap:12, alignItems:'center' }}>
              <p className="eyebrow" style={{ margin:0 }}>Recent pipeline</p>
              <span style={{ color:'#777b84', fontSize:'.85rem' }}>{quotedValue ? 'Quotes: ₦' + quotedValue.toLocaleString() : 'No quotes yet'}</span>
            </div>

            {leads.length === 0 ? (
              <p style={{ color:'#777b84' }}>No leads yet. Add Supabase environment variables and run the SQL setup.</p>
            ) : (
              <table style={{ width:'100%', borderCollapse:'collapse', marginTop:12, fontSize:'.86rem' }}>
                <thead>
                  <tr>
                    {['Reference','Lead','Project','Location','Score','Status','Source','Open'].map((head) => (
                      <th key={head} style={{ textAlign:'left', padding:'10px 8px', borderBottom:'1px solid #e9e6de' }}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 50).map((lead) => (
                    <tr key={lead.id}>
                      <td style={{ padding:'10px 8px', whiteSpace:'nowrap' }}>{lead.reference}</td>
                      <td style={{ padding:'10px 8px', whiteSpace:'nowrap' }}>
                        <strong>{lead.name}</strong><br />
                        <span style={{ color:'#777b84' }}>{lead.role}</span>
                      </td>
                      <td style={{ padding:'10px 8px' }}>{lead.project_type}</td>
                      <td style={{ padding:'10px 8px' }}>{lead.location}</td>
                      <td style={{ padding:'10px 8px', fontWeight:900 }}>{lead.lead_score}</td>
                      <td style={{ padding:'10px 8px' }}>{lead.status}</td>
                      <td style={{ padding:'10px 8px' }}>{lead.source}</td>
                      <td style={{ padding:'10px 8px' }}>
                        <Link className="text-link" href={'/lead-engine/dashboard/leads/' + lead.id}>Open →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ display:'grid', gap:18, alignContent:'start' }}>
            <div style={{ padding:22, borderRadius:18, background:'#101114', color:'#fff' }}>
              <p className="eyebrow eyebrow--light">Pipeline</p>
              <div style={{ display:'grid', gap:10, marginTop:12 }}>
                {statusOrder.map((status) => (
                  <div key={status} style={{ display:'flex', justifyContent:'space-between', color:'rgba(255,255,255,.72)' }}>
                    <span>{status}</span><strong>{statusCounts[status] || 0}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding:22, borderRadius:18, background:'#fff', border:'1px solid #e5e1d7' }}>
              <p className="eyebrow">Source mix</p>
              <div style={{ display:'grid', gap:10, marginTop:12 }}>
                {Object.entries(sourceCounts).sort((a,b) => b[1] - a[1]).map(([source, count]) => (
                  <div key={source} style={{ display:'flex', justifyContent:'space-between' }}>
                    <span>{source}</span><strong>{count}</strong>
                  </div>
                ))}
                {!Object.keys(sourceCounts).length && <span style={{ color:'#777b84' }}>No attribution data yet.</span>}
              </div>
            </div>
          </div>
        </div>

        <p style={{ color:'#777b84', marginTop:18, fontSize:'.9rem' }}>
          The control room is now wired for the commercial loop: lead → contact → quote → won/lost → revenue.
        </p>
      </div>
    </main>
  );
}