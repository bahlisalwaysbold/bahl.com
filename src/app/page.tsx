import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from './components/SectionHeading';
import DivisionCard from './components/DivisionCard';
import ProjectCard from './components/ProjectCard';
import WhatsAppButton from './components/WhatsAppButton';
import Button from './components/Button';
import JournalCard from './components/JournalCard';
import BahlBird from './components/BahlBird';
import BahlWordmark from './components/BahlWordmark';
import { getArticles, getDivisions, getFeaturedProjects } from '@/lib/cms';

export default async function HomePage() {
  const [divisions, featured, articles] = await Promise.all([
    getDivisions(),
    getFeaturedProjects(),
    getArticles(),
  ]);
  const latestArticles = articles.slice(0, 3);
  return (
    <div className="bahl-home">
      <section className="group-hero section-dark">
        <div className="container group-hero__inner">
          <div className="group-hero__copy">
            <div className="group-hero__kicker"><span className="eyebrow eyebrow--light">BAHL / multidisciplinary company</span><span className="group-hero__rule" /></div>
            <h1>Spaces.<br />Structures.<br />Systems.</h1>
            <p className="group-hero__lead">
              Bahl brings together three businesses under one standard: we transform spaces, deliver technical engineering work,
              and plan and build the systems and digital products that move ideas into the market.
            </p>
            <div className="hero-actions">
              <Button variant="light" href="/businesses" arrow>See what Bahl does</Button>
              <WhatsAppButton label="Talk to Bahl" variant="dark" size="sm" location="home_hero" />
            </div>
            <div className="group-hero__micro">
              <span><b>01</b> Interiors & Smart Living</span>
              <span><b>02</b> Engineering</span>
              <span><b>03</b> Market Planning & Development</span>
            </div>
          </div>

          <div className="group-hero__visual" aria-label="Bahl brand and project image">
            <div className="group-hero__glow" />
            <div className="group-hero__orbit group-hero__orbit--one" />
            <div className="group-hero__orbit group-hero__orbit--two" />
            <div className="group-hero__photo">
              <Image
                src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=84"
                alt="Modern architecture and structural form"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 48vw"
                className="cover-image"
              />
            </div>
            <div className="group-hero__brand-card">
              <div className="group-hero__bird"><BahlBird className="bahl-bird" /></div>
              <BahlWordmark />
              <span>ONE BRAND / THREE BUSINESSES</span>
            </div>
            <div className="group-hero__caption"><span>BAHL / 2026</span><span>BUILT IN NIGERIA / MADE TO MOVE</span></div>
          </div>
        </div>
      </section>

      <section className="section group-intro">
        <div className="container">
          <div className="group-intro__grid">
            <div>
              <p className="eyebrow">The Bahl model</p>
              <h2>Different work. One clear place to start.</h2>
            </div>
            <div className="group-intro__body">
              <p>
                A client should not have to decode Bahl before deciding to call us. The company is organized into three live
                branches, each with a clear job and a clear set of capabilities.
              </p>
              <Link className="text-link" href="/businesses">Explore the three businesses <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section group-businesses section-muted" aria-labelledby="businesses-title">
        <div className="container">
          <div className="split-heading">
            <SectionHeading eyebrow="Our businesses" title="Three businesses. One Bahl standard." body="These are the branches Bahl is building around right now. New capabilities can grow underneath them without fragmenting the parent brand." />
            <span className="group-section-number">03 / 03</span>
          </div>
          <div className="group-business-grid">
            {divisions.map((division, index) => (
              <Link key={division.id} href={'/' + division.slug} className="group-business-card" style={{ ['--division-accent' as string]: division.accent }}>
                <div className="group-business-card__top">
                  <span className="group-business-card__index">0{index + 1}</span>
                  <span className="group-business-card__arrow" aria-hidden="true">↗</span>
                </div>
                <p className="eyebrow">{division.title}</p>
                <h3>{division.shortDescription}</h3>
                <div className="group-business-card__services">
                  {division.services.map((service) => <span key={service.id}>{service.title}</span>)}
                </div>
                <span className="group-business-card__cta">Explore branch</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section group-connection">
        <div className="container">
          <div className="group-connection__heading">
            <p className="eyebrow">Why the structure matters</p>
            <h2>Three branches. One operating mindset.</h2>
            <p>We keep the businesses distinct so a stranger knows what Bahl does, but connected enough that a real project can move between disciplines without losing context.</p>
          </div>
          <div className="group-connection__grid">
            <article><span>01</span><h3>Plan</h3><p>Understand the problem, market, space or project before work starts.</p></article>
            <article><span>02</span><h3>Build</h3><p>Produce the drawings, spaces, software or systems the brief actually requires.</p></article>
            <article><span>03</span><h3>Move</h3><p>Hand over something usable, measurable and ready for the next decision.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-dark group-statement">
        <div className="container group-statement__grid">
          <div>
            <p className="eyebrow eyebrow--light">Bahl, in one line</p>
            <h2>We build the things that make good ideas real.</h2>
          </div>
          <div>
            <p>Interiors. Engineering. Market planning and development.</p>
            <p>One company, three clear ways to work with us.</p>
          </div>
        </div>
      </section>

      <section className="section section-muted" aria-labelledby="featured-title">
        <div className="container">
          <div className="split-heading">
            <SectionHeading eyebrow="Selected work" title="Proof before promises." body="Projects across the three branches show how Bahl thinks, coordinates and delivers." />
            <Link className="text-link" href="/portfolio">See all projects <span aria-hidden="true">→</span></Link>
          </div>
          <div className="project-grid">{featured.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
        </div>
      </section>

      <section className="section group-journal section-muted" aria-labelledby="journal-title">
        <div className="container">
          <div className="split-heading">
            <SectionHeading
              eyebrow="From Bahl"
              title="News, notes and what we're building."
              body="A lighter way to keep up with Bahl — project thinking, business updates and useful things we learn along the way."
            />
            <Link className="text-link" href="/journal">Open the Bahl Journal <span aria-hidden="true">→</span></Link>
          </div>
          {latestArticles.length > 0 && (
            <div className="journal-grid journal-grid--home">
              {latestArticles.map((article) => <JournalCard key={article.id} article={article} />)}
            </div>
          )}
          <div className="home-visual-strip" aria-label="Recent Bahl project photography">
            {featured.map((project, index) => (
              <Link key={project.id} href={'/portfolio/' + project.slug} className={'home-visual-strip__item home-visual-strip__item--' + (index + 1)}>
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                  className="cover-image"
                />
                <span>{project.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section group-about-tease">
        <div className="container group-about-tease__grid">
          <div>
            <p className="eyebrow">The bigger picture</p>
            <h2>Bahl is designed to grow without losing its shape.</h2>
          </div>
          <div>
            <p>We don't create a new branch every time a new capability appears. We put related work where it belongs, build the team around it, and let the parent brand accumulate strength.</p>
            <Link className="text-link" href="/about">Read the Bahl story <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="cta-section section-dark">
        <div className="container cta-inner">
          <div>
            <p className="eyebrow eyebrow--light">Start somewhere</p>
            <h2>Tell us what you are trying to build. We'll route it to the right Bahl branch.</h2>
          </div>
          <div className="cta-actions">
            <Button variant="light" href="/contact" arrow>Start a conversation</Button>
            <Button variant="dark-outline" href="/businesses">See the three businesses</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
