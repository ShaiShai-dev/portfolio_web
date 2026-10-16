-- Allow the admin About editor to store a public resume in the existing
-- site-media bucket. Existing images and objects are preserved.
update storage.buckets
set allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf'
]
where id = 'site-media';
