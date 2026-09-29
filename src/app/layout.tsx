import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Analytics from './components/Analytics';
import BahlLoader from './components/BahlLoader';

export const metadata: Metadata = {
  metadataBase: new URL('https://bahl.com.ng'),
  title: { default: 'Bahl — Design, engineering and digital, under one roof.', template: '%s | Bahl' },
  description: 'Bahl — Design, engineering and digital, under one roof.',
  keywords: ['Bahl', 'interior design Abuja', 'structural detailing Nigeria', 'technical drawings', 'websites Abuja', 'digital systems Nigeria'],
  openGraph: { title: 'Bahl — Design, engineering and digital, under one roof.', description: 'Bahl — Design, engineering and digital, under one roof.', type: 'website', url: 'https://bahl.com.ng' },
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
