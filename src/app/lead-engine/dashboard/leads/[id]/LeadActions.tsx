'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const statuses = ['new', 'qualified', 'contacted', 'quoted', 'won', 'lost'] as const;
const quoteStatuses = ['draft', 'sent', 'accepted', 'declined'] as const;

export default function LeadActions({ leadId, initialStatus, initialRevenue, hasFile }: {
  leadId: string;
  initialStatus: string;
  initialRevenue: number | null;
  hasFile: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteStatus, setQuoteStatus] = useState('sent');
  const [revenue, setRevenue] = useState(initialRevenue === null ? '' : String(initialRevenue));
  const [busy, setBusy] = useState(false);
  const [fileBusy, setFileBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function save() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/lead-engine/leads/' + leadId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          quoteAmount: quoteAmount || null,
          quoteStatus,
          revenue: revenue || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not update lead.');
      setQuoteAmount('');
      setMessage('Saved to the pipeline.');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save changes.');
    } finally {
      setBusy(false);
    }
  }

  async function openFile() {
    setFileBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/lead-engine/files/' + leadId);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not open file.');
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not open file.');
    } finally {
      setFileBusy(false);
    }
  }

  return (
    <section style={{ marginTop: 24, padding: 22, background: '#101114', color: '#fff', borderRadius: 20 }}>
      <p className="eyebrow eyebrow--light">Pipeline controls</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12, marginTop: 14 }}>
        <label>Status<select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width:'100%', marginTop:7, minHeight:46, borderRadius:10, padding:'0 10px' }}>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label>Latest quote amount (NGN)<input value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)} inputMode="decimal" placeholder="e.g. 450000" style={{ width:'100%', marginTop:7, minHeight:46, borderRadius:10, padding:'0 10px' }} /></label>
        <label>Quote status<select value={quoteStatus} onChange={(e) => setQuoteStatus(e.target.value)} style={{ width:'100%', marginTop:7, minHeight:46, borderRadius:10, padding:'0 10px' }}>{quoteStatuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label>Realized revenue (NGN)<input value={revenue} onChange={(e) => setRevenue(e.target.value)} inputMode="decimal" placeholder="e.g. 450000" style={{ width:'100%', marginTop:7, minHeight:46, borderRadius:10, padding:'0 10px' }} /></label>
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:16 }}>
        <button className="btn btn--light" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save pipeline update'}</button>
        {hasFile && <button className="btn" style={{ background:'#fff', color:'#101114' }} disabled={fileBusy} onClick={openFile}>{fileBusy ? 'Opening…' : 'Open private project file'}</button>}
      </div>
      {message && <p style={{ margin:'12px 0 0', color:'rgba(255,255,255,.75)' }} role="status">{message}</p>}
    </section>
  );
}