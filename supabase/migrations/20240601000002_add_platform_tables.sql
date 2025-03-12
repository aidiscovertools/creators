-- Create platforms table
CREATE TABLE IF NOT EXISTS platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES profiles(id) NOT NULL,
  subdomain TEXT UNIQUE,
  custom_domain TEXT UNIQUE,
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  description TEXT,
  benefits JSONB,
  is_popular BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  tier_id UUID REFERENCES subscription_tiers(id),
  status TEXT DEFAULT 'pending',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE
);

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL,
  content_data JSONB,
  thumbnail_url TEXT,
  access_tier UUID REFERENCES subscription_tiers(id),
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies for platforms
DROP POLICY IF EXISTS "Creators can manage their own platforms" ON platforms;
CREATE POLICY "Creators can manage their own platforms"
  ON platforms
  USING (creator_id = auth.uid());

DROP POLICY IF EXISTS "Public can view active platforms" ON platforms;
CREATE POLICY "Public can view active platforms"
  ON platforms FOR SELECT
  USING (status = 'active');

-- Create policies for subscription_tiers
DROP POLICY IF EXISTS "Platform creators can manage tiers" ON subscription_tiers;
CREATE POLICY "Platform creators can manage tiers"
  ON subscription_tiers
  USING (platform_id IN (SELECT id FROM platforms WHERE creator_id = auth.uid()));

DROP POLICY IF EXISTS "Public can view public tiers" ON subscription_tiers;
CREATE POLICY "Public can view public tiers"
  ON subscription_tiers FOR SELECT
  USING (is_public = true AND platform_id IN (SELECT id FROM platforms WHERE status = 'active'));

-- Create policies for members
DROP POLICY IF EXISTS "Platform creators can manage members" ON members;
CREATE POLICY "Platform creators can manage members"
  ON members
  USING (platform_id IN (SELECT id FROM platforms WHERE creator_id = auth.uid()));

DROP POLICY IF EXISTS "Members can view their own membership" ON members;
CREATE POLICY "Members can view their own membership"
  ON members FOR SELECT
  USING (user_id = auth.uid());

-- Create policies for content
DROP POLICY IF EXISTS "Platform creators can manage content" ON content;
CREATE POLICY "Platform creators can manage content"
  ON content
  USING (platform_id IN (SELECT id FROM platforms WHERE creator_id = auth.uid()));

DROP POLICY IF EXISTS "Public can view published content" ON content;
CREATE POLICY "Public can view published content"
  ON content FOR SELECT
  USING (status = 'published' AND platform_id IN (SELECT id FROM platforms WHERE status = 'active'));

-- Realtime will be enabled in a separate migration