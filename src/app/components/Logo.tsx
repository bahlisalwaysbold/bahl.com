import Link from 'next/link';

type Props = { compact?: boolean; light?: boolean };

const birdPath = 'M 45.80 16.10 L 67.10 42.20 L 88.60 50.30 L 94.40 53.40 L 98.60 57.80 L 98.70 63.30 L 95.40 58.10 L 90.30 53.80 L 52.80 39.50 L 52.80 40.90 L 67.50 58.10 L 83.60 63.60 L 70.80 87.40 L 71.10 89.20 L 95.90 73.10 L 102.00 66.60 L 115.40 47.90 L 124.70 41.40 L 124.10 39.80 L 118.50 38.50 L 108.20 39.80 L 98.70 45.10 L 101.60 50.70 L 85.40 36.70 L 47.30 15.90 Z';

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
