import type { Metadata } from 'next';
import SectionHeading from '../components/SectionHeading';
import DivisionCard from '../components/DivisionCard';
import { getDivisions } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Bahl Divisions',
  description: 'Explore Bahl Interiors & Smart Living, Bahl Engineering, and Bahl Market Planning & Development.',
};

export default async function DivisionsPage() {
  const divisions = await getDivisions();
  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">Our divisions</p>
          <h1>Three disciplines. One Bahl.</h1>
          <p>
            Bahl operates through three clear branches: we transform spaces, deliver technical engineering work,
            and plan and build the business systems and digital products that move ideas into the market.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Live now" title="Know exactly what Bahl does." />
          <div className="division-grid division-grid--large">
            {divisions.map((division) => <DivisionCard key={division.id} division={division} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
