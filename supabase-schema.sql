-- Supabase Schema for ShareNGrow

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. artists
CREATE TABLE IF NOT EXISTS artists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  city text NOT NULL,
  area text,
  district text,
  bio text,
  profile_image_url text,
  languages text[],
  mediums text[],
  instagram_url text,
  facebook_url text,
  phone_private text NOT NULL,
  email_private text,
  available_for_commissions boolean DEFAULT false,
  available_for_teaching boolean DEFAULT false,
  available_for_travel boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  consent_profile_public boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. services
CREATE TABLE IF NOT EXISTS services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  launch_priority text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Seed services
INSERT INTO services (name, slug, description, launch_priority) VALUES
('Drawing teacher', 'drawing-teacher', 'Instructors for children and hobbyists.', 'high'),
('Wall mural', 'wall-mural', 'Custom murals for businesses, schools, and homes.', 'high'),
('Live event art', 'live-event-art', 'Live sketching and caricatures for events.', 'high'),
('Workshop facilitator', 'workshop-facilitator', 'Group art workshops and classes.', 'medium'),
('Portrait/custom artwork', 'portrait-custom-artwork', 'Commissioned portraits and custom pieces.', 'medium')
ON CONFLICT (slug) DO NOTHING;

-- 3. artist_services
CREATE TABLE IF NOT EXISTS artist_services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  service_status text DEFAULT 'pending',
  proof_status text,
  price_range text,
  available_locations text[],
  admin_approved boolean DEFAULT false,
  notes text,
  UNIQUE(artist_id, service_id)
);

-- 4. artworks
CREATE TABLE IF NOT EXISTS artworks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  title text,
  description text,
  medium text,
  category text,
  image_url text NOT NULL,
  year text,
  service_relevance text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured boolean DEFAULT false,
  consent_to_publish boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  city text NOT NULL,
  area text,
  service_needed text NOT NULL,
  budget_range text,
  deadline text,
  description text NOT NULL,
  reference_url text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'matched', 'closed')),
  selected_artist_id uuid REFERENCES artists(id) ON DELETE SET NULL,
  assigned_admin uuid,
  internal_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. inquiry_matches
CREATE TABLE IF NOT EXISTS inquiry_matches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id uuid REFERENCES inquiries(id) ON DELETE CASCADE,
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  match_status text DEFAULT 'pending',
  artist_response text,
  client_response text,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. join_requests
CREATE TABLE IF NOT EXISTS join_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  city text NOT NULL,
  area text,
  mediums text[],
  service_interest text[],
  portfolio_links text,
  social_links text,
  short_bio text,
  available_for_paid_work boolean DEFAULT false,
  available_for_home_teaching boolean DEFAULT false,
  available_for_travel boolean DEFAULT false,
  consent_profile_public boolean DEFAULT true,
  consent_artwork_public boolean DEFAULT true,
  message text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. teacher_profiles
CREATE TABLE IF NOT EXISTS teacher_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  age_groups text[],
  class_modes text[],
  teaching_video_url text,
  home_visit_available boolean DEFAULT false,
  online_available boolean DEFAULT false,
  preferred_locations text[],
  parent_present_policy_accepted boolean DEFAULT false,
  id_proof_status text DEFAULT 'pending',
  status text DEFAULT 'pending'
);

-- 9. mural_profiles
CREATE TABLE IF NOT EXISTS mural_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  past_mural_count integer DEFAULT 0,
  max_wall_size text,
  indoor_available boolean DEFAULT false,
  outdoor_available boolean DEFAULT false,
  material_experience text,
  travel_available boolean DEFAULT false,
  starting_price_range text,
  proof_images text[],
  status text DEFAULT 'pending'
);

-- 10. event_artist_profiles
CREATE TABLE IF NOT EXISTS event_artist_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  event_types text[],
  live_video_url text,
  max_duration text,
  travel_available boolean DEFAULT false,
  pricing_range text,
  setup_requirements text,
  status text DEFAULT 'pending'
);

-- 11. featured_items
CREATE TABLE IF NOT EXISTS featured_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type text NOT NULL,
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  start_date date,
  end_date date,
  reason text,
  created_by uuid
);

-- 12. collaboration_requests
CREATE TABLE IF NOT EXISTS collaboration_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  organization_name text,
  role text,
  phone text NOT NULL,
  email text,
  city text NOT NULL,
  collaboration_type text NOT NULL,
  description text NOT NULL,
  preferred_timeline text,
  budget_range text,
  status text DEFAULT 'new',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid, -- Reference to auth.users if using Supabase Auth
  role text DEFAULT 'admin',
  permissions text[],
  status text DEFAULT 'active'
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mural_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 1. artists: Public can read approved artists that consent to public profile.
CREATE POLICY "Public can read approved artists" ON artists
  FOR SELECT USING (status = 'approved' AND consent_profile_public = true);

-- 2. services: Public can read active services.
CREATE POLICY "Public can read active services" ON services
  FOR SELECT USING (status = 'active');

-- 3. artist_services: Public can read approved services.
CREATE POLICY "Public can read approved artist services" ON artist_services
  FOR SELECT USING (admin_approved = true);

-- 4. artworks: Public can read approved artworks where artist consents.
CREATE POLICY "Public can read approved artworks" ON artworks
  FOR SELECT USING (status = 'approved' AND consent_to_publish = true);

-- 5. inquiries: Public can insert inquiries. Admins/authenticated users read all (omitted for MVP, default deny read).
CREATE POLICY "Public can insert inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

-- 6. join_requests: Public can insert join requests.
CREATE POLICY "Public can insert join requests" ON join_requests
  FOR INSERT WITH CHECK (true);

-- 7. collaboration_requests: Public can insert collaboration requests.
CREATE POLICY "Public can insert collaboration requests" ON collaboration_requests
  FOR INSERT WITH CHECK (true);

-- 8. teacher_profiles / mural_profiles / event_artist_profiles / featured_items:
-- Public can read if status is approved/active (assuming joined externally, or broadly readable for MVP)
CREATE POLICY "Public can read active teacher profiles" ON teacher_profiles
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can read active mural profiles" ON mural_profiles
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can read active event artist profiles" ON event_artist_profiles
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can read featured items" ON featured_items
  FOR SELECT USING (true);

-- (Note: In a true production app, you would add policies for authenticated admins to have ALL access)

-- ==============================================================================
-- STORAGE BUCKETS
-- (To be created via Supabase Dashboard or API, but defined here for documentation)
-- ==============================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES 
--   ('artist-profiles', 'artist-profiles', true),
--   ('artworks', 'artworks', true),
--   ('mural-proofs', 'mural-proofs', false),
--   ('event-proofs', 'event-proofs', false),
--   ('application-uploads', 'application-uploads', false)
-- ON CONFLICT (id) DO NOTHING;
