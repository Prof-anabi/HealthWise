/*
  # Fix Foreign Key Constraint Issues

  This migration addresses the foreign key constraint violation by:
  1. Updating the foreign key constraint to use CASCADE options
  2. Ensuring proper referential integrity while allowing necessary operations

  ## Changes Made:
  1. Drop existing foreign key constraint
  2. Recreate with proper CASCADE options
  3. Add helpful functions for safe profile updates
*/

-- Drop the existing foreign key constraint
ALTER TABLE conversation_participants 
DROP CONSTRAINT IF EXISTS conversation_participants_user_id_fkey;

-- Recreate the foreign key constraint with CASCADE DELETE
-- This means when a profile is deleted, related conversation participants are also deleted
ALTER TABLE conversation_participants 
ADD CONSTRAINT conversation_participants_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Also ensure the conversation_id foreign key has proper CASCADE behavior
ALTER TABLE conversation_participants 
DROP CONSTRAINT IF EXISTS conversation_participants_conversation_id_fkey;

ALTER TABLE conversation_participants 
ADD CONSTRAINT conversation_participants_conversation_id_fkey 
FOREIGN KEY (conversation_id) REFERENCES conversations(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Similarly, fix the messages table foreign key constraints
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

ALTER TABLE messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES profiles(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_conversation_id_fkey;

ALTER TABLE messages 
ADD CONSTRAINT messages_conversation_id_fkey 
FOREIGN KEY (conversation_id) REFERENCES conversations(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Create a function to safely update profile information
-- This function handles profile updates while preserving referential integrity
CREATE OR REPLACE FUNCTION safe_update_profile(
  profile_id uuid,
  new_email text DEFAULT NULL,
  new_first_name text DEFAULT NULL,
  new_last_name text DEFAULT NULL,
  new_phone text DEFAULT NULL,
  new_bio text DEFAULT NULL,
  new_specialties text[] DEFAULT NULL,
  new_preferences jsonb DEFAULT NULL
) RETURNS profiles AS $$
DECLARE
  updated_profile profiles;
BEGIN
  UPDATE profiles SET
    email = COALESCE(new_email, email),
    first_name = COALESCE(new_first_name, first_name),
    last_name = COALESCE(new_last_name, last_name),
    phone = COALESCE(new_phone, phone),
    bio = COALESCE(new_bio, bio),
    specialties = COALESCE(new_specialties, specialties),
    preferences = COALESCE(new_preferences, preferences),
    updated_at = now()
  WHERE id = profile_id
  RETURNING * INTO updated_profile;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile with ID % not found', profile_id;
  END IF;
  
  RETURN updated_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to safely delete a profile and all related data
CREATE OR REPLACE FUNCTION safe_delete_profile(profile_id uuid) 
RETURNS boolean AS $$
DECLARE
  profile_exists boolean;
BEGIN
  -- Check if profile exists
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = profile_id) INTO profile_exists;
  
  IF NOT profile_exists THEN
    RAISE EXCEPTION 'Profile with ID % not found', profile_id;
  END IF;
  
  -- Delete the profile (CASCADE will handle related records)
  DELETE FROM profiles WHERE id = profile_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the functions to authenticated users
GRANT EXECUTE ON FUNCTION safe_update_profile TO authenticated;
GRANT EXECUTE ON FUNCTION safe_delete_profile TO authenticated;

-- Add helpful comments
COMMENT ON FUNCTION safe_update_profile IS 'Safely updates profile information while preserving referential integrity';
COMMENT ON FUNCTION safe_delete_profile IS 'Safely deletes a profile and all related conversation data';

-- Verify the constraints are properly set
DO $$
DECLARE
  constraint_count integer;
BEGIN
  SELECT COUNT(*) INTO constraint_count
  FROM information_schema.table_constraints tc
  JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
  WHERE tc.table_name = 'conversation_participants'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND rc.delete_rule = 'CASCADE';
  
  IF constraint_count >= 2 THEN
    RAISE NOTICE 'SUCCESS: Foreign key constraints updated with CASCADE options';
  ELSE
    RAISE WARNING 'WARNING: Some foreign key constraints may not have CASCADE options';
  END IF;
END $$;