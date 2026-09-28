import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/types/content';
import { divisions } from '@/data/content';

export default function ProjectCard({ project }: { project: Project }) {
  const division = divisions.find((item) => item.id === project.divisionId)!;
  return (
    <Link href={`/portfolio/${project.slug}`} className="project-card">
      <div className="project-card__media">
        <Image src={project.coverImage} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" className="cover-image" />
        <div className="project-card__hover" aria-hidden="true">View project <span>↗</span></div>
      </div>
      <div className="project-card__meta">
        <div><span className="eyebrow" style={{ color: division.accent }}>{division.title}</span><h3>{project.title}</h3></div>
        <span className="project-year">{project.year}</span>
      </div>
      <p>{project.projectType} · {project.location}</p>
    </Link>
  );
}
