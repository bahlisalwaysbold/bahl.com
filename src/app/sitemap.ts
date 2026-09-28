import type { MetadataRoute } from 'next';
import { getProjects, getDivisions } from '@/lib/cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://bahl.com.ng';
  const divisions = await getDivisions();
  const projects = await getProjects();
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/divisions`, changeFrequency: 'weekly', priority: 0.8 },
    ...divisions.map((item) => ({ url: `${base}/${item.slug}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${base}/portfolio`, changeFrequency: 'weekly', priority: 0.9 },
    ...projects.map((item) => ({ url: `${base}/portfolio/${item.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.9 },
  ];
}
