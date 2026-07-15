export const SITE = {
  name: "Passion Dream",
  domain: "https://passiondream.al",
  handle: "@passion_dream17",
  username: "passion_dream17",
  instagram: "https://instagram.com/passion_dream17",
  tagline: {
    sq: "Shkëlqe me Pasion — bizhuteri, bukuri dhe kujdes lëkure të punuar me dorë në Shqipëri.",
    en: "Glow up with Passion — hand-finished jewelry, beauty and skincare, made in Albania.",
  },
  email: "hello@passiondream.al",
  city: "Vlorë",
  country: "AL",
  hours: {
    sq: "Çdo ditë · 09:00 – 21:00",
    en: "Every day · 09:00 – 21:00",
  },
} as const;

/** Deep-link that opens the Instagram profile (all "order" actions go here). */
export function instagramUrl(): string {
  return SITE.instagram;
}

/** Instagram DM deep link, pre-focused where supported. Falls back to profile. */
export function instagramOrderUrl(productName?: string): string {
  // Instagram has no reliable public "prefilled DM" web link, so we open the
  // profile in a new tab; the customer taps "Message". productName kept for
  // future analytics / query params.
  void productName;
  return `${SITE.instagram}?utm_source=website&utm_medium=order_cta`;
}
