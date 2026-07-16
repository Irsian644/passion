/**
 * Database types for the `products` table.
 * Mirrors supabase/migrations/0001_products.sql.
 */

export type ProductRow = {
  id: string;
  name_sq: string;
  name_en: string;
  tagline_sq: string;
  tagline_en: string;
  description_sq: string;
  description_en: string;
  care_sq: string;
  care_en: string;
  materials_sq: string;
  materials_en: string;
  images: string[];
  collections: string[];
  primary_collection: string | null;
  best_seller: boolean;
  new_arrival: boolean;
  display_order: number;
  published: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
}

/**
 * Written out explicitly rather than derived via `Omit<Row, ...> & {...}`:
 * an intersection type does not reduce to the plain object shape that
 * supabase-js requires, which silently degrades every query on this table
 * (and every rpc call on the schema) to `never`.
 */
export type ProductInsert = {
  id?: string;
  name_sq: string;
  name_en?: string;
  tagline_sq?: string;
  tagline_en?: string;
  description_sq?: string;
  description_en?: string;
  care_sq?: string;
  care_en?: string;
  materials_sq?: string;
  materials_en?: string;
  images?: string[];
  collections?: string[];
  primary_collection?: string | null;
  best_seller?: boolean;
  new_arrival?: boolean;
  display_order?: number;
  published?: boolean;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export type ProductUpdate = {
  id?: string;
  name_sq?: string;
  name_en?: string;
  tagline_sq?: string;
  tagline_en?: string;
  description_sq?: string;
  description_en?: string;
  care_sq?: string;
  care_en?: string;
  materials_sq?: string;
  materials_en?: string;
  images?: string[];
  collections?: string[];
  primary_collection?: string | null;
  best_seller?: boolean;
  new_arrival?: boolean;
  display_order?: number;
  published?: boolean;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      record_auth_attempt: {
        Args: { p_bucket: string; p_window_secs?: number };
        Returns: number;
      };
      clear_auth_attempts: {
        Args: { p_bucket: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
