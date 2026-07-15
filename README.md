# Passion Dream

A luxury bilingual (Albanian 🇦🇱 / English) **digital showroom** for the Albanian beauty & jewelry brand **Passion Dream** (`@passion_dream17`).

This is **not** an online store — the brand sells exclusively through **Instagram DMs**. The website's job is to build trust, showcase products beautifully, and drive every visitor to Instagram to order. There are no prices, cart, or checkout; every call-to-action opens `instagram.com/passion_dream17` in a new tab.

Editorial, magazine-inspired design — cream & ivory canvas, gold accents, Playfair Display + Cormorant Garamond + Inter, cinematic Framer Motion reveals and parallax.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS** (custom luxury design tokens)
- **Framer Motion** (parallax, text-mask reveals, staggered scroll animations)
- **Lucide** icons · **next/font** (self-hosted Google fonts)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (28 static pages)
npm run start    # serve the production build
```

## Features

- **Instagram-first** — every CTA ("Order via Instagram", "Message us", "Follow") opens the official profile in a new tab via the reusable [`InstagramCTA`](components/ui/InstagramCTA.tsx) component. No cart, prices, or checkout anywhere.
- **Bilingual** — Albanian is the default; toggle SQ / EN in the nav. Persisted to `localStorage`, syncs `<html lang>`.
- **Homepage** — parallax hero, featured collections, best sellers, brand story, infinite marquee, trust badges, a large Instagram section (stories highlights, reels, feed, follower count), reviews, and an Instagram-follow newsletter block.
- **Collections** — `/collections/[slug]` (jewelry, necklaces, earrings, bracelets, skincare, beauty, accessories), each ending in a "See the full collection on Instagram" CTA.
- **Product showcase pages** — `/products/[slug]` with editorial photography, storytelling, materials (jewelry) / how-to-use (skincare), care, and an "Interested in this piece?" Instagram band.
- **Listing pages** — `/new` (New Arrivals) and `/best-sellers`.
- **Contact** — `/contact` is Instagram-first: profile card with follower count, Messenger, phone, business hours and location.
- **SEO** — per-page metadata, Open Graph / Twitter cards, Organization + WebSite + Product + Breadcrumb JSON-LD (Product schema carries no price — it points to Instagram), dynamic `sitemap.xml`, `robots.txt`, canonical URLs.
- **Accessibility** — skip link, focus states, `prefers-reduced-motion` support, semantic headings, aria labels, ≥44px touch targets.

## Configure before launch

In [`lib/site.ts`](lib/site.ts): the Instagram handle (`passion_dream17`), `phone`, `followers`/`posts` counts, `hours`, and the placeholder `domain`.

## Content

Product data & all copy live in [`lib/products.ts`](lib/products.ts) and [`lib/i18n.ts`](lib/i18n.ts).
Product photography (from the brand's Instagram) is in [`public/products/`](public/products). The logo is in [`public/brand/`](public/brand).

Before launch, update the domain and contact details in [`lib/site.ts`](lib/site.ts).
