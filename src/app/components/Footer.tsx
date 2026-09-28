import Link from 'next/link';
import Logo from './Logo';
import WhatsAppButton from './WhatsAppButton';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo light />
          <p className="footer-copy">Design, engineering and digital systems under one growing Bahl brand.</p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <div className="footer-links"><Link href="/about">About</Link><Link href="/divisions">Divisions</Link><Link href="/portfolio">Portfolio</Link><Link href="/contact">Contact</Link></div>
        </div>
        <div>
          <p className="footer-label">Contact</p>
          <div className="footer-links"><a href="mailto:hello@bahl.com.ng">hello@bahl.com.ng</a><span>Abuja, Nigeria</span></div>
          <WhatsAppButton label="Start on WhatsApp" className="footer-whatsapp" />
        </div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Bahl. All rights reserved.</span><span>Built for clarity, proof and action.</span></div>
    </footer>
  );
}
