import { SOCIAL_LINKS } from '@/lib/site';

type SocialKey = keyof typeof SOCIAL_LINKS;

const socials: Array<{
  key: SocialKey;
  label: string;
  short: string;
}> = [
  { key: 'instagram', label: 'Instagram', short: 'IG' },
  { key: 'facebook', label: 'Facebook', short: 'FB' },
  { key: 'linkedin', label: 'LinkedIn', short: 'in' },
  { key: 'x', label: 'X', short: 'X' },
  { key: 'tiktok', label: 'TikTok', short: 'TT' },
  { key: 'youtube', label: 'YouTube', short: 'YT' },
];

function SocialIcon({ name }: { name: SocialKey }) {
  const common = { viewBox: '0 0 24 24', ariaHidden: true as const, focusable: false as const };
  switch (name) {
    case 'instagram':
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>;
    case 'facebook':
      return <svg {...common}><path fill="currentColor" d="M13.4 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.6 1.6-1.6h1.7V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.7v8h3.1Z"/></svg>;
    case 'linkedin':
      return <svg {...common}><path fill="currentColor" d="M5.1 8.2A2.1 2.1 0 1 0 5 4a2.1 2.1 0 0 0 .1 4.2ZM3.2 20.5h3.8v-9.7H3.2v9.7ZM9.3 10.8h3.7v1.3h.1c.5-.9 1.7-1.8 3.6-1.8 3.8 0 4.5 2.5 4.5 5.7v4.5h-3.8v-4c0-1 0-2.4-1.5-2.4s-1.8 1.1-1.8 2.3v4.1H9.3v-9.7Z"/></svg>;
    case 'x':
      return <svg {...common}><path fill="currentColor" d="M5 4h4.1l3.1 4.4L15.9 4H19l-5.4 6.3L19.7 20h-4.1l-3.6-5.1L7.7 20H4.6l5.8-6.8L5 4Zm4.8 1.8H8l7.8 12.4h1.8L9.8 5.8Z"/></svg>;
    case 'tiktok':
      return <svg {...common}><path fill="currentColor" d="M15.2 4c.5 1.8 1.5 3.1 3.3 3.6v3a7.8 7.8 0 0 1-3.2-1v5.2a5.6 5.6 0 1 1-5.6-5.6c.4 0 .8 0 1.2.1v3a2.8 2.8 0 1 0 1.6 2.5V4h2.7Z"/></svg>;
    case 'youtube':
      return <svg {...common}><rect x="2.5" y="5.3" width="19" height="13.4" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/><path fill="currentColor" d="m10 9 5 3-5 3V9Z"/></svg>;
  }
}

export default function SocialLinks({ compact = false, label = 'Follow Bahl' }: { compact?: boolean; label?: string }) {
  return (
    <div className={'social-links' + (compact ? ' social-links--compact' : '')}>
      {!compact && <span className="social-links__label">{label}</span>}
      <div className="social-links__row">
        {socials.map((social) => {
          const href = SOCIAL_LINKS[social.key];
          if (!href) {
            return (
              <span key={social.key} className="social-link social-link--disabled" aria-label={social.label + ' — link coming soon'} title={social.label + ' — link coming soon'}>
                <SocialIcon name={social.key} />
                <span className="social-link__sr">{social.label}</span>
              </span>
            );
          }
          return (
            <a key={social.key} className={'social-link social-link--' + social.key} href={href} target="_blank" rel="noreferrer noopener" aria-label={'Bahl on ' + social.label}>
              <SocialIcon name={social.key} />
              <span className="social-link__sr">{social.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
