import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDivisionBySlug, getDivisions, getProjects } from '@/lib/cms';
import SectionHeading from '@/app/components/SectionHeading';
import Button from '@/app/components/Button';
import ProjectCard from '@/app/components/ProjectCard';
import ContactForm from '@/app/components/ContactForm';

export async function generateStaticParams() { const divisions = await getDivisions(); return divisions.map((division) => ({ slug: division.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const division = await getDivisionBySlug(slug); if (!division) return {};
  return { title: division.title, description: division.shortDescription, alternates: { canonical: `https://bahl.com.ng/${division.slug}` } };
}

export default async function DivisionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const division = await getDivisionBySlug(slug); if (!division) notFound();
  const projects = (await getProjects()).filter((project) => project.divisionId === division.id);
  return <div className="page-shell" style={{ ['--division-accent' as string]: division.accent }}>
    <section className="division-hero"><div className="container division-hero-grid"><div><p className="eyebrow" style={{ color: division.accent }}>{division.title}</p><h1>{division.shortDescription}</h1><p>{division.description}</p><div className="hero-actions"><Button variant="solid" href={`/contact?division=${division.id}`} arrow>Request a consultation</Button><Link className="text-link" href="/portfolio">See projects →</Link></div></div><div className="division-visual"><div className="division-visual__shape" style={{ background: `linear-gradient(140deg, ${division.accent}, transparent 70%)` }} /><Image src={projects[0]?.coverImage ?? 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82'} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className="cover-image" /></div></div></section>
    <section className="section"><div className="container"><SectionHeading eyebrow="Services" title="What this division can do." /><div className="service-grid">{division.services.map((service, index) => <article className="service-card" key={service.id}><span>0{index+1}</span><h3>{service.title}</h3><p>{service.description}</p></article>)}</div></div></section>
    <section className="section section-muted"><div className="container"><div className="split-heading"><SectionHeading eyebrow="Selected work" title="Proof in this discipline." /><Link className="text-link" href="/portfolio">View all work →</Link></div><div className="project-grid">{projects.slice(0,3).map((project) => <ProjectCard key={project.id} project={project} />)}</div></div></section>
    <section className="section"><div className="container two-col"><SectionHeading eyebrow="Start here" title="Tell us what you need." /><ContactForm defaultDivision={division.id} /></div></section>
  </div>;
}
