-- Migration: Add description field to session_types table
-- Date: 2025-09-26
-- Description: Adds an optional description field to session_types table

-- Add description column to session_types table
ALTER TABLE session_types
ADD COLUMN description TEXT;

-- Add comment for documentation
COMMENT ON COLUMN session_types.description IS 'Optional description of the session type';