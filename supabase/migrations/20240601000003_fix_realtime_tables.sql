-- Check if tables are already in the publication before adding them
DO $$
BEGIN
  -- Check platforms table
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'platforms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE platforms;
  END IF;

  -- Check subscription_tiers table
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'subscription_tiers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE subscription_tiers;
  END IF;

  -- Check members table
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE members;
  END IF;

  -- Check content table
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'content'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE content;
  END IF;
END
$$;