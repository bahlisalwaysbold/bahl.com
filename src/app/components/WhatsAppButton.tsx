'use client';

import { trackEvent } from '@/lib/analytics';

export default function WhatsAppButton({ label = 'WhatsApp us', className = '' }: { label?: string; className?: string }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '');
  const href = number ? `https://wa.me/${number}?text=${encodeURIComponent('Hi Bahl, I would like to discuss a project.')}` : '/contact';
  return (
    <a
      className={`btn btn--ghost ${className}`}
      href={href}
      target={number ? '_blank' : undefined}
      rel={number ? 'noreferrer' : undefined}
      onClick={() => trackEvent('whatsapp_tap', { location: 'site' })}
      aria-label={number ? `${label}, opens WhatsApp in a new tab` : `${label}, opens the contact page`}
    >
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}
