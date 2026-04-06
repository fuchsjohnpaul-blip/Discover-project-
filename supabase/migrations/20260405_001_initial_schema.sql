create extension if not exists "pgcrypto";

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  website_url text,
  phone text,
  price_range text,
  cuisine_types text[] not null default '{}',
  city text not null default 'Tuscaloosa',
  state text not null default 'AL',
  address_line1 text not null,
  address_line2 text,
  postal_code text,
  latitude double precision not null,
  longitude double precision not null,
  gluten_safety_category text not null check (
    gluten_safety_category in (
      '100_percent_gluten_free',
      'dedicated_gluten_free_menu',
      'gluten_free_options_available',
      'verified_menu_items_only'
    )
  ),
  overall_confidence text not null check (
    overall_confidence in ('high', 'medium', 'low')
  ),
  cross_contact_risk text not null check (
    cross_contact_risk in ('low', 'medium', 'high', 'unknown')
  ),
  review_status text not null default 'draft' check (
    review_status in ('draft', 'approved', 'archived')
  ),
  is_published boolean not null default false,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurant_hours (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (restaurant_id, day_of_week)
);

create table if not exists public.menu_sections (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  menu_section_id uuid references public.menu_sections(id) on delete set null,
  name text not null,
  description text,
  price_text text,
  dietary_summary text,
  gluten_status text not null check (
    gluten_status in ('verified_safe', 'likely_safe', 'needs_confirmation', 'not_safe')
  ),
  confidence_level text not null check (
    confidence_level in ('high', 'medium', 'low')
  ),
  caution_notes text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.verification_sources (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete cascade,
  source_type text not null check (
    source_type in ('restaurant_website', 'restaurant_menu_pdf', 'direct_contact', 'internal_review', 'other')
  ),
  source_label text not null,
  source_url text,
  source_excerpt text,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (
    restaurant_id is not null or menu_item_id is not null
  )
);

create table if not exists public.verification_records (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete cascade,
  verdict text not null check (
    verdict in ('approved', 'caution', 'insufficient_evidence', 'rejected')
  ),
  confidence_level text not null check (
    confidence_level in ('high', 'medium', 'low')
  ),
  reviewer_note text,
  reviewed_by text,
  reviewed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (
    restaurant_id is not null or menu_item_id is not null
  )
);

create index if not exists restaurants_city_state_idx
  on public.restaurants (city, state);

create index if not exists restaurants_published_idx
  on public.restaurants (is_published, review_status);

create index if not exists restaurants_location_idx
  on public.restaurants (latitude, longitude);

create index if not exists menu_items_restaurant_idx
  on public.menu_items (restaurant_id);

create index if not exists menu_items_published_idx
  on public.menu_items (is_published, gluten_status);

create index if not exists verification_sources_restaurant_idx
  on public.verification_sources (restaurant_id);

create index if not exists verification_sources_menu_item_idx
  on public.verification_sources (menu_item_id);

create index if not exists verification_records_restaurant_idx
  on public.verification_records (restaurant_id);

create index if not exists verification_records_menu_item_idx
  on public.verification_records (menu_item_id);
