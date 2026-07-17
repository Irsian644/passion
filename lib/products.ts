import type { Lang } from "./i18n";

export type CollectionSlug =
  | "jewelry"
  | "necklaces"
  | "earrings"
  | "bracelets"
  | "skincare"
  | "beauty"
  | "accessories";

export interface Localized {
  sq: string;
  en: string;
}

export interface Product {
  slug: string;
  name: Localized;
  tagline: Localized;
  description: Localized;
  care: Localized;
  image: string;
  collections: CollectionSlug[];
  primaryCollection: CollectionSlug;
  materials: Localized;
  badge?: Localized;
  bestSeller?: boolean;
  newArrival?: boolean;
  /** Optional editorial usage guidance (mainly for skincare/beauty). */
  usage?: Localized;
}

export interface Collection {
  slug: CollectionSlug;
  name: Localized;
  tagline: Localized;
  description: Localized;
  image: string;
}

export const collections: Collection[] = [
  {
    slug: "jewelry",
    name: { sq: "Bizhuteri", en: "Jewelry" },
    tagline: { sq: "Ar & sedef", en: "Gold & mother-of-pearl" },
    description: {
      sq: "Perla, hijeshi deti dhe sedef — pjesë delikate që i mbahen çdo ditë e i duken të veçanta çdo herë.",
      en: "Pearls, sea charms and mother-of-pearl — delicate pieces made for every day and made to feel special every time.",
    },
    image: "/products/clover-necklace.jpg",
  },
  {
    slug: "necklaces",
    name: { sq: "Gjerdanë", en: "Necklaces" },
    tagline: { sq: "Perla & sedef", en: "Pearls & shell" },
    description: {
      sq: "Gjerdanë delikatë me perla, yje deti dhe sedef — për t'u mbajtur veç ose bashkë.",
      en: "Delicate necklaces of pearl, starfish and mother-of-pearl — worn alone or layered.",
    },
    image: "/products/starfish-pearl-necklace.jpg",
  },
  {
    slug: "earrings",
    name: { sq: "Vathë", en: "Earrings" },
    tagline: { sq: "Perla & qershi", en: "Pearls & cherries" },
    description: {
      sq: "Nga fjongot me perla te qershitë e kuqe — vathë që plotësojnë çdo pamje.",
      en: "From pearl bows to red cherries — earrings that finish every look.",
    },
    image: "/products/cherry-drop-earrings.jpg",
  },
  {
    slug: "bracelets",
    name: { sq: "Byzylykë", en: "Bracelets" },
    tagline: { sq: "Hijeshi deti", en: "Sea charms" },
    description: {
      sq: "Byzylykë ari të hollë me hijeshi deti — verë në kyçin e dorës.",
      en: "Fine gold cuffs with sea charms — summer on your wrist.",
    },
    image: "/products/sea-cuff-bracelets.jpg",
  },
  {
    slug: "skincare",
    name: { sq: "Kujdesi i lëkurës", en: "Skincare" },
    tagline: { sq: "Rituali i shkëlqimit", en: "The glow ritual" },
    description: {
      sq: "Baza e çdo shkëlqimi. Mbrojtje dhe hidratim i zgjedhur me kujdes për lëkurën tënde.",
      en: "The foundation of every glow. Protection and hydration, carefully chosen for your skin.",
    },
    image: "/products/cerave-spf50.jpg",
  },
  {
    slug: "beauty",
    name: { sq: "Bukuri", en: "Beauty" },
    tagline: { sq: "Prekjet përfundimtare", en: "The finishing touches" },
    description: {
      sq: "Produkte që plotësojnë pamjen — nga shkëlqimi i flokëve te aroma që të ndjek.",
      en: "The products that finish the look — from hair shine to the scent that follows you.",
    },
    image: "/products/ck-wax-stick.jpg",
  },
  {
    slug: "accessories",
    name: { sq: "Aksesorë", en: "Accessories" },
    tagline: { sq: "Detaje verore", en: "Summer details" },
    description: {
      sq: "Byzylykë dhe hijeshi që sjellin detin kudo që shkon.",
      en: "Bracelets and charms that carry the sea wherever you go.",
    },
    image: "/products/sea-cuff-bracelets.jpg",
  },
];

/**
 * The original hardcoded catalogue.
 *
 * NOT read by the site any more — every page reads Supabase via lib/queries.ts.
 * Retained solely as the source for scripts/seed.ts, which migrates these into
 * the database. Do not add products here; use the dashboard.
 */
export const products: Product[] = [
  {
    slug: "clover-mother-of-pearl-necklace",
    name: { sq: "Gjerdan Trëndafili me Sedef", en: "Clover Mother-of-Pearl Necklace" },
    tagline: { sq: "Ari 18k · Sedef natyral", en: "18k gold tone · natural shell" },
    description: {
      sq: "Katër trëndafila sedefi të rrethuar me ar, të lidhur me zinxhir të hollë e të lehtë. Elegancë e qetë që shkon me gjithçka, nga plazhi te darka.",
      en: "Four mother-of-pearl clovers framed in beaded gold, strung on a fine, weightless chain. Quiet elegance that moves from beach to dinner.",
    },
    care: {
      sq: "Ruaje larg parfumit dhe ujit. Fshije me leckë të butë pas përdorimit.",
      en: "Keep away from perfume and water. Wipe with a soft cloth after wear.",
    },
    image: "/products/clover-necklace.jpg",
    collections: ["jewelry", "necklaces"],
    primaryCollection: "necklaces",
    materials: { sq: "Ari mbi tunxh, sedef", en: "Gold-plated brass, mother-of-pearl" },
    badge: { sq: "Ikonik", en: "Iconic" },
    bestSeller: true,
    newArrival: true,
  },
  {
    slug: "starfish-pearl-necklace",
    name: { sq: "Gjerdan Yll Deti me Perla", en: "Starfish Pearl Necklace" },
    tagline: { sq: "Perla qelqi · hijeshi ari", en: "Glass pearls · gold charm" },
    description: {
      sq: "Perla të bardha të buta me hijeshi lulesh ari dhe një yll deti të emaluar në qendër. Frymëzim mesdhetar, i punuar me dorë.",
      en: "Soft white pearls threaded with tiny gold florets and a hand-enamelled starfish at the center. Mediterranean summer, made by hand.",
    },
    care: {
      sq: "Hiqe para larjes ose notit. Ruaje në qesen e dhuruar.",
      en: "Remove before washing or swimming. Store in the pouch provided.",
    },
    image: "/products/starfish-pearl-necklace.jpg",
    collections: ["jewelry", "necklaces"],
    primaryCollection: "necklaces",
    materials: { sq: "Perla qelqi, metal ari", en: "Glass pearls, gold-tone metal" },
    badge: { sq: "Punuar me dorë", en: "Handmade" },
    bestSeller: true,
  },
  {
    slug: "cherry-beaded-choker",
    name: { sq: "Gjerdan me Qershi", en: "Cherry Beaded Necklace" },
    tagline: { sq: "Perla qelqi · qershi e emaluar", en: "Seed pearls · enamel cherries" },
    description: {
      sq: "Një gjerdan veror me perla të vogla të bardha dhe një hijeshi qershie të kuqe. I ëmbël, lozonjar dhe pikërisht aq i guximshëm.",
      en: "A summer necklace of tiny white seed pearls finished with a red enamel cherry charm. Sweet, playful, and just bold enough.",
    },
    care: {
      sq: "Shmang kontaktin me kremra dhe parfume.",
      en: "Avoid contact with creams and perfumes.",
    },
    image: "/products/cherry-choker.jpg",
    collections: ["jewelry", "necklaces"],
    primaryCollection: "necklaces",
    materials: { sq: "Perla qelqi, emal", en: "Glass seed pearls, enamel" },
    bestSeller: true,
  },
  {
    slug: "cherry-drop-earrings",
    name: { sq: "Vathë Qershi të Kuqe", en: "Red Cherry Drop Earrings" },
    tagline: { sq: "Qelq i kuq · nyjë ari", en: "Red glass · gold knot" },
    description: {
      sq: "Sfera qelqi të kuqe si qershi, të varura nga një nyjë delikate ari. Vijnë në kutinë tonë të veçantë — gati për dhuratë.",
      en: "Cherry-red glass drops suspended from a delicate gold knot. Arrives in our signature box — ready to gift.",
    },
    care: {
      sq: "Fshije me leckë të butë. Ruaje në kuti.",
      en: "Wipe with a soft cloth. Store in the box.",
    },
    image: "/products/cherry-drop-earrings.jpg",
    collections: ["jewelry", "earrings"],
    primaryCollection: "earrings",
    materials: { sq: "Qelq, metal ari", en: "Glass, gold-tone metal" },
    badge: { sq: "Në kuti dhuratë", en: "Gift-boxed" },
    bestSeller: true,
    newArrival: true,
  },
  {
    slug: "starfish-pearl-earrings",
    name: { sq: "Vathë Yll Deti me Perla", en: "Starfish Pearl Earrings" },
    tagline: { sq: "Yll ari · perla baroke", en: "Gold starfish · baroque pearl" },
    description: {
      sq: "Yje deti prej ari të teksturuar me një perlë baroke të varur. Frymë bregdetare në formën më elegante.",
      en: "Textured gold starfish studs with a baroque pearl drop. The coast, in its most elegant form.",
    },
    care: {
      sq: "Ruaje thatë. Shmang ujin e detit.",
      en: "Keep dry. Avoid seawater.",
    },
    image: "/products/starfish-pearl-earrings.jpg",
    collections: ["jewelry", "earrings"],
    primaryCollection: "earrings",
    materials: { sq: "Metal ari, perla imitim", en: "Gold-tone metal, faux pearl" },
  },
  {
    slug: "pearl-bow-earrings",
    name: { sq: "Vathë Fjongo me Perla", en: "Pearl Bow Earrings" },
    tagline: { sq: "Tel ari · perlë e vetme", en: "Gold wire · single pearl" },
    description: {
      sq: "Një fjongo prej teli ari e punuar me dorë, që përfundon me një perlë të vetme të ndritshme. E hollë, feminine, e paharrueshme.",
      en: "A hand-formed gold-wire bow finishing in a single luminous pearl. Fine, feminine, unforgettable.",
    },
    care: {
      sq: "Trajtoje me kujdes — punuar me dorë.",
      en: "Handle gently — made by hand.",
    },
    image: "/products/pearl-bow-earrings.jpg",
    collections: ["jewelry", "earrings"],
    primaryCollection: "earrings",
    materials: { sq: "Tel ari, perla", en: "Gold wire, pearl" },
    badge: { sq: "Punuar me dorë", en: "Handmade" },
  },
  {
    slug: "sea-charm-cuff-set",
    name: { sq: "Set Byzylykësh Deti", en: "Sea Charm Cuff Set" },
    tagline: { sq: "Yll · guaskë · perlë", en: "Starfish · shell · pearl" },
    description: {
      sq: "Tre byzylykë ari të hollë me hijeshi yll deti, guaskë dhe perlë të varur. Mbaji bashkë ose ndaji — të dyja të bukura.",
      en: "Three fine gold cuffs with starfish, shell and a hanging pearl charm. Stack them or split them — both look beautiful.",
    },
    care: {
      sq: "Hiqi para notit. Ruaji të thata.",
      en: "Remove before swimming. Keep dry.",
    },
    image: "/products/sea-cuff-bracelets.jpg",
    collections: ["jewelry", "bracelets", "accessories"],
    primaryCollection: "bracelets",
    materials: { sq: "Metal ari, perla imitim", en: "Gold-tone metal, faux pearl" },
    badge: { sq: "Set me 3", en: "Set of 3" },
    bestSeller: true,
    newArrival: true,
  },
  {
    slug: "cerave-mineral-sunscreen-spf50",
    name: { sq: "CeraVe Krem Dielli Mineral SPF 50", en: "CeraVe Hydrating Mineral Sunscreen SPF 50" },
    tagline: { sq: "Fytyrë & trup · 75ml", en: "Face & body · 75ml" },
    description: {
      sq: "Mbrojtje e gjerë SPF 50, e lehtë dhe pa yndyrë, me 3 ceramide dhe niacinamide. Baza e çdo rutine shkëlqimi — e përshtatshme për lëkurë të ndjeshme.",
      en: "Broad-spectrum SPF 50, lightweight and non-greasy, with 3 essential ceramides and niacinamide. The base of every glow routine — suitable for sensitive skin.",
    },
    care: {
      sq: "Apliko bujarisht 15 min para diellit. Ripërsërit çdo 2 orë.",
      en: "Apply generously 15 min before sun. Reapply every 2 hours.",
    },
    usage: {
      sq: "Përdore si hapin e fundit të rutinës së mëngjesit, mbi hidratues. Apliko një shtresë të barabartë në fytyrë e qafë 15 minuta para daljes në diell dhe ripërsërite gjatë ditës.",
      en: "Use as the final step of your morning routine, over moisturiser. Apply an even layer to face and neck 15 minutes before sun exposure, and reapply throughout the day.",
    },
    image: "/products/cerave-spf50.jpg",
    collections: ["skincare"],
    primaryCollection: "skincare",
    materials: { sq: "Zink oksid, ceramide, niacinamide", en: "Zinc oxide, ceramides, niacinamide" },
    badge: { sq: "Thelbësore", en: "Essential" },
    bestSeller: true,
  },
  {
    slug: "ck-hair-wax-stick-set",
    name: { sq: "CK Wax Stick + Furçë Flokësh", en: "CK Hair Wax Stick + Styling Brush" },
    tagline: { sq: "Shkëlqim & fiksim", en: "Shine & hold" },
    description: {
      sq: "Wax stick për shkëlqim dhe qetësim të flokëve të vegjël, i çiftuar me një furçë stilimi me push natyral. Pamje e përsosur, pa yndyrë.",
      en: "A wax stick to smooth flyaways and add shine, paired with a natural-bristle styling brush. A polished finish, never greasy.",
    },
    care: {
      sq: "Ruaje në temperaturë ambienti.",
      en: "Store at room temperature.",
    },
    usage: {
      sq: "Kaloje wax stick lehtë mbi flokët e vegjël ose vijën e flokëve, pastaj krehi me furçën për një pamje të qetë e me shkëlqim. Pak mjafton.",
      en: "Glide the wax stick lightly over flyaways or your hairline, then smooth with the brush for a polished, glossy finish. A little goes a long way.",
    },
    image: "/products/ck-wax-stick.jpg",
    collections: ["beauty", "accessories"],
    primaryCollection: "beauty",
    materials: { sq: "Wax, furçë me push natyral", en: "Styling wax, natural bristle brush" },
  },
];

/**
 * Resolves a bilingual value for display.
 *
 * Falls back to the other language when the requested one is blank. Products
 * are now typed by hand in the dashboard and either language may be left
 * empty — without this, an English visitor would see an empty string rather
 * than the Albanian the client actually wrote.
 */
export function localize(value: Localized, lang: Lang): string {
  const wanted = value[lang]?.trim();
  if (wanted) return wanted;

  const other = lang === "sq" ? value.en : value.sq;
  return other?.trim() ?? "";
}

/** The four hero collections shown on the homepage & mega-menu imagery. */
const FEATURED: CollectionSlug[] = ["jewelry", "skincare", "beauty", "accessories"];

export function featuredCollections(): Collection[] {
  return FEATURED.map((s) => collections.find((c) => c.slug === s)).filter(
    (c): c is Collection => Boolean(c),
  );
}


export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}




