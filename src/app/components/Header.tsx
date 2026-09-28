'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';
import WhatsAppButton from './WhatsAppButton';

const links = [
  { href: '/about', label: 'About' },
  { href: '/divisions', label: 'Divisions' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav id="primary-navigation" className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>
          ))}
          <WhatsAppButton label="WhatsApp" className="nav-whatsapp" />
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? '×' : '☰'}
        </button>
      </div>
    </header>
  );
}
