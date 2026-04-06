begin;

with restaurant_seed (
  slug,
  name,
  short_description,
  cuisine_types,
  address_line1,
  postal_code,
  latitude,
  longitude,
  gluten_safety_category,
  overall_confidence,
  cross_contact_risk,
  review_status,
  is_published,
  last_reviewed_at
) as (
  values
    (
      'jim-n-nicks-bbq',
      'Jim ''N Nick''s Bar-B-Q',
      'Founder-provided sample restaurant for Tuscaloosa MVP wiring.',
      array['barbecue']::text[],
      '305 21st Ave',
      '35401',
      33.2126591,
      -87.5646023,
      'verified_menu_items_only',
      'medium',
      'unknown',
      'approved',
      true,
      now()
    ),
    (
      'the-sanctuary-on-25th',
      'The Sanctuary on 25th',
      'Founder-provided sample restaurant for Tuscaloosa MVP wiring.',
      array['small plates', 'american']::text[],
      '1710 25th Ave',
      '35401',
      33.1962121,
      -87.563875,
      'verified_menu_items_only',
      'medium',
      'unknown',
      'approved',
      true,
      now()
    ),
    (
      'full-moon-bbq',
      'Full Moon Bar-B-Que',
      'Founder-provided sample restaurant for Tuscaloosa MVP wiring.',
      array['barbecue']::text[],
      '1434 McFarland Blvd E',
      '35404',
      33.1980298,
      -87.5262153,
      'verified_menu_items_only',
      'medium',
      'unknown',
      'approved',
      true,
      now()
    ),
    (
      'standard-pizza-co',
      'The Standard',
      'Founder-provided sample restaurant for Tuscaloosa MVP wiring.',
      array['pizza']::text[],
      '1217 University Blvd',
      '35401',
      33.2107645,
      -87.5540706,
      'gluten_free_options_available',
      'low',
      'unknown',
      'approved',
      true,
      now()
    ),
    (
      'taco-casa',
      'Taco Casa',
      'Founder-provided sample restaurant for Tuscaloosa MVP wiring.',
      array['mexican', 'fast casual']::text[],
      '603 15th St E',
      '35401',
      33.1970196,
      -87.5284996,
      'gluten_free_options_available',
      'low',
      'unknown',
      'approved',
      true,
      now()
    )
)
insert into public.restaurants (
  slug,
  name,
  short_description,
  cuisine_types,
  address_line1,
  postal_code,
  latitude,
  longitude,
  gluten_safety_category,
  overall_confidence,
  cross_contact_risk,
  review_status,
  is_published,
  last_reviewed_at
)
select
  slug,
  name,
  short_description,
  cuisine_types,
  address_line1,
  postal_code,
  latitude,
  longitude,
  gluten_safety_category,
  overall_confidence,
  cross_contact_risk,
  review_status,
  is_published,
  last_reviewed_at
from restaurant_seed
on conflict (slug) do update
set
  name = excluded.name,
  short_description = excluded.short_description,
  cuisine_types = excluded.cuisine_types,
  address_line1 = excluded.address_line1,
  postal_code = excluded.postal_code,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  gluten_safety_category = excluded.gluten_safety_category,
  overall_confidence = excluded.overall_confidence,
  cross_contact_risk = excluded.cross_contact_risk,
  review_status = excluded.review_status,
  is_published = excluded.is_published,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = now();

with section_seed (restaurant_slug, section_name, display_order) as (
  values
    ('jim-n-nicks-bbq', 'Featured Items', 1),
    ('the-sanctuary-on-25th', 'Featured Items', 1),
    ('full-moon-bbq', 'Featured Items', 1),
    ('standard-pizza-co', 'Featured Items', 1),
    ('taco-casa', 'Featured Items', 1)
)
insert into public.menu_sections (restaurant_id, name, display_order)
select r.id, s.section_name, s.display_order
from section_seed s
join public.restaurants r on r.slug = s.restaurant_slug
where not exists (
  select 1
  from public.menu_sections ms
  where ms.restaurant_id = r.id
    and ms.name = s.section_name
);

with item_seed (
  restaurant_slug,
  item_name,
  description,
  dietary_summary,
  gluten_status,
  confidence_level,
  verification_method,
  caution_notes,
  is_featured,
  is_published,
  explanation_note
) as (
  values
    (
      'jim-n-nicks-bbq',
      'Beef Brisket (No Bun)',
      'Brisket ordered without the bun.',
      'Safe (Verified)',
      'verified_safe',
      'medium',
      'restaurant_labeled',
      null,
      true,
      true,
      'Marked safe because the restaurant identifies the item as gluten-free when served without the bun.'
    ),
    (
      'the-sanctuary-on-25th',
      'Bacon Wrapped Dates',
      'Featured date appetizer.',
      'Safe (Verified)',
      'verified_safe',
      'medium',
      'restaurant_labeled',
      null,
      true,
      true,
      'Marked safe because the restaurant labels this item as gluten-free.'
    ),
    (
      'full-moon-bbq',
      'Loaded Bar-B-Q Baker',
      'Loaded baked potato with barbecue toppings.',
      'Safe (Verified)',
      'verified_safe',
      'medium',
      'restaurant_labeled',
      null,
      true,
      true,
      'Marked safe because the restaurant labels this item as gluten-free.'
    ),
    (
      'standard-pizza-co',
      'Regular Pepperoni Pizza',
      'Standard wheat-crust pepperoni pizza.',
      'Not Safe (Unverified)',
      'not_safe',
      'low',
      'unknown',
      'Contains a standard flour-based pizza crust.',
      true,
      true,
      'Marked not safe because a regular pizza crust typically contains wheat gluten and no gluten-free claim was provided.'
    ),
    (
      'taco-casa',
      'Flour Tortilla Burrito',
      'Burrito served in a standard flour tortilla.',
      'Not Safe (Unverified)',
      'not_safe',
      'low',
      'unknown',
      'Contains a flour tortilla.',
      true,
      true,
      'Marked not safe because flour tortillas typically contain wheat gluten and no gluten-free claim was provided.'
    )
)
insert into public.menu_items (
  restaurant_id,
  menu_section_id,
  name,
  description,
  dietary_summary,
  gluten_status,
  confidence_level,
  verification_method,
  caution_notes,
  is_featured,
  is_published,
  last_reviewed_at
)
select
  r.id,
  ms.id,
  i.item_name,
  i.description,
  i.dietary_summary,
  i.gluten_status,
  i.confidence_level,
  i.verification_method,
  i.caution_notes,
  i.is_featured,
  i.is_published,
  now()
from item_seed i
join public.restaurants r on r.slug = i.restaurant_slug
left join public.menu_sections ms
  on ms.restaurant_id = r.id
 and ms.name = 'Featured Items'
where not exists (
  select 1
  from public.menu_items mi
  where mi.restaurant_id = r.id
    and mi.name = i.item_name
);

with source_seed (
  restaurant_slug,
  item_name,
  source_type,
  source_label,
  source_excerpt
) as (
  values
    (
      'jim-n-nicks-bbq',
      'Beef Brisket (No Bun)',
      'other',
      'Founder-provided sample data',
      'User specified this item as Safe (Verified).'
    ),
    (
      'the-sanctuary-on-25th',
      'Bacon Wrapped Dates',
      'other',
      'Founder-provided sample data',
      'User specified this item as Safe (Verified).'
    ),
    (
      'full-moon-bbq',
      'Loaded Bar-B-Q Baker',
      'other',
      'Founder-provided sample data',
      'User specified this item as Safe (Verified).'
    ),
    (
      'standard-pizza-co',
      'Regular Pepperoni Pizza',
      'other',
      'Founder-provided sample data',
      'User specified this item as Not Safe (Unverified).'
    ),
    (
      'taco-casa',
      'Flour Tortilla Burrito',
      'other',
      'Founder-provided sample data',
      'User specified this item as Not Safe (Unverified).'
    )
)
insert into public.verification_sources (
  restaurant_id,
  menu_item_id,
  source_type,
  source_label,
  source_excerpt
)
select
  r.id,
  mi.id,
  s.source_type,
  s.source_label,
  s.source_excerpt
from source_seed s
join public.restaurants r on r.slug = s.restaurant_slug
join public.menu_items mi on mi.restaurant_id = r.id and mi.name = s.item_name
where not exists (
  select 1
  from public.verification_sources vs
  where vs.menu_item_id = mi.id
    and vs.source_label = s.source_label
);

with record_seed (
  restaurant_slug,
  item_name,
  verdict,
  confidence_level,
  reviewer_note
) as (
  values
    (
      'jim-n-nicks-bbq',
      'Beef Brisket (No Bun)',
      'approved',
      'medium',
      'Marked safe from founder-provided sample data because the restaurant labels the item gluten-free when served without the bun.'
    ),
    (
      'the-sanctuary-on-25th',
      'Bacon Wrapped Dates',
      'approved',
      'medium',
      'Marked safe from founder-provided sample data because the restaurant labels this item gluten-free.'
    ),
    (
      'full-moon-bbq',
      'Loaded Bar-B-Q Baker',
      'approved',
      'medium',
      'Marked safe from founder-provided sample data because the restaurant labels this item gluten-free.'
    ),
    (
      'standard-pizza-co',
      'Regular Pepperoni Pizza',
      'rejected',
      'low',
      'Marked not safe from founder-provided sample data because a standard pizza crust usually contains wheat gluten.'
    ),
    (
      'taco-casa',
      'Flour Tortilla Burrito',
      'rejected',
      'low',
      'Marked not safe from founder-provided sample data because a flour tortilla usually contains wheat gluten.'
    )
)
insert into public.verification_records (
  restaurant_id,
  menu_item_id,
  verdict,
  confidence_level,
  reviewer_note,
  reviewed_by
)
select
  r.id,
  mi.id,
  v.verdict,
  v.confidence_level,
  v.reviewer_note,
  'founder_seed'
from record_seed v
join public.restaurants r on r.slug = v.restaurant_slug
join public.menu_items mi on mi.restaurant_id = r.id and mi.name = v.item_name
where not exists (
  select 1
  from public.verification_records vr
  where vr.menu_item_id = mi.id
    and vr.reviewed_by = 'founder_seed'
);

commit;
