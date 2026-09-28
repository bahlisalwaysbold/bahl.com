import type { Metadata } from 'next';
import SectionHeading from '../components/SectionHeading';
import Link from 'next/link';

export const metadata: Metadata = { title: 'About', description: 'The Bahl story, values and working approach.' };

export default function AboutPage() {
  return (
    <div className="page-shell">
      <section className="page-hero"><div className="container narrow"><p className="eyebrow">About Bahl</p><h1>A practical company with room to grow.</h1><p>We are building Bahl as one parent brand with specialist divisions underneath it — design, engineering and digital today, with room for the right new branches tomorrow.</p></div></section>
      <section className="section"><div className="container two-col"><SectionHeading eyebrow="The story" title="Built around useful work, not complicated labels." /><div className="rich-copy"><p>Bahl sits at the point where creative thinking meets technical execution. A client might need a better room, a cleaner drawing set or a website that finally makes ordering simple. The discipline changes; our standard does not.</p><p>That is why the website is structured the same way the company is structured: one strong parent identity, reusable divisions and proof-led project stories.</p></div></div></section>
      <section className="section section-muted"><div className="container"><SectionHeading eyebrow="Values" title="How we want people to experience Bahl." /><div className="value-grid">{[['Clarity','Say what the project needs, what it does not need and what happens next.'],['Practicality','Make decisions that survive contact with budgets, materials, site conditions and real customers.'],['Quality','Sweat the details that affect trust: drawings, spacing, responsiveness, finish and follow-through.'],['Growth','Build systems that can expand without throwing away the foundation.']].map(([title,text]) => <article className="value-card" key={title}><span className="value-number">0{['Clarity','Practicality','Quality','Growth'].indexOf(title)+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="section"><div className="container dark-panel"><div><p className="eyebrow eyebrow--light">How we work</p><h2>Brief → direction → execution → handover.</h2><p>We keep the path visible. Every project should make the next decision easier, whether that decision belongs to the client, consultant, contractor or customer.</p></div><Link className="btn btn--light" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link></div></section>
    </div>
  );
}
