import type { Metadata } from 'next';
import SectionHeading from '../components/SectionHeading';
import PortfolioFilters from '../components/PortfolioFilters';
import { getDivisions, getProjects } from '@/lib/cms';

export const metadata: Metadata = { title: 'Portfolio', description: 'Filterable Bahl project portfolio by division, project type and year.' };

export default async function PortfolioPage() {
  const [divisions, projects] = await Promise.all([getDivisions(), getProjects()]);
  return <div className="page-shell"><section className="page-hero"><div className="container narrow"><p className="eyebrow">Portfolio</p><h1>Work with enough detail to understand the thinking.</h1><p>Filter by discipline, project type or year. Every project page is designed to answer the questions a serious client asks next.</p></div></section><section className="section"><div className="container"><SectionHeading eyebrow="Selected work" title="Design, technical and digital projects." /><PortfolioFilters projects={projects} divisions={divisions} /></div></section></div>;
}
