import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Analytics from './components/Analytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://bahl.com.ng'),
  title: { default: 'Bahl — Design, Engineering & Digital', template: '%s | Bahl' },
  description: 'Bahl brings interior design, structural detailing and useful digital systems together under one growing brand.',
  keywords: ['Bahl', 'interior design Abuja', 'structural detailing Nigeria', 'technical drawings', 'websites Abuja', 'digital systems Nigeria'],
  openGraph: { title: 'Bahl — Design, Engineering & Digital', description: 'One brand. Design, engineering and digital systems built for real projects.', type: 'website', url: 'https://bahl.com.ng' },
  icons: { icon: '/icon.svg' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Bahl',
  url: 'https://bahl.com.ng',
  email: 'hello@bahl.com.ng',
  description: 'Design, structural engineering and digital systems company.',
  areaServed: 'Nigeria',
  sameAs: [],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
