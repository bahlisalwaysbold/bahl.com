'use client';

import { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';
import type { Division, Project } from '@/types/content';

export default function PortfolioFilters({ projects, divisions }: { projects: Project[]; divisions: Division[] }) {
  const [division, setDivision] = useState('all');
  const [type, setType] = useState('all');
  const [year, setYear] = useState('all');
  const types = useMemo(() => [...new Set(projects.map((item) => item.projectType))].sort(), [projects]);
  const years = useMemo(() => [...new Set(projects.map((item) => String(item.year)))].sort().reverse(), [projects]);
  const filtered = projects.filter((project) =>
    (division === 'all' || project.divisionId === division) &&
    (type === 'all' || project.projectType === type) &&
    (year === 'all' || String(project.year) === year)
  );

  return (
    <>
      <div className="filters" aria-label="Portfolio filters">
        <label>Division<select value={division} onChange={(e) => setDivision(e.target.value)}><option value="all">All divisions</option>{divisions.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label>Project type<select value={type} onChange={(e) => setType(e.target.value)}><option value="all">All project types</option>{types.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label>Year<select value={year} onChange={(e) => setYear(e.target.value)}><option value="all">All years</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </div>
      <p className="filter-result" aria-live="polite">Showing {filtered.length} project{filtered.length === 1 ? '' : 's'}.</p>
      <div className="project-grid">
        {filtered.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
      {filtered.length === 0 && <div className="empty-state"><h3>No projects match those filters.</h3><p>Try broadening the selection.</p></div>}
    </>
  );
}
