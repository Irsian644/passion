-- Passion Dream — storage hardening (additive, reversible)
--
-- Defense-in-depth for the product-images bucket. The upload server action
-- (lib/upload-actions.ts) already validates the MIME type before issuing a
-- signed URL, but the bucket itself accepted any type. This constrains the
-- bucket so that even a bypassed or future upload path cannot store an SVG
-- (script-capable), HTML, or other non-image file.
--
-- Impact: existing objects are unaffected. Only NEW uploads are constrained,
-- and only to the four formats the app already accepts. Fully reversible by
-- setting the columns back to NULL.
--
-- Run in the Supabase SQL editor or via `supabase db push`.

update storage.buckets
set
  -- Match the server allowlist in lib/upload-actions.ts.
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  -- Backstop ceiling. The app sets no size limit for the client's own photos;
  -- 25MB is well above any phone/camera photo while still bounding abuse.
  file_size_limit = 26214400
where id = 'product-images';
