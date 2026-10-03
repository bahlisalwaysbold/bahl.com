'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/lead-engine/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to sign in.');
      router.replace('/lead-engine/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 430, margin: '12vh auto', padding: 30, border: '1px solid #e5e1d7', borderRadius: 20, background: '#fff', boxShadow: '0 22px 60px rgba(16,17,20,.08)' }}>
      <p className="eyebrow">BAHL / Lead Engine</p>
      <h1 style={{ margin: '8px 0 12px' }}>Control room</h1>
      <p style={{ color: '#777b84' }}>Private view for response speed, pipeline and lead sources.</p>
      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Dashboard password" autoComplete="current-password"
        style={{ width: '100%', minHeight: 52, padding: '0 13px', border: '1px solid #dcdad3', borderRadius: 12, marginTop: 16 }} />
      <button className="btn btn--solid" disabled={busy} style={{ marginTop: 14, width: '100%' }}>{busy ? 'Signing in…' : 'Open dashboard'}</button>
      {error && <p className="form-status form-status--error" role="alert">{error}</p>}
    </form>
  );
}
