# BAHL — Lean Launch Website

A Next.js 16 + TypeScript, mobile-first company site for BAHL, built around reusable divisions and projects. The launch version is intentionally lean: no shop, logins, 3D, or heavy motion.

## What is included

- Home, About, Divisions overview, reusable division pages, Portfolio, project detail pages, and Contact.
- Filterable portfolio by division, project type, and year.
- Accessible keyboard navigation, skip link, visible focus states, semantic landmarks, reduced-motion support, alt text, and non-hover fallbacks.
- SEO metadata, Open Graph basics, `sitemap.xml`, `robots.txt`, and JSON-LD LocalBusiness/Organization markup.
- Event tracking for CTA clicks, WhatsApp taps, filter usage, and contact submissions through Google Analytics when `NEXT_PUBLIC_GA_ID` is configured.
- Contact API with honeypot spam protection plus optional Resend email delivery and a generic lead webhook for Google Sheets/Make/n8n/Zapier-style workflows.
- Local demo content is used by default. The content layer is isolated in `src/lib/cms.ts` so Sanity can replace it without changing page components.
- Content model/type plan in `src/types/content.ts` and reference Sanity schemas in `sanity/schemas/`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Turn on Sanity

The current frontend is intentionally runnable without credentials. For production content editing, create a Sanity project, set the environment variables above, and replace the local content provider in `src/lib/cms.ts` with the Sanity client/queries. Sanity's official `next-sanity` toolkit supports Next.js App Router, typed GROQ queries, visual editing, and live content. See the current official guide: https://www.sanity.io/docs/nextjs

## Configure contact delivery

Set:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `LEAD_WEBHOOK_URL`

The API route accepts: name, phone, email, service, projectType, location, budget, message, and division. The hidden honeypot field is `website`.

For a lead sheet, point `LEAD_WEBHOOK_URL` at a trusted webhook/Apps Script/automation endpoint that appends one row to Google Sheets. Keep the webhook URL server-side.

## WhatsApp

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` as digits only, country code included, e.g. `23480...`. The site will build a `wa.me` link and track the tap event.

## Domain/email

Point `bahl.com.ng` to your production host and create the mailboxes/aliases you want, such as `hello@bahl.com.ng` and `projects@bahl.com.ng`.

## Performance notes

- Hero media is high priority; portfolio imagery is lazy-loaded.
- Images are configured for AVIF/WebP through Next Image.
- Motion is CSS-only and disabled/reduced under `prefers-reduced-motion`.
- No carousels, video backgrounds, 3D libraries, or giant animation bundles.

## Production hardening

Use a managed deployment with automatic HTTPS, Git-based deploys, and backups for Sanity and the lead sheet. Add server-side rate limiting/Turnstile/reCAPTCHA once traffic grows beyond the lean launch phase.
