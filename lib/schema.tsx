import { SITE } from "./site";
import { type Product } from "./products";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.domain}/#organization`,
    name: SITE.name,
    url: SITE.domain,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.domain}/brand/logo.png`,
      caption: SITE.name,
    },
    image: `${SITE.domain}/brand/logo.png`,
    sameAs: [SITE.instagram],
    email: SITE.email,
    address: { "@type": "PostalAddress", addressLocality: SITE.city, addressCountry: SITE.country },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.email,
      areaServed: SITE.country,
      availableLanguage: ["sq", "en"],
    },
  };
}

/**
 * LocalBusiness for the Vlorë atelier.
 *
 * Distinct from Organization (which describes the brand): this carries the
 * local-search signals Google uses for "near me" and city-qualified queries.
 * Only fields we can state truthfully are included — no invented geo
 * coordinates, no fabricated ratings.
 */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE.domain}/#localbusiness`,
    name: SITE.name,
    url: SITE.domain,
    image: `${SITE.domain}/brand/logo.png`,
    email: SITE.email,
    description: SITE.tagline.sq,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressCountry: SITE.country,
    },
    areaServed: { "@type": "Country", name: "Albania" },
    // "Çdo ditë · 09:00 – 21:00" — every day, 09:00 to 21:00.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
    sameAs: [SITE.instagram],
    parentOrganization: { "@id": `${SITE.domain}/#organization` },
  };
}

/** FAQPage built from the questions actually rendered on /faq. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** ItemList for collection and listing pages, so Google sees the set. */
export function itemListSchema(
  items: { name: string; url: string }[],
  listName: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${SITE.domain}${item.url}`,
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.domain}/#website`,
    name: SITE.name,
    url: SITE.domain,
    inLanguage: ["sq", "en"],
    publisher: { "@id": `${SITE.domain}/#organization` },
  };
}

export function productSchema(product: Product, name: string, description: string) {
  // Showroom (no on-site pricing / cart) — we describe the product and point
  // buyers to Instagram, so no Offer with price is included.
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `${SITE.domain}${product.image}`,
    brand: { "@type": "Brand", name: SITE.name },
    url: `${SITE.domain}/products/${product.slug}`,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.domain}${it.url}`,
    })),
  };
}

/**
 * Serializes JSON-LD for a <script> element.
 *
 * JSON.stringify does NOT escape `<`, `>` or `&`, so an admin-authored product
 * name like `</script><script>…` would break out of the JSON-LD block and
 * execute — a stored XSS. Escaping those three characters makes it impossible
 * for any string value to terminate the script context.
 */
function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JsonLd({ data }: { data: object | object[] }) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safeJsonLd(arr) }}
    />
  );
}
