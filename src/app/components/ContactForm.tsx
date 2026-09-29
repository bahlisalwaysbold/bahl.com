'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { divisions, projects } from '@/data/content';
import Button from './Button';

const initial = { name: '', phone: '', email: '', service: '', projectType: '', location: '', budget: '', message: '', division: '', website: '' };

export default function ContactForm({ defaultDivision = '' }: { defaultDivision?: string }) {
  const [form, setForm] = useState({ ...initial, division: defaultDivision });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const serviceOptions = divisions.flatMap((division) => division.services.map((service) => ({ ...service, divisionId: division.id })));
  const projectTypes = [...new Set(projects.map((item) => item.projectType))].sort();

  function update(name: string, value: string) { setForm((current) => ({ ...current, [name]: value })); }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending'); setError('');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');
      setStatus('success'); trackEvent('contact_form_submit', { division: form.division || 'general' }); setForm({ ...initial, division: form.division });
    } catch (err) {
      setStatus('error'); setError(err instanceof Error ? err.message : 'Unable to submit right now.'); trackEvent('contact_form_error');
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label>Full name<input required name="name" value={form.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" /></label>
        <label>Phone<input required name="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" inputMode="tel" /></label>
        <label>Email<input name="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" /></label>
        <label>Division<select required name="division" value={form.division} onChange={(e) => update('division', e.target.value)}><option value="">Select a division</option>{divisions.map((division) => <option key={division.id} value={division.id}>{division.title}</option>)}</select></label>
        <label>Service needed<select required name="service" value={form.service} onChange={(e) => update('service', e.target.value)}><option value="">Choose a service</option>{serviceOptions.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select></label>
        <label>Project type<select name="projectType" value={form.projectType} onChange={(e) => update('projectType', e.target.value)}><option value="">Choose a type</option>{projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
        <label>Location<input required name="location" value={form.location} onChange={(e) => update('location', e.target.value)} /></label>
        <label>Budget range<select name="budget" value={form.budget} onChange={(e) => update('budget', e.target.value)}><option value="">Prefer not to say</option><option>Under ₦1m</option><option>₦1m – ₦5m</option><option>₦5m – ₦15m</option><option>₦15m – ₦50m</option><option>₦50m+</option></select></label>
      </div>
      <label>Tell us about the project<textarea required name="message" rows={6} value={form.message} onChange={(e) => update('message', e.target.value)} /></label>
      <div className="honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" name="website" value={form.website} onChange={(e) => update('website', e.target.value)} /></label></div>
      <div className="form-actions">
        <Button variant="solid" type="submit" disabled={status === 'sending'} arrow>
          {status === 'sending' ? 'Sending…' : 'Request a consultation'}
        </Button>
        <p className="form-note">We use your details only to respond to this enquiry.</p>
      </div>
      {status === 'success' && <p className="form-status form-status--success" role="status">Thanks — your enquiry is in. We’ll get back to you with the next step.</p>}
      {status === 'error' && <p className="form-status form-status--error" role="alert">{error}</p>}
    </form>
  );
}
