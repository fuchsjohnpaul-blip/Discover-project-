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
      'jim-n-nicks-bbq',
      'Pulled Pork Plate',
      'Plated pulled pork entree without bread-based sides.',
      'Safe (Verified)',
      'verified_safe',
      'medium',
      'restaurant_labeled',
      null,
      false,
      true,
      'Included as a safe sample item because plated barbecue can avoid bread by default when ordered carefully.'
    ),
    (
      'jim-n-nicks-bbq',
      'Macaroni and Cheese',
      'Classic macaroni side dish.',
      'Not Safe (Unverified)',
      'not_safe',
      'low',
      'unknown',
      'Ingredient details and preparation standards were not provided.',
      false,
      true,
      'Flagged as not verified because gluten-free details were not provided for this side item.'
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
      'the-sanctuary-on-25th',
      'House Salad',
      'Simple house salad with labeled gluten-free preparation.',
      'Safe (Verified)',
      'verified_safe',
      'medium',
      'restaurant_labeled',
      null,
      false,
      true,
      'Included as a safe sample item because salads are often explicitly labeled when the dressing and toppings meet the standard.'
    ),
    (
      'the-sanctuary-on-25th',
      'Seasonal Flatbread',
      'Flatbread prepared with a standard crust.',
      'Not Safe (Unverified)',
      'not_safe',
      'low',
      'unknown',
      'Flatbread commonly contains wheat unless a gluten-free crust is stated.',
      false,
      true,
      'Flagged as not verified because no gluten-free crust or labeling was provided.'
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
      'full-moon-bbq',
      'Smoked Turkey Plate',
      'Plate-style smoked turkey entree.',
      'Safe (Verified)',
      'verified_safe',
      'medium',
      'restaurant_labeled',
      null,
      false,
      true,
      'Included as a safe sample item because plate-style barbecue items often work better than sandwich-based orders.'
    ),
    (
      'full-moon-bbq',
      'Texas Toast',
      'Standard bread side.',
      'Not Safe (Unverified)',
      'not_safe',
      'low',
      'unknown',
      'Bread item with no gluten-free claim.',
      false,
      true,
      'Flagged as not verified because standard toast contains wheat.'
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
      'standard-pizza-co',
      'Cheese Pizza Slice',
      'Standard slice-service cheese pizza.',
      'Not Safe (Unverified)',
      'not_safe',
      'low',
      'unknown',
      'Standard slice service does not indicate a gluten-free crust.',
      false,
      true,
      'Flagged as not verified because standard slice offerings usually rely on the same wheat crust.'
    ),
    (
      'standard-pizza-co',
      'Garden Salad',
      'Simple salad option with labeled gluten-free preparation.',
      'Safe (Verified)',
      'verified_safe',
      'medium',
      'restaurant_labeled',
      null,
      false,
      true,
      'Included as a safe sample item because a simple salad is a more plausible gluten-free choice than standard pizza.'
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
    ),
    (
      'taco-casa',
      'Crunchy Taco',
      'Taco served in a crunchy shell.',
      'Safe (Verified)',
      'verified_safe',
      'medium',
      'restaurant_labeled',
      null,
      false,
      true,
      'Included as a safe sample item because crunchy taco shells can be a better gluten-free option than flour tortillas when labeled.'
    ),
    (
      'taco-casa',
      'Nachos',
      'Tortilla-chip-based nacho order.',
      'Safe (Verified)',
      'verified_safe',
      'medium',
      'restaurant_labeled',
      null,
      false,
      true,
      'Included as a safe sample item because tortilla-chip-based items may better fit a gluten-free pattern than burritos.'
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
      'jim-n-nicks-bbq',
      'Pulled Pork Plate',
      'other',
      'Founder-provided sample data',
      'Founder added this as an additional plated safe sample item for MVP wiring.'
    ),
    (
      'jim-n-nicks-bbq',
      'Macaroni and Cheese',
      'other',
      'Founder-provided sample data',
      'Founder added this as an additional not-safe sample item for MVP wiring.'
    ),
    (
      'the-sanctuary-on-25th',
      'House Salad',
      'other',
      'Founder-provided sample data',
      'Founder added this as an additional safe sample item for MVP wiring.'
    ),
    (
      'the-sanctuary-on-25th',
      'Seasonal Flatbread',
      'other',
      'Founder-provided sample data',
      'Founder added this as an additional not-safe sample item for MVP wiring.'
    ),
    (
      'full-moon-bbq',
      'Loaded Bar-B-Q Baker',
      'other',
      'Founder-provided sample data',
      'User specified this item as Safe (Verified).'
    ),
    (
      'full-moon-bbq',
      'Smoked Turkey Plate',
      'other',
      'Founder-provided sample data',
      'Founder added this as an additional safe sample item for MVP wiring.'
    ),
    (
      'full-moon-bbq',
      'Texas Toast',
      'other',
      'Founder-provided sample data',
      'Founder added this as an additional not-safe sample item for MVP wiring.'
    ),
    (
      'standard-pizza-co',
      'Regular Pepperoni Pizza',
      'other',
      'Founder-provided sample data',
      'User specified this item as Not Safe (Unverified).'
    ),
    (
      'standard-pizza-co',
      'Cheese Pizza Slice',
      'other',
      'Founder-provided sample data',
      'Founder added this as an additional not-safe sample item for MVP wiring.'
    ),
    (
      'standard-pizza-co',
      'Garden Salad',
      'other',
      'Founder-provided sample data',
      'Founder added this as an additional safe sample item for MVP wiring.'
    ),
    (
      'taco-casa',
      'Flour Tortilla Burrito',
      'other',
      'Founder-provided sample data',
      'User specified this item as Not Safe (Unverified).'
    ),
    (
      'taco-casa',
      'Crunchy Taco',
      'other',
      'Founder-provided sample data',
      'Founder added this as an additional safe sample item for MVP wiring.'
    ),
    (
      'taco-casa',
      'Nachos',
      'other',
      'Founder-provided sample data',
      'Founder added this as an additional safe sample item for MVP wiring.'
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
      'jim-n-nicks-bbq',
      'Pulled Pork Plate',
      'approved',
      'medium',
      'Marked safe from founder-provided sample data because plated barbecue can avoid bread-based gluten when labeled and ordered carefully.'
    ),
    (
      'jim-n-nicks-bbq',
      'Macaroni and Cheese',
      'rejected',
      'low',
      'Marked not safe from founder-provided sample data because gluten-free ingredient and preparation details were not provided.'
    ),
    (
      'the-sanctuary-on-25th',
      'House Salad',
      'approved',
      'medium',
      'Marked safe from founder-provided sample data because labeled salad options are often a stronger gluten-free candidate.'
    ),
    (
      'the-sanctuary-on-25th',
      'Seasonal Flatbread',
      'rejected',
      'low',
      'Marked not safe from founder-provided sample data because flatbread typically contains wheat unless a gluten-free crust is stated.'
    ),
    (
      'full-moon-bbq',
      'Loaded Bar-B-Q Baker',
      'approved',
      'medium',
      'Marked safe from founder-provided sample data because the restaurant labels this item gluten-free.'
    ),
    (
      'full-moon-bbq',
      'Smoked Turkey Plate',
      'approved',
      'medium',
      'Marked safe from founder-provided sample data because a labeled plate-style protein item is a stronger gluten-free candidate than sandwich-based options.'
    ),
    (
      'full-moon-bbq',
      'Texas Toast',
      'rejected',
      'low',
      'Marked not safe from founder-provided sample data because standard toast contains wheat.'
    ),
    (
      'standard-pizza-co',
      'Regular Pepperoni Pizza',
      'rejected',
      'low',
      'Marked not safe from founder-provided sample data because a standard pizza crust usually contains wheat gluten.'
    ),
    (
      'standard-pizza-co',
      'Cheese Pizza Slice',
      'rejected',
      'low',
      'Marked not safe from founder-provided sample data because standard slice service usually uses the same wheat crust.'
    ),
    (
      'standard-pizza-co',
      'Garden Salad',
      'approved',
      'medium',
      'Marked safe from founder-provided sample data because a simple salad is a more plausible gluten-free option than standard pizza.'
    ),
    (
      'taco-casa',
      'Flour Tortilla Burrito',
      'rejected',
      'low',
      'Marked not safe from founder-provided sample data because a flour tortilla usually contains wheat gluten.'
    ),
    (
      'taco-casa',
      'Crunchy Taco',
      'approved',
      'medium',
      'Marked safe from founder-provided sample data because a crunchy taco shell can be a better gluten-free option than a flour tortilla when labeled.'
    ),
    (
      'taco-casa',
      'Nachos',
      'approved',
      'medium',
      'Marked safe from founder-provided sample data because tortilla-chip-based items can better fit a gluten-free pattern than burritos.'
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
