import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeading from '../components/SectionHeading';
import JournalCard from '../components/JournalCard';
import { getArticles, getProjects } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Bahl Journal',
  description: 'News, project notes, company updates and visual stories from Bahl.',
};

export default async function JournalPage() {
  const [articles, projects] = await Promise.all([getArticles(), getProjects()]);
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const rest = articles.filter((article) => article.id !== featured?.id).slice(0, 6);
  const visualProjects = projects.slice(0, 6);

  return (
    <div className="page-shell">
      <section className="page-hero journal-hero">
        <div className="container narrow">
          <p className="eyebrow">Bahl Journal</p>
          <h1>News, updates, project notes and the work behind the work.</h1>
          <p>Come here when you want to see what Bahl is building, learning, testing and delivering.</p>
        </div>
      </section>

      {featured && (
        <section className="section">
          <div className="container">
            <Link href={'/journal/' + featured.slug} className="journal-feature">
              <div className="journal-feature__media">
                <Image
                  src={featured.coverImage ?? 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=84'}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 60vw"
                  className="cover-image"
                />
              </div>
              <div className="journal-feature__copy">
                <p className="eyebrow">{featured.category ?? 'Bahl Update'}</p>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <span className="text-link">Open story <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="section section-muted">
        <div className="container">
          <div className="split-heading">
            <SectionHeading eyebrow="Latest" title="The newest from Bahl." />
          </div>
          {rest.length > 0 ? (
            <div className="journal-grid">
              {rest.map((article) => <JournalCard key={article.id} article={article} />)}
            </div>
          ) : (
            <p className="journal-empty">More notes are on the way.</p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Visual journal" title="A closer look at the work." body="A lighter way to keep up with Bahl: images, project details and moments from the three businesses." />
          <div className="journal-visual-grid">
            {visualProjects.map((project, index) => (
              <Link key={project.id} href={'/portfolio/' + project.slug} className={'journal-visual-card journal-visual-card--' + ((index % 5) + 1)}>
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
          <div className="journal-footer-link">
            <Link className="text-link" href="/portfolio">Open the full project archive <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="cta-section section-dark">
        <div className="container cta-inner">
          <div>
            <p className="eyebrow eyebrow--light">Keep in touch</p>
            <h2>Have a project, idea or question for Bahl?</h2>
          </div>
          <Link className="btn btn--light" href="/contact">Start a conversation <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
