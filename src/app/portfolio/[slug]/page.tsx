import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects, getDivisionBySlug } from '@/lib/cms';
import SectionHeading from '@/app/components/SectionHeading';

export async function generateStaticParams() { const projects = await getProjects(); return projects.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const project = await getProjectBySlug(slug); if (!project) return { title: 'Project not found' }; return { title: project.title, description: project.scope };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const project = await getProjectBySlug(slug); if (!project) notFound();
  const division = (await getDivisionBySlug(project.divisionId))!;
  return <article className="project-detail" style={{ ['--division-accent' as string]: division.accent }}>
    <section className="project-detail__hero"><div className="container"><Link className="back-link" href="/portfolio">← Back to portfolio</Link><div className="project-kicker"><span className="eyebrow" style={{color: division.accent}}>{division.title}</span><span>{project.projectType}</span><span>{project.year}</span><span>{project.location}</span></div><h1>{project.title}</h1><p className="project-intro">{project.scope}</p><div className="project-hero-image"><Image src={project.coverImage} alt="" fill priority sizes="100vw" className="cover-image" /></div></div></section>
    <section className="section"><div className="container story-grid"><div><SectionHeading eyebrow="The problem" title="What needed changing." /><p>{project.problem}</p></div><div><SectionHeading eyebrow="The solution" title="What we did." /><p>{project.solution}</p></div><div><SectionHeading eyebrow="The outcome" title="What changed." /><p>{project.outcome}</p></div></div></section>
    {(project.beforeImage || project.afterImage) && <section className="section section-muted"><div className="container"><SectionHeading eyebrow="Before / after" title="The visible difference." /><div className="before-after-grid">{project.beforeImage && <figure><div className="media-frame"><Image src={project.beforeImage} alt="Before the Bahl project" fill sizes="(max-width: 900px) 100vw, 50vw" className="cover-image" /></div><figcaption>Before</figcaption></figure>}{project.afterImage && <figure><div className="media-frame"><Image src={project.afterImage} alt="After the Bahl project" fill sizes="(max-width: 900px) 100vw, 50vw" className="cover-image" /></div><figcaption>After</figcaption></figure>}</div></div></section>}
    {project.drawings?.length ? <section className="section"><div className="container"><SectionHeading eyebrow="Drawings / renders" title="A closer look at the work." /><div className="drawings-grid">{project.drawings.map((image, index) => <div className="media-frame" key={image}><Image src={image} alt={`Project drawing or render ${index+1}`} fill sizes="(max-width: 900px) 100vw, 50vw" className="cover-image" /></div>)}</div></div></section> : null}
    <section className="section"><div className="container dark-panel"><div><p className="eyebrow eyebrow--light">Next project?</p><h2>Have a brief like this one?</h2><p>Tell us the goal, the constraints and where the project is. We’ll start from there.</p></div><Link className="btn btn--light" href={`/contact?division=${division.id}`}>Start a conversation <span aria-hidden="true">↗</span></Link></div></section>
  </article>;
}
