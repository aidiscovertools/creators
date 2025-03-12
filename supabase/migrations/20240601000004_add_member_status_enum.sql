-- Add member status enum type
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_status') THEN
    CREATE TYPE member_status AS ENUM ('active', 'pending', 'suspended');
  END IF;
END $$;

-- First remove default if exists
ALTER TABLE members ALTER COLUMN status DROP DEFAULT;

-- Update members table to use the enum type
ALTER TABLE members ALTER COLUMN status TYPE member_status USING (CASE WHEN status IS NULL THEN 'active' ELSE status END)::member_status;

-- Add default value for status
ALTER TABLE members ALTER COLUMN status SET DEFAULT 'active'::member_status;

-- Check if members table is already in the publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'members'
  ) THEN
    -- Enable realtime for members table only if not already enabled
    ALTER PUBLICATION supabase_realtime ADD TABLE members;
  END IF;
END
$$;
