import Link from 'next/link';
import type { Division } from '@/types/content';
import { DivisionMark } from './Logo';

export default function DivisionCard({ division }: { division: Division }) {
  return (
    <Link href={`/${division.slug}`} className="division-card" style={{ ['--division-accent' as string]: division.accent }}>
      <div className="division-card__top"><DivisionMark type={division.icon} accent={division.accent} /><span aria-hidden="true">↗</span></div>
      <div><p className="eyebrow">{division.title}</p><h3>{division.shortDescription}</h3></div>
      <p className="division-card__footer">Explore division</p>
    </Link>
  );
}
