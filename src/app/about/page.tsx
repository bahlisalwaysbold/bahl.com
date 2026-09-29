import type { Metadata } from 'next';
import SectionHeading from '../components/SectionHeading';
import Link from 'next/link';

export const metadata: Metadata = { title: 'About', description: 'Where Bahl is today, what we believe and how we work.' };

export default function AboutPage() {
  return (
    <div className="page-shell">
      <section className="page-hero"><div className="container narrow"><p className="eyebrow">About Bahl</p><h1>One brand, built to grow with the work.</h1><p>Bahl started as a simple idea: a space and its online presence shouldn’t be handled by three different people who never talk to each other. We bring design, structural detailing, and digital work together under one roof, so a project gets handled with one standard from drawing to launch.</p></div></section>
      <section className="section"><div className="container two-col"><SectionHeading eyebrow="Where we are today" title="Bahl is young." /><div className="rich-copy"><p>We’ve delivered one full project so far: a website for Salizra Homes Limited, a construction and real estate company in Abuja. Our design and structural detailing divisions are open and taking on their first clients now. We’d rather tell you that plainly than dress it up.</p></div></div></section>
      <section className="section section-muted"><div className="container"><SectionHeading eyebrow="Values" title="What we believe" /><div className="value-grid">{[['Clarity','Say what a project actually needs — not more, not less.'],['Practicality','Design for the budget and site in front of us, not an ideal one.'],['Quality','Get the technical details right, because they’re what a client notices when something’s wrong.'],['Growth','Build Bahl so a new division adds to it, not restarts it.']].map(([title,text]) => <article className="value-card" key={title}><span className="value-number">0{['Clarity','Practicality','Quality','Growth'].indexOf(title)+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="section"><div className="container two-col"><SectionHeading eyebrow="Where we’re going" title="Each one only launches once we can deliver it properly." /><div className="rich-copy"><p>As Bahl takes on more projects, we’re adding divisions in solar and interior fit-out, and eventually materials supply.</p></div></div></section>
      <section className="section"><div className="container dark-panel"><div><p className="eyebrow eyebrow--light">How we work</p><h2>Brief → direction → execution → handover.</h2><p>We keep the path visible. Every project should make the next decision easier, whether that decision belongs to the client, consultant, contractor or customer.</p></div><Link className="btn btn--light" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link></div></section>
    </div>
  );
}
