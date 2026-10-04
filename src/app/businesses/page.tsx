import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHeading from '../components/SectionHeading';
import { getDivisions } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Bahl Businesses',
  description: 'Explore the three businesses that make up Bahl: Interiors & Smart Living, Engineering, and Market Planning & Development.',
};

export default async function BusinessesPage() {
  const divisions = await getDivisions();

  return (
    <div className="page-shell">
      <section className="page-hero businesses-hero">
        <div className="container narrow">
          <p className="eyebrow">The Bahl group</p>
          <h1>One company. Three businesses. No guessing.</h1>
          <p>One parent brand. Three clear ways to work with us.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="businesses-index">
            <div>
              <p className="eyebrow">01 / 03</p>
              <h2>Pick your lane.</h2>
            </div>
            <p>Start with one. Bring in another when the project needs it.</p>
          </div>

          <div className="businesses-list">
            {divisions.map((division, index) => (
              <Link
                key={division.id}
                href={'/' + division.slug}
                className="business-row"
                style={{ ['--division-accent' as string]: division.accent }}
              >
                <span className="business-row__index">0{index + 1}</span>
                <div className="business-row__name">
                  <span className="eyebrow">{division.title}</span>
                  <h3>{division.shortDescription}</h3>
                </div>
                <div className="business-row__services">
                  {division.services.map((service) => <span key={service.id}>{service.title}</span>)}
                </div>
                <span className="business-row__arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="How they connect"
            title="The disciplines stay distinct. The thinking stays connected."
            body="A renovation can need solar. A building project can need coordinated technical drawings. A growing company can need a website, CRM and automation working together. Bahl keeps those relationships visible without turning every capability into another branch."
          />
          <div className="businesses-connection-grid">
            <article><span>SPACES</span><h3>Interiors & Smart Living</h3><p>Design. Renovate. Power. Connect.</p></article>
            <article><span>STRUCTURES</span><h3>Engineering</h3><p>Detail. Draw. Coordinate.</p></article>
            <article><span>SYSTEMS</span><h3>Market Planning & Development</h3><p>Build software. Connect data. Automate work.</p></article>
          </div>
        </div>
      </section>

      <section className="cta-section section-dark">
        <div className="container cta-inner">
          <div>
            <p className="eyebrow eyebrow--light">Start with the brief</p>
            <h2>Not sure where you fit? Just tell us the problem.</h2>
          </div>
          <Link className="btn btn--light" href="/contact">Talk to Bahl <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
