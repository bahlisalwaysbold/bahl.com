import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Analytics from './components/Analytics';
import BahlLoader from './components/BahlLoader';

export const metadata: Metadata = {
  metadataBase: new URL('https://bahl.com.ng'),
  title: { default: 'Bahl — Spaces, Structures and Systems.', template: '%s | Bahl' },
  description: 'Bahl is a multidisciplinary company with three businesses: Interiors & Smart Living, Engineering, and Market Planning & Development.',
  keywords: ['Bahl', 'interior design Abuja', 'solar installation Abuja', 'smart home Nigeria', 'structural detailing Nigeria', 'technical drawings', 'software development Nigeria', 'SaaS Nigeria', 'AI systems Nigeria', 'business intelligence Nigeria', 'CRM systems Nigeria', 'automation Nigeria'],
  openGraph: { title: 'Bahl — Spaces, Structures and Systems.', description: 'Interiors & Smart Living. Engineering. Market Planning & Development.', type: 'website', url: 'https://bahl.com.ng' },
  icons: { icon: '/icon.svg' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Bahl',
  url: 'https://bahl.com.ng',
  email: 'hello@bahl.com.ng',
  description: 'Bahl is a multidisciplinary company operating through Interiors & Smart Living, Engineering, and Market Planning & Development.',
  areaServed: 'Nigeria',
  sameAs: [],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <noscript>
          <style>{`.page-loader { display: none !important; }`}</style>
        </noscript>
        <BahlLoader />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
