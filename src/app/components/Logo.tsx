import Link from 'next/link';

type Props = { compact?: boolean; light?: boolean };

function Mark({ light = false }: { light?: boolean }) {
  const fill = light ? '#f7f5ef' : '#101114';
  const cut = light ? '#101114' : '#f7f5ef';
  return (
    <svg aria-hidden="true" viewBox="0 0 56 64" className="logo-mark">
      <path fill={fill} d="M9 6 28 6l13 12-13 12 14 12-14 16H9l15-16L9 20 24 6H9Z" />
      <path fill={cut} d="M20 14h8l7 6-7 7h-8l7-7-7-6Zm0 23h8l8 7-8 9h-8l8-9-8-7Z" />
      <path fill="#ff8a00" d="m25 28 8 4-8 4Z" />
    </svg>
  );
}

export default function Logo({ compact = false, light = false }: Props) {
  return (
    <Link href="/" className={`brand-lockup ${light ? 'brand-lockup--light' : ''}`} aria-label="Bahl home">
      <Mark light={light} />
      {!compact && <span className="brand-word">BAHL</span>}
    </Link>
  );
}

export function DivisionMark({ type, accent }: { type: 'studio' | 'engineering' | 'digital'; accent: string }) {
  return (
    <span className="division-mark" style={{ ['--accent' as string]: accent }} aria-hidden="true">
      <span className={`division-icon division-icon--${type}`}>
        {type === 'studio' && <svg viewBox="0 0 32 32"><rect x="7" y="7" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M11 21V11h10" fill="none" stroke="currentColor" strokeWidth="2"/></svg>}
        {type === 'engineering' && <svg viewBox="0 0 32 32"><path d="M16 5 25 10v12l-9 5-9-5V10l9-5Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="m12 16 4 4 7-8" fill="none" stroke="currentColor" strokeWidth="2"/></svg>}
        {type === 'digital' && <svg viewBox="0 0 32 32"><circle cx="8" cy="16" r="3" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="24" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="24" cy="23" r="3" fill="none" stroke="currentColor" strokeWidth="2"/><path d="m11 15 10-5m-10 7 10 5" fill="none" stroke="currentColor" strokeWidth="2"/></svg>}
      </span>
    </span>
  );
}
