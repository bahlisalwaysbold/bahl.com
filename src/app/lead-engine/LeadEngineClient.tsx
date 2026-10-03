'use client';

import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { WHATSAPP_NUMBER } from '@/lib/site';
import { buildWhatsAppUrl, estimateScope, leadEngineConfig, type LeadInput } from '@/lib/lead-engine/config';
import styles from './LeadEngine.module.css';

const initial: LeadInput = {
  name: '', phone: '', email: '', role: '', organization: '', projectType: '', floors: 1,
  drawingNeeds: [], deadline: '', location: '', hasFiles: false, budget: '', notes: '',
  source: '', referrer: '', serviceConsent: false, marketingOptIn: false,
};

export default function LeadEngineClient() {
  const [form, setForm] = useState<LeadInput>(initial);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setForm((current) => ({
      ...current,
      source: params.get('utm_source') || params.get('source') || 'direct',
      referrer: document.referrer || '',
    }));
    trackEvent('lead_engine_view', { source: params.get('utm_source') || params.get('source') || 'direct' });
  }, []);

  const estimate = useMemo(
    () => estimateScope({
      floors: form.floors,
      drawingNeeds: form.drawingNeeds,
      deadline: form.deadline,
      hasFiles: Boolean(file),
    }),
    [form.floors, form.drawingNeeds, form.deadline, file],
  );

  function update<K extends keyof LeadInput>(name: K, value: LeadInput[K]) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function toggleDrawing(id: string) {
    setForm((current) => ({
      ...current,
      drawingNeeds: current.drawingNeeds.includes(id)
        ? current.drawingNeeds.filter((item) => item !== id)
        : [...current.drawingNeeds, id],
    }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError('');
    trackEvent('lead_engine_tool_complete', { drawing_count: form.drawingNeeds.length });

    if (!form.drawingNeeds.length) {
      setStatus('error');
      setError('Select at least one drawing or detailing need.');
      return;
    }
    if (!form.serviceConsent) {
      setStatus('error');
      setError('Please confirm that Bahl may use your details to respond to this enquiry.');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('phone', form.phone);
      data.append('email', form.email || '');
      data.append('role', form.role);
      data.append('organization', form.organization || '');
      data.append('projectType', form.projectType);
      data.append('floors', String(form.floors));
      form.drawingNeeds.forEach((item) => data.append('drawingNeeds', item));
      data.append('deadline', form.deadline);
      data.append('location', form.location);
      data.append('budget', form.budget || '');
      data.append('notes', form.notes || '');
      data.append('source', form.source || 'direct');
      data.append('referrer', form.referrer || '');
      data.append('serviceConsent', String(form.serviceConsent));
      data.append('marketingOptIn', String(form.marketingOptIn));
      if (file) data.append('file', file);
      data.append('website', '');

      const response = await fetch('/api/lead-engine', { method: 'POST', body: data });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'We could not receive the project.');

      const ref = payload.reference as string;
      setReference(ref);
      setWhatsappUrl(buildWhatsAppUrl(WHATSAPP_NUMBER, ref));
      setStatus('success');
      trackEvent('lead_engine_submit', {
        lead_score: Number(payload.leadScore || 0),
        source: form.source || 'direct',
      });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unable to submit right now.');
      trackEvent('lead_engine_error');
    }
  }

  if (status === 'success') {
    return (
      <main className={styles.page}>
        <section className={styles.resultHero}>
          <div className={styles.shell}>
            <p className={styles.kicker}>BAHL Engineering / project intake</p>
            <div className={styles.resultCard}>
              <div className={styles.resultMeta}>
                <div><span>Reference</span><strong>{reference}</strong></div>
                <div><span>Planning level</span><strong>{estimate.level}</strong></div>
              </div>
              <span className={styles.resultLabel}>What happens now</span>
              <h1>Your project brief is captured.</h1>
              <p>{estimate.nextStep}</p>
              <div className={styles.package}>
                {estimate.recommendedPackage.map((item) => <div key={item}>{item}</div>)}
              </div>
              <div className={styles.resultActions}>
                {whatsappUrl && <a className={styles.primaryButton} href={whatsappUrl} target="_blank" rel="noreferrer"
                  onClick={() => trackEvent('lead_engine_whatsapp_tap', { reference })}>Continue on WhatsApp →</a>}
                <a className={styles.secondaryButton} href="/lead-engine">Submit another project</a>
                <a className={styles.secondaryButton} href="/">Back to Bahl</a>
              </div>
              <p className={styles.disclaimer}>
                This is a preliminary scope planner, not a structural design calculation or approval. Final technical
                decisions and construction instructions remain subject to review by the responsible qualified engineer.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.shell}>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.kicker}>BAHL Engineering / free project planner</p>
              <h1>Turn a messy drawing brief into a clear next step.</h1>
              <p className={styles.lead}>
                Tell us what you need. Bahl will capture the project, give you a preliminary detailing scope signal,
                and route the enquiry for review.
              </p>
              <div className={styles.proofRow}>
                <span>Reinforcement</span><span>Shop drawings</span><span>As-builts</span><span>Coordination</span>
              </div>
            </div>
            <aside className={styles.scoreCard} aria-live="polite">
              <span className={styles.resultLabel}>Live scope signal</span>
              <strong>{estimate.level}</strong>
              <p>{estimate.summary}</p>
              <div className={styles.meter}><span style={{ width: estimate.score + '%' }} /></div>
              <small>Scope planning only — no engineering calculation is being performed here.</small>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.workspace}>
        <div className={styles.shell}>
          <div className={styles.workspaceGrid}>
            <form className={styles.form} onSubmit={submit} noValidate>
              <div className={styles.sectionHead}><span>01</span><div><h2>Project context</h2><p>Just enough information for a useful first review.</p></div></div>
              <div className={styles.grid}>
                <label>Your name<input required value={form.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" /></label>
                <label>Phone / WhatsApp<input required value={form.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" inputMode="tel" /></label>
                <label>Email <em>optional</em><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" /></label>
                <label>You are<select required value={form.role} onChange={(e) => update('role', e.target.value)}>
                  <option value="">Select one</option><option value="engineer">Structural / civil engineer</option><option value="contractor">Contractor</option>
                  <option value="architect">Architect</option><option value="developer">Developer / builder</option><option value="other">Other</option>
                </select></label>
                <label>Organisation <em>optional</em><input value={form.organization} onChange={(e) => update('organization', e.target.value)} /></label>
                <label>Project location<input required value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Abuja, Nigeria" /></label>
                <label>Project type<select required value={form.projectType} onChange={(e) => update('projectType', e.target.value)}>
                  <option value="">Select type</option><option>Residential</option><option>Commercial</option><option>Institutional</option>
                  <option>Industrial</option><option>Infrastructure / civil works</option><option>Renovation / alteration</option>
                </select></label>
                <label>Number of floors<input type="number" min={1} max={60} required value={form.floors} onChange={(e) => update('floors', Math.max(1, Number(e.target.value) || 1))} /></label>
              </div>

              <div className={styles.sectionHead}><span>02</span><div><h2>What do you need?</h2><p>Pick all that apply.</p></div></div>
              <div className={styles.choiceGrid}>
                {leadEngineConfig.drawingOptions.map((option) => {
                  const checked = form.drawingNeeds.includes(option.id);
                  return <button type="button" key={option.id} className={checked ? styles.choiceActive : styles.choice} onClick={() => toggleDrawing(option.id)} aria-pressed={checked}>
                    <span>{checked ? '✓' : '+'}</span>{option.label}
                  </button>;
                })}
              </div>

              <div className={styles.grid}>
                <label>Required by<select required value={form.deadline} onChange={(e) => update('deadline', e.target.value)}>
                  <option value="">Select urgency</option>{leadEngineConfig.deadlineOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                </select></label>
                <label>Budget / commercial range <em>optional</em><select value={form.budget} onChange={(e) => update('budget', e.target.value)}>
                  <option value="">Prefer not to say</option><option>Below ₦250k</option><option>₦250k – ₦750k</option><option>₦750k – ₦2m</option><option>₦2m+</option>
                </select></label>
              </div>

              <label>Project notes<textarea required minLength={15} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="What stage is the project at? What drawings exist? What is the immediate problem?" /></label>

              <div className={styles.upload}>
                <div><strong>Attach one project file</strong><p>Optional: PDF, DWG, DXF or ZIP, up to 15 MB.</p></div>
                <label className={styles.fileButton}>{file ? file.name : 'Choose file'}
                  <input type="file" accept=".pdf,.dwg,.dxf,.zip,application/pdf,application/zip" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>

              <div className={styles.consent}>
                <label className={styles.checkRow}><input type="checkbox" checked={form.serviceConsent} onChange={(e) => update('serviceConsent', e.target.checked)} />
                  <span>I agree that Bahl may use my details and project information to respond to this enquiry.</span>
                </label>
                <label className={styles.checkRow}><input type="checkbox" checked={form.marketingOptIn} onChange={(e) => update('marketingOptIn', e.target.checked)} />
                  <span>Send me occasional Bahl updates and useful project resources.</span>
                </label>
              </div>

              <div className={styles.formActions}>
                <button className={styles.primaryButton} type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending project…' : 'Get my project reviewed →'}
                </button>
                <span className={styles.microcopy}>Service response first. Marketing is optional.</span>
              </div>
              {status === 'error' && <p className={styles.error} role="alert">{error}</p>}
            </form>

            <aside className={styles.sidePanel}>
              <div className={styles.stickyCard}>
                <span className={styles.resultLabel}>Your live scope signal</span>
                <h3>{estimate.level} coordination load</h3>
                <p>{estimate.summary}</p>
                <div className={styles.packageList}>{estimate.recommendedPackage.map((item) => <div key={item}>{item}</div>)}</div>
                <div className={styles.sideRule} />
                <strong>Then what?</strong>
                <p>{estimate.nextStep}</p>
                <div className={styles.trust}><span>01 / Brief captured</span><span>02 / Bahl review</span><span>03 / Scope confirmed</span><span>04 / Quote / next action</span></div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
