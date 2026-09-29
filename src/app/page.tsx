import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from './components/SectionHeading';
import DivisionCard from './components/DivisionCard';
import ProjectCard from './components/ProjectCard';
import WhatsAppButton from './components/WhatsAppButton';
import Button from './components/Button';
import BahlBird from './components/BahlBird';
import BahlWordmark from './components/BahlWordmark';
import { getDivisions, getFeaturedProjects } from '@/lib/cms';

export default async function HomePage() {
  const divisions = await getDivisions();
  const featured = await getFeaturedProjects();
  return (
    <>
      <section className="hero section-dark">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow eyebrow--light">Design, engineering and digital, under one roof.</p>
            <h1>One Bahl for every idea worth building.</h1>
            <p className="hero-lead">Design, structural detailing and digital systems brought together under one growing brand — so you can move from idea to a clear next step without changing teams at every turn.</p>
            <div className="hero-actions">
              <Button variant="light" href="/contact" arrow>Request a consultation</Button>
              <WhatsAppButton label="WhatsApp" variant="dark" size="sm" location="home_hero" />
            </div>
            <div className="trust-row"><span>01 / Clarity</span><span>02 / Proof</span><span>03 / Action</span></div>
          </div>
          <div className="hero-media" aria-label="BAHL brand mark and project image">
            <div className="hero-orbit hero-orbit--one" />
            <div className="hero-orbit hero-orbit--two" />
            <div className="hero-logo-stage">
              <div className="hero-flight-mark"><BahlBird className="bahl-bird" /></div>
              <div className="hero-logo-caption"><BahlWordmark /><span>DESIGN, ENGINEERING AND DIGITAL&nbsp;&nbsp;/&nbsp;&nbsp;UNDER ONE ROOF</span></div>
            </div>
            <div className="hero-photo">
              <Image src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=82" alt="Modern architectural structure" fill priority sizes="(max-width: 900px) 100vw, 50vw" className="cover-image" />
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="divisions-title">
        <div className="container">
          <SectionHeading eyebrow="Divisions" title="Different disciplines. One Bahl standard." body="Start with the branch you need. Each division shares the same commitment to clarity, useful thinking and finished work." />
          <div className="division-grid">{divisions.map((division) => <DivisionCard key={division.id} division={division} />)}</div>
        </div>
      </section>

      <section className="section section-muted" aria-labelledby="featured-title">
        <div className="container">
          <div className="split-heading"><SectionHeading eyebrow="Selected work" title="Proof before promises." body="A small launch portfolio with the detail a potential client actually needs to see." /><Link className="text-link" href="/portfolio">See all projects <span aria-hidden="true">→</span></Link></div>
          <div className="project-grid">{featured.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
        </div>
      </section>

      <section className="section" aria-labelledby="process-title">
        <div className="container process-wrap"><SectionHeading eyebrow="Our process" title="Simple enough to understand. Detailed enough to trust." />
          <div className="process-grid">
            {[['01','Listen','We start with what you are trying to achieve, what is fixed and what can change.'],['02','Shape','We turn the brief into a clear scope, direction and next set of decisions.'],['03','Build','We produce the design, drawings or digital system with practical coordination.'],['04','Refine','We review, improve and hand over something the next person can actually use.']].map(([num,title,text]) => <article key={num} className="process-step"><span>{num}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="cta-section section-dark">
        <div className="container cta-inner"><div><p className="eyebrow eyebrow--light">Have something in mind?</p><h2>Bring us the problem. We’ll work out the next move.</h2></div><div className="cta-actions"><Button variant="light" href="/contact" arrow>Talk to Bahl</Button><Button variant="dark-outline" href="/portfolio">View work</Button></div></div>
      </section>
    </>
  );
}
