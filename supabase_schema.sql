-- =============================================================
-- PORTFOLIO CMS — Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================================

-- 1. Profile (single row, stores hero/about/startup/contact info)
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Alex Dev',
  title TEXT DEFAULT 'IT Student • Web Developer • Startup Builder',
  intro TEXT DEFAULT 'I build modern web applications and explore the startup ecosystem.',
  about_story TEXT DEFAULT '',
  startup_vision TEXT DEFAULT '',
  email TEXT DEFAULT '',
  github TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  twitter TEXT DEFAULT '',
  character_image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'Code',
  category TEXT DEFAULT 'Frontend',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  tech_stack TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Messages (from contact form)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Admin users table (for auth metadata, optional)
-- Supabase Auth handles the actual authentication.
-- This is just for role tracking if needed.
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies (anyone can view portfolio data)
CREATE POLICY "Public can view profile" ON profile
  FOR SELECT USING (true);

CREATE POLICY "Public can view skills" ON skills
  FOR SELECT USING (true);

CREATE POLICY "Public can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public can view achievements" ON achievements
  FOR SELECT USING (true);

-- PUBLIC INSERT on messages (contact form submissions)
CREATE POLICY "Anyone can submit messages" ON messages
  FOR INSERT WITH CHECK (true);

-- AUTHENTICATED (admin) FULL ACCESS policies
CREATE POLICY "Admins can manage profile" ON profile
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage skills" ON skills
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage achievements" ON achievements
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage messages" ON messages
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================================
-- SEED DATA (insert default profile row)
-- =============================================================

INSERT INTO profile (name, title, intro, about_story, startup_vision, email, github, linkedin, twitter, character_image)
VALUES (
  'Alex Dev',
  'IT Student • Web Developer • Startup Builder',
  'I build modern web applications and explore the startup ecosystem.',
  'I started my journey with a deep curiosity for how things work on the internet. Now I build full-stack web applications and am currently exploring my startup idea.',
  'DevConnect - An all-in-one platform for developers, students, and companies.',
  'alex@devconnect.com',
  'https://github.com',
  'https://linkedin.com',
  'https://twitter.com',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974'
);

INSERT INTO skills (name, icon, category, sort_order) VALUES
  ('React', 'Code', 'Frontend', 1),
  ('TailwindCSS', 'Brush', 'Frontend', 2),
  ('Node.js', 'Server', 'Backend', 3),
  ('PostgreSQL', 'Database', 'Backend', 4);

INSERT INTO projects (title, description, tech_stack, image_url, github_url, live_url, sort_order) VALUES
  ('DevConnect Platform', 'A comprehensive developer platform for startups and students.', 'React, Supabase, Tailwind', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070', 'https://github.com', 'https://example.com', 1),
  ('Portfolio CMS', 'A dynamic portfolio with a built-in admin dashboard.', 'React, Vite, Zustand', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015', 'https://github.com', 'https://example.com', 2);

INSERT INTO achievements (title, date, sort_order) VALUES
  ('1st Place Global Hackathon', '2025', 1),
  ('AWS Certified Developer', '2024', 2);
