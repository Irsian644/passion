import { SITE } from "./site";
import { type Product } from "./products";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.domain,
    logo: `${SITE.domain}/brand/logo.png`,
    sameAs: [SITE.instagram],
    email: SITE.email,
    address: { "@type": "PostalAddress", addressLocality: SITE.city, addressCountry: SITE.country },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.domain,
    inLanguage: ["sq", "en"],
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
