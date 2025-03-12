-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create platforms table
CREATE TABLE IF NOT EXISTS platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  subdomain TEXT UNIQUE,
  custom_domain TEXT UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#ffffff',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
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
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES subscription_tiers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform_id)
);

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL,
  content_data JSONB,
  thumbnail_url TEXT,
  access_tier UUID REFERENCES subscription_tiers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Platforms policies
CREATE POLICY "Creators can view their own platforms" 
ON platforms FOR SELECT 
USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert their own platforms" 
ON platforms FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own platforms" 
ON platforms FOR UPDATE 
USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own platforms" 
ON platforms FOR DELETE 
USING (auth.uid() = creator_id);

-- Public can view active platforms
CREATE POLICY "Public can view active platforms" 
ON platforms FOR SELECT 
USING (status = 'active');

-- Subscription tiers policies
CREATE POLICY "Creators can manage their platform tiers" 
ON subscription_tiers 
USING (EXISTS (
  SELECT 1 FROM platforms 
  WHERE platforms.id = subscription_tiers.platform_id 
  AND platforms.creator_id = auth.uid()
));

CREATE POLICY "Public can view public tiers" 
ON subscription_tiers FOR SELECT 
USING (is_public = true);

-- Members policies
CREATE POLICY "Creators can view their platform members" 
ON members 
USING (EXISTS (
  SELECT 1 FROM platforms 
  WHERE platforms.id = members.platform_id 
  AND platforms.creator_id = auth.uid()
));

CREATE POLICY "Members can view their own membership" 
ON members FOR SELECT 
USING (user_id = auth.uid());

-- Content policies
CREATE POLICY "Creators can manage their content" 
ON content 
USING (creator_id = auth.uid());

CREATE POLICY "Public can view published content" 
ON content FOR SELECT 
USING (status = 'published');

-- Enable realtime
alter publication supabase_realtime add table platforms;
alter publication supabase_realtime add table subscription_tiers;
alter publication supabase_realtime add table content;
