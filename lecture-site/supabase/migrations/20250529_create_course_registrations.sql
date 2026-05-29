-- Create course_registrations table
CREATE TABLE IF NOT EXISTS course_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  course_id text NOT NULL,
  course_name text NOT NULL,
  price integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_course_registrations_email ON course_registrations(email);

-- Enable Row Level Security
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for registration form)
CREATE POLICY "allow_anon_insert" ON course_registrations
  FOR INSERT TO anon WITH CHECK (true);

-- Allow reading registrations (filtered by email in app layer)
CREATE POLICY "allow_anon_select" ON course_registrations
  FOR SELECT TO anon USING (true);
