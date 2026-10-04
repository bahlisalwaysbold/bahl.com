import Image from 'next/image';
import Link from 'next/link';
import type { Division, Project } from '@/types/content';
import SectionHeading from './SectionHeading';
import ProjectCard from './ProjectCard';
import Button from './Button';

const galleryFallbacks = [
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=82',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=82',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=82',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=82',
];

export default function InteriorsPage({ division, projects }: { division: Division; projects: Project[] }) {
  const leadProject = projects[0];
  const visualImages = [
    leadProject?.coverImage,
    leadProject?.afterImage,
    ...projects.slice(1).map((project) => project.coverImage),
    ...galleryFallbacks,
  ].filter(Boolean) as string[];

  return (
    <div className="interiors-page" style={{ ['--division-accent' as string]: division.accent }}>
      <section className="interiors-hero">
        <div className="interiors-hero__media">
          <Image
            src={leadProject?.coverImage ?? galleryFallbacks[0]}
            alt=""
            fill
            priority
            sizes="100vw"
            className="cover-image"
          />
        </div>
        <div className="interiors-hero__shade" />
        <div className="container interiors-hero__content">
          <div className="interiors-hero__eyebrow"><span>Bahl Interiors & Smart Living</span><span>01 / Spaces</span></div>
          <h1>Spaces made to feel right — and work beautifully.</h1>
          <p>Design. Renovate. Power. Connect.</p>
          <div className="hero-actions">
            <Button variant="light" href="/contact?division=studio" arrow>Request a consultation</Button>
            <Link className="interiors-hero__link" href="#gallery">See the spaces <span aria-hidden="true">↓</span></Link>
          </div>
        </div>
        <div className="interiors-hero__bottom">
          <span>ABUJA / NIGERIA</span>
          <span>DESIGN / RENOVATE / POWER / CONNECT</span>
        </div>
      </section>

      <section className="interiors-intro section">
        <div className="container interiors-intro__grid">
          <div>
            <p className="eyebrow">The experience</p>
            <h2>Make the space look good. Then make it work.</h2>
          </div>
          <p>We think about the room, the people, the power and the technology — together.</p>
        </div>
        <div className="container interiors-anchor-nav" aria-label="Interior page sections">
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a href="#smart-living">Smart living</a>
          <a href="#gallery">Gallery</a>
        </div>
      </section>

      <section id="services" className="section section-muted">
        <div className="container">
          <SectionHeading
            eyebrow="What we do"
            title="What we do."
            body="Four services. One smarter space."
          />
          <div className="interiors-service-grid">
            {division.services.map((service, index) => (
              <article key={service.id} className="interiors-service-card">
                <span>0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="interiors-service-card__arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container interiors-editorial">
          <div className="interiors-editorial__image">
            <Image
              src={leadProject?.afterImage ?? galleryFallbacks[1]}
              alt=""
              fill
              sizes="(max-width: 860px) 100vw, 52vw"
              className="cover-image"
            />
          </div>
          <div className="interiors-editorial__copy">
            <p className="eyebrow">Design direction</p>
            <h2>We design around people, not just photographs.</h2>
            <p>We turn “make it better” into clear design decisions that can actually be executed.</p>
            <div className="interiors-editorial__points">
              <span>Residential</span>
              <span>Commercial</span>
              <span>Hospitality</span>
            </div>
            <Link className="text-link" href="/portfolio">See the project archive <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section id="projects" className="section section-muted">
        <div className="container">
          <div className="split-heading">
            <SectionHeading eyebrow="Projects" title="Spaces we've been thinking through." />
            <Link className="text-link" href="/portfolio">View all work <span aria-hidden="true">→</span></Link>
          </div>
          <div className="project-grid">
            {projects.slice(0, 3).map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </div>
      </section>

      <section id="smart-living" className="section interiors-smart">
        <div className="container interiors-smart__grid">
          <div>
            <p className="eyebrow eyebrow--light">Smart living</p>
            <h2>Power + tech, without the headache.</h2>
            <p>Solar, lighting, security and controls planned around the way you actually use the space.</p>
            <div className="interiors-smart__chips">
              <span>Solar installations</span>
              <span>Smart home controls</span>
              <span>Connected lighting</span>
              <span>Security & automation</span>
            </div>
          </div>
          <div className="interiors-smart__image">
            <Image
              src={visualImages[3] ?? galleryFallbacks[2]}
              alt=""
              fill
              sizes="(max-width: 860px) 100vw, 42vw"
              className="cover-image"
            />
          </div>
        </div>
      </section>

      <section id="gallery" className="section">
        <div className="container">
          <div className="split-heading">
            <SectionHeading eyebrow="Gallery" title="See the work." body="Spaces, details and finished moments — all in one place." />
            <span className="eyebrow">Tap any image</span>
          </div>
          <div className="interiors-gallery">
            {visualImages.slice(0, 7).map((src, index) => (
              <div key={src + index} className={'interiors-gallery__item interiors-gallery__item--' + ((index % 5) + 1)}>
                <Image src={src} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" className="cover-image" />
                <span>BAHL / {String(index + 1).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section interiors-consultation">
        <div className="container interiors-consultation__grid">
          <div>
            <p className="eyebrow">Make a move</p>
            <h2>Have a space that needs a smarter plan?</h2>
          </div>
          <div>
            <p>Send the space. Tell us the problem. We’ll take it from there.</p>
            <div className="hero-actions">
              <Button variant="solid" href="/contact?division=studio" arrow>Request a consultation</Button>
              <Link className="text-link" href="/businesses">See all Bahl businesses <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
