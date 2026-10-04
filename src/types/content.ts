export type Division = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  accent: string;
  active: boolean;
  icon?: string;
  services: Service[];
};

export type Service = {
  id: string;
  title: string;
  description: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  divisionId: string;
  projectType: string;
  year: number;
  location: string;
  scope: string;
  problem: string;
  solution: string;
  outcome: string;
  coverImage: string;
  beforeImage?: string;
  afterImage?: string;
  drawings?: string[];
  featured?: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  company: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  body: string;
  category?: string;
  coverImage?: string;
  featured?: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
};
