const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

export const WHATSAPP_NUMBER = rawNumber.replace(/\D/g, '');

export const WHATSAPP_MESSAGE =
  'Hi Bahl, I would like to discuss a project.';

export const WHATSAPP_URL = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
  : null;

export const CONTACT_FALLBACK = '/contact';
