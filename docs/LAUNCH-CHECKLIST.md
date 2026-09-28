# Bahl launch checklist

## Before going live

- [ ] Connect `bahl.com.ng` to the production host.
- [ ] Create `hello@bahl.com.ng` (and any team aliases).
- [ ] Put the live WhatsApp number in `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- [ ] Add `NEXT_PUBLIC_GA_ID` and confirm CTA/form/WhatsApp events in analytics.
- [ ] Add the Sanity project ID/dataset, create the schemas, and replace demo content with real content.
- [ ] Configure `RESEND_API_KEY`, sender and recipient emails.
- [ ] Configure `LEAD_WEBHOOK_URL` to append lead rows to the chosen sheet.
- [ ] Replace Unsplash demo project images with optimized real project images.
- [ ] Replace the map placeholder with the preferred map embed.
- [ ] Add real team members and testimonials when approved.
- [ ] Add domain-level SPF/DKIM/DMARC for the new email domain.
- [ ] Confirm automatic HTTPS, deployment backups and a restore path.

## Content editor workflow

A project should be entered once in the CMS with a division reference, project type, year, scope, problem, solution, outcome and imagery. The portfolio filters, division pages and project detail pages then pick it up automatically.

A new division should be added as a Division record, set `active: true`, and given its services. The `/[slug]` reusable route will use the same page structure as Studio, Engineering and Digital.
