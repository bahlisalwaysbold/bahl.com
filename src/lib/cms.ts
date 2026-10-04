import { divisions as localDivisions, projects as localProjects, team, testimonials, articles } from '@/data/content';
import type { Division, Project } from '@/types/content';
import { sanityClient, sanityConfigured } from './sanity';

const branchIdentity = {
  studio: {
    title: 'Bahl Interiors & Smart Living',
    shortDescription: 'We transform spaces through interior design, renovation, solar and smart-home solutions.',
    description: 'We design, improve and equip homes, workspaces and hospitality environments — combining interiors and renovation with practical solar energy and smart-home solutions.',
    icon: 'studio',
  },
  engineering: {
    title: 'Bahl Engineering',
    shortDescription: 'Structural detailing and technical documentation built for clarity and execution.',
    description: 'We turn structural and construction information into coordinated technical drawings that help engineers, contractors and project teams build with fewer surprises.',
    icon: 'engineering',
  },
  digital: {
    title: 'Bahl Market Planning & Development',
    shortDescription: 'We plan, build and develop business systems, software and digital products that move ideas into the market.',
    description: 'We help businesses turn market needs into useful products and operating systems — from websites and software to SaaS, AI, business intelligence, commerce, CRM and automation.',
    icon: 'digital',
  },
} as const;

function normalizeDivision(item: Division): Division {
  const identity = branchIdentity[item.slug as keyof typeof branchIdentity];
  return identity ? { ...item, ...identity } : item;
}

export async function getDivisions(): Promise<Division[]> {
  if (sanityConfigured && sanityClient) {
    try {
      const items = await sanityClient.fetch<Division[]>(`*[_type == "division" && active == true] | order(_createdAt asc) { "id": _id, title, "slug": slug.current, shortDescription, "description": pt::text(description), accent, active, "icon": select(slug.current == "studio" => "studio", slug.current == "engineering" => "engineering", slug.current == "digital" => "digital", "studio"), "services": services[]->{ "id": _id, title, description } }`, {}, { next: { revalidate: 60 } });
      if (items?.length) return items.map(normalizeDivision);
    } catch { /* Fall back to the included launch dataset while CMS is being configured. */ }
  }
  return localDivisions.filter((item) => item.active);
}

export async function getDivisionBySlug(slug: string): Promise<Division | undefined> {
  if (sanityConfigured && sanityClient) {
    try {
      const item = await sanityClient.fetch<Division | null>(`*[_type == "division" && active == true && slug.current == $slug][0] { "id": _id, title, "slug": slug.current, shortDescription, "description": pt::text(description), accent, active, "icon": select(slug.current == "studio" => "studio", slug.current == "engineering" => "engineering", slug.current == "digital" => "digital", "studio"), "services": services[]->{ "id": _id, title, description } }`, { slug }, { next: { revalidate: 60 } });
      if (item) return normalizeDivision(item);
    } catch { /* Local fallback */ }
  }
  return localDivisions.find((item) => item.slug === slug && item.active);
}

export async function getProjects(): Promise<Project[]> {
  if (sanityConfigured && sanityClient) {
    try {
      const items = await sanityClient.fetch<Project[]>(`*[_type == "project"] | order(year desc, _createdAt desc) { "id": _id, title, "slug": slug.current, "divisionId": division->_id, projectType, year, location, scope, problem, solution, outcome, "coverImage": coverImage.asset->url, "beforeImage": beforeImage.asset->url, "afterImage": afterImage.asset->url, "drawings": drawings[].asset->url, featured }`, {}, { next: { revalidate: 60 } });
      if (items?.length) return items;
    } catch { /* Local fallback */ }
  }
  return localProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (sanityConfigured && sanityClient) {
    try {
      const item = await sanityClient.fetch<Project | null>(`*[_type == "project" && slug.current == $slug][0] { "id": _id, title, "slug": slug.current, projectType, year, location, scope, problem, solution, outcome, "coverImage": coverImage.asset->url, "beforeImage": beforeImage.asset->url, "afterImage": afterImage.asset->url, "drawings": drawings[].asset->url, "divisionId": division->_id }`, { slug }, { next: { revalidate: 60 } });
      if (item) return item;
    } catch { /* Local fallback */ }
  }
  return localProjects.find((item) => item.slug === slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((item) => item.featured).slice(0, 3);
}

export async function getTeam() { return team; }
export async function getTestimonials() { return testimonials; }
export async function getArticles() { return articles; }
