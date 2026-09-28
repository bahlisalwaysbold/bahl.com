import type { Metadata } from 'next';
import ContactForm from '../components/ContactForm';
import WhatsAppButton from '../components/WhatsAppButton';
import SectionHeading from '../components/SectionHeading';

export const metadata: Metadata = { title: 'Contact', description: 'Start a project conversation with Bahl.' };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ division?: string }> }) {
  const params = await searchParams;
  return <div className="page-shell"><section className="page-hero"><div className="container narrow"><p className="eyebrow">Contact</p><h1>Bring us the project. We’ll find the next move.</h1><p>Tell us what you are building, changing or trying to automate. The form tags the enquiry to the division you choose so it reaches the right team.</p></div></section><section className="section"><div className="container contact-layout"><div className="contact-sidebar"><SectionHeading eyebrow="Start a conversation" title="You can go straight to WhatsApp too." body="For a quick first message, use WhatsApp. For projects that need a proper brief, use the form."/><WhatsAppButton label="Open WhatsApp"/><div className="contact-details"><a href="mailto:hello@bahl.com.ng">hello@bahl.com.ng</a><span>Abuja, Nigeria</span><span>By appointment / project schedule</span></div><div className="map-placeholder" aria-label="Map placeholder for Bahl location"><span>MAP</span><small>Replace with your preferred map embed.</small></div></div><ContactForm defaultDivision={params.division ?? ''} /></div></section></div>;
}
