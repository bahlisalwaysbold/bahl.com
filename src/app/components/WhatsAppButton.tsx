'use client';

import { trackEvent } from '@/lib/analytics';
import { WHATSAPP_URL, CONTACT_FALLBACK } from '@/lib/site';
import { WhatsAppIcon } from './Icons';

type Props = {
  label?: string;
  className?: string;
  variant?: 'brand' | 'outline' | 'dark';
  size?: 'md' | 'sm';
  location?: string;
  showLabel?: boolean;
};

const variantClass = {
  brand: 'btn--whatsapp',
  outline: 'btn--whatsapp-outline',
  dark: 'btn--whatsapp-dark',
} as const;

export default function WhatsAppButton({
  label = 'Chat on WhatsApp',
  className = '',
  variant = 'brand',
  size = 'md',
  location = 'site',
  showLabel = true,
}: Props) {
  const external = Boolean(WHATSAPP_URL);
  const href = WHATSAPP_URL ?? CONTACT_FALLBACK;
  const accessibleName = external
    ? `${label}, opens WhatsApp in a new tab`
    : `${label}, opens the contact page`;

  return (
    <a
      className={['btn', 'btn--whatsapp-base', variantClass[variant], size === 'sm' ? 'btn--sm' : '', className]
        .filter(Boolean)
        .join(' ')}
      href={href}
      {...(external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {})}
      onClick={() => trackEvent('whatsapp_tap', { location })}
      aria-label={accessibleName}
      data-wa={external ? 'external' : 'fallback'}
    >
      <WhatsAppIcon className="btn__icon" />
      {showLabel && <span className="btn__label">{label}</span>}
    </a>
  );
}
