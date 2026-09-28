import type { Article, Division, Project, TeamMember, Testimonial } from '@/types/content';

export const divisions: Division[] = [
  {
    id: 'studio',
    title: 'Bahl Studio',
    slug: 'studio',
    shortDescription: 'Interior and renovation design that makes spaces work beautifully.',
    description: 'We shape homes, workspaces and hospitality environments through thoughtful planning, material direction and practical renovation design.',
    accent: '#ff8a00',
    active: true,
    icon: 'studio',
    services: [
      { id: 'studio-1', title: 'Interior Design', description: 'Concepts, space planning, finishes and room-by-room design direction.' },
      { id: 'studio-2', title: 'Renovation Design', description: 'Upgrade existing spaces with a clear scope, coordinated drawings and finish strategy.' },
      { id: 'studio-3', title: 'Space Planning', description: 'Layouts that balance flow, function, furniture and the way people actually use a space.' },
    ],
  },
  {
    id: 'engineering',
    title: 'Bahl Engineering',
    slug: 'engineering',
    shortDescription: 'Structural detailing and technical drawings built for clarity and execution.',
    description: 'We turn structural and construction information into coordinated drawings that help teams build with fewer surprises.',
    accent: '#3b82f6',
    active: true,
    icon: 'engineering',
    services: [
      { id: 'eng-1', title: 'Structural Detailing', description: 'Detailed reinforcement, framing and connection information prepared for site use.' },
      { id: 'eng-2', title: 'Technical Drawings', description: 'Clean technical documentation with clear dimensions, notes and drawing conventions.' },
      { id: 'eng-3', title: 'Drawing Coordination', description: 'Coordinate disciplines early so the set tells one consistent story.' },
    ],
  },
  {
    id: 'digital',
    title: 'Bahl Digital',
    slug: 'digital',
    shortDescription: 'Websites and online systems that help businesses sell, book and operate.',
    description: 'We build fast websites and focused digital systems for businesses that want fewer manual steps and more direct customer action.',
    accent: '#10b981',
    active: true,
    icon: 'digital',
    services: [
      { id: 'dig-1', title: 'Business Websites', description: 'Responsive websites designed to build trust and turn visits into enquiries.' },
      { id: 'dig-2', title: 'Ordering Systems', description: 'Simple online ordering experiences that reduce friction from discovery to checkout.' },
      { id: 'dig-3', title: 'Booking Systems', description: 'Booking flows that make availability, intake and follow-up easier to manage.' },
    ],
  },
];

export const projects: Project[] = [
  {
    id: 'p1', title: 'Warm Minimal Residence', slug: 'warm-minimal-residence', divisionId: 'studio', projectType: 'Residential', year: 2026, location: 'Abuja',
    scope: 'Interior concept, space planning and renovation direction for a family living area.',
    problem: 'The existing layout felt segmented and underused, with inconsistent finishes across connected rooms.',
    solution: 'We opened up visual sightlines, simplified the palette and created a stronger transition between living, dining and circulation zones.',
    outcome: 'A calmer, more connected interior with a clearer furniture plan and a renovation scope the client could phase.',
    coverImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=82',
    beforeImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=78',
    afterImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=78',
    drawings: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=78'], featured: true,
  },
  {
    id: 'p2', title: 'Residential Structural Set', slug: 'residential-structural-set', divisionId: 'engineering', projectType: 'Residential', year: 2026, location: 'Abuja',
    scope: 'Structural detailing package for a two-storey residential build.',
    problem: 'The project needed a drawing set that translated the design intent into buildable reinforcement and detailing information.',
    solution: 'We organized the drawing sequence, clarified key sections and developed reinforcement details with consistent annotation.',
    outcome: 'A coordinated set that gives the site team a much clearer reference for setting out and reinforcement work.',
    coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=82',
    beforeImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=78',
    afterImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=78',
    drawings: ['https://images.unsplash.com/photo-1599707254554-027aeb4deacd?auto=format&fit=crop&w=1000&q=78'], featured: true,
  },
  {
    id: 'p3', title: 'Hospitality Booking Experience', slug: 'hospitality-booking-experience', divisionId: 'digital', projectType: 'Hospitality', year: 2025, location: 'Lagos',
    scope: 'Responsive website and booking journey for a hospitality brand.',
    problem: 'Visitors had to move between disconnected channels to understand rooms, availability and enquiry options.',
    solution: 'We rebuilt the information hierarchy around clear room discovery, booking intent and mobile-first calls to action.',
    outcome: 'A faster customer journey that gives visitors a direct path from brand discovery to booking enquiry.',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=82',
    beforeImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=78',
    afterImage: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1000&q=78',
    drawings: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=78'], featured: true,
  },
  {
    id: 'p4', title: 'Compact Retail Refresh', slug: 'compact-retail-refresh', divisionId: 'studio', projectType: 'Commercial', year: 2025, location: 'Abuja',
    scope: 'Space planning and interior direction for a compact retail environment.', problem: 'The original plan wasted high-value display frontage and made the customer route unclear.', solution: 'We reorganized circulation, grouped displays by purchase intent and introduced a tighter visual rhythm.', outcome: 'A more legible customer journey with more usable merchandising zones.',
    coverImage: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=1600&q=82',
    beforeImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=78', afterImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=78', drawings: ['https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=78'],
  },
  {
    id: 'p5', title: 'Technical Drawing Coordination', slug: 'technical-drawing-coordination', divisionId: 'engineering', projectType: 'Commercial', year: 2025, location: 'Kano',
    scope: 'Drawing coordination and technical documentation for a commercial build.', problem: 'Information was spread across inconsistent drawing conventions and revisions.', solution: 'We consolidated conventions, simplified references and tightened the drawing issue workflow.', outcome: 'A more reliable set for review, printing and site reference.',
    coverImage: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=1600&q=82',
    beforeImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=78', afterImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=78', drawings: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=78'],
  },
  {
    id: 'p6', title: 'Order-First Business Website', slug: 'order-first-business-website', divisionId: 'digital', projectType: 'Business', year: 2026, location: 'Abuja',
    scope: 'Conversion-focused business website with a direct online ordering path.', problem: 'The client relied on social media DMs and phone calls for every order.', solution: 'We structured products, FAQs, service information and order CTAs into a single responsive experience.', outcome: 'Customers get a clearer self-service path while the team receives better-qualified enquiries.',
    coverImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1600&q=82',
    beforeImage: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1000&q=78', afterImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=78', drawings: ['https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=78'],
  },
];

export const testimonials: Testimonial[] = [
  { id: 't1', quote: 'The process felt clear from the first conversation. We always knew what was being solved next.', name: 'Client feedback', company: 'Selected project' },
  { id: 't2', quote: 'Bahl helped turn a vague idea into something our team could actually work with.', name: 'Project feedback', company: 'Selected project' },
];

export const articles: Article[] = [];

export const team: TeamMember[] = [
  { id: 'tm1', name: 'Bahl Team', role: 'Design + Technical + Digital', bio: 'A practical multidisciplinary team built around design thinking, technical clarity and useful digital systems.' },
];
