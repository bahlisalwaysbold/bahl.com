import Link from 'next/link';
import { BAHL_BIRD_PATH } from './BahlBird';

type Props = { compact?: boolean; light?: boolean };

const birdPath = BAHL_BIRD_PATH;

export default function Logo({ compact = false, light = false }: Props) {
  const src = compact
    ? light ? '/logo/BAHL_Icon_White.svg' : '/logo/BAHL_Icon_Black.svg'
    : light ? '/logo/BAHL_Primary_White.svg' : '/logo/BAHL_Primary_Black.svg';

  return (
    <Link href="/" className={`brand-lockup ${compact ? 'brand-lockup--compact' : ''} ${light ? 'brand-lockup--light' : ''}`} aria-label="Bahl home">
      <img
        src={src}
        alt="BAHL"
        className="brand-logo-image"
        width={compact ? 48 : 142}
        height={compact ? 40 : 52}
        draggable={false}
      />
    </Link>
  );
}

export function DivisionMark({ accent }: { type?: string; accent: string }) {
  return (
    <span className="division-mark" style={{ ['--accent' as string]: accent }} aria-hidden="true">
      <svg className="division-bird" viewBox="35 4 100 108" focusable="false">
        <path d={birdPath} fill="currentColor" />
      </svg>
    </span>
  );
}
