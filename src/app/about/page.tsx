import type { Metadata } from 'next';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';

export const metadata: Metadata = {
  title: 'About Bahl',
  description: 'Bahl is a multidisciplinary company built around three businesses: Interiors & Smart Living, Engineering, and Market Planning & Development.',
};

export default function AboutPage() {
  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">About Bahl</p>
          <h1>One parent brand. Three businesses. Built to grow.</h1>
          <p>
            Bahl is a multidisciplinary company with three clear branches: Interiors & Smart Living, Engineering,
            and Market Planning & Development. Each business solves a different kind of problem, while the parent
            brand keeps the standard, systems and ambition connected.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <SectionHeading eyebrow="The Bahl model" title="Clarity without putting walls between disciplines." />
          <div className="rich-copy">
            <p>
              We don't create a new branch every time we learn a new skill. Related capabilities live together,
              so clients can understand what we do quickly and Bahl can keep building depth instead of fragmenting.
            </p>
            <p>
              That is why solar and smart homes sit inside Interiors & Smart Living, while software, SaaS, AI,
              business intelligence, commerce, CRM and automation sit inside Market Planning & Development.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading eyebrow="Three businesses" title="The live Bahl structure." />
          <div className="value-grid">
            {[
              ['01', 'Interiors & Smart Living', 'Interior design, renovation, space planning, solar installations and smart-home solutions.'],
              ['02', 'Engineering', 'Structural detailing, technical drawings and drawing coordination for project teams.'],
              ['03', 'Market Planning & Development', 'Software, SaaS, AI systems, business intelligence, e-commerce, booking, CRM, automation and digital products.'],
            ].map(([number, title, text]) => (
              <article className="value-card" key={number}>
                <span className="value-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <SectionHeading eyebrow="How we work" title="Different output. Same standard." />
          <div className="rich-copy">
            <p>
              Every Bahl engagement starts with the same question: what actually needs to happen next?
              From a room that needs redesigning, to drawings that need coordination, to a business that needs
              software or automation, we make the brief clearer before we make the output bigger.
            </p>
            <p>
              The result should be useful beyond the handover — a space people can use, drawings a team can build
              from, or a digital system that improves how a business operates.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container dark-panel">
          <div>
            <p className="eyebrow eyebrow--light">Where Bahl is going</p>
            <h2>Build depth inside the three businesses. Grow without losing the shape.</h2>
            <p>
              New capabilities should strengthen an existing branch before they become a new branch.
              That keeps the company easier to understand while making the underlying system more powerful.
            </p>
          </div>
          <Button variant="light" href="/divisions" arrow>Explore the three businesses</Button>
        </div>
      </section>
    </div>
  );
}
