import type { Metadata } from 'next';
import SectionHeading from '../components/SectionHeading';
import DivisionCard from '../components/DivisionCard';
import { getDivisions } from '@/lib/cms';

export const metadata: Metadata = { title: 'Divisions', description: 'Explore Bahl Studio, Bahl Engineering and Bahl Digital.' };

export default async function DivisionsPage() {
  const divisions = await getDivisions();
  return <div className="page-shell"><section className="page-hero"><div className="container narrow"><p className="eyebrow">Our divisions</p><h1>Specialists under one Bahl system.</h1><p>Only live divisions appear here. When a new branch is ready, its content can plug into the same template instead of needing a new website structure.</p></div></section><section className="section"><div className="container"><SectionHeading eyebrow="Live now" title="Choose where your project starts." /><div className="division-grid division-grid--large">{divisions.map((division) => <DivisionCard key={division.id} division={division} />)}</div></div></section></div>;
}
