/*
  # Build Buddy Database Schema

  ## Overview
  Complete database schema for Build Buddy - a platform connecting students with active projects.

  ## New Tables
  
  ### `profiles`
  - `id` (uuid, FK to auth.users)
  - `name` (text)
  - `bio` (text, nullable)
  - `role` (text: student, project_owner, admin)
  - `experience` (text: beginner, intermediate, advanced)
  - `avatar_url` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `skills`
  - `id` (bigserial, PK)
  - `name` (text, unique)
  - `created_at` (timestamptz)

  ### `user_skills`
  - `user_id` (uuid, FK to profiles)
  - `skill_id` (bigint, FK to skills)
  - Primary key: (user_id, skill_id)

  ### `projects`
  - `id` (uuid, PK)
  - `owner_id` (uuid, FK to profiles)
  - `title` (text)
  - `description` (text)
  - `domain` (text)
  - `status` (text: open, in_progress, near_completion, completed)
  - `duration` (text)
  - `progress` (int, 0-100)
  - `slots_total` (int)
  - `slots_filled` (int)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `project_skills`
  - `project_id` (uuid, FK to projects)
  - `skill_id` (bigint, FK to skills)
  - Primary key: (project_id, skill_id)

  ### `project_members`
  - `id` (uuid, PK)
  - `project_id` (uuid, FK to projects)
  - `user_id` (uuid, FK to profiles)
  - `role` (text: owner, member)
  - `status` (text: pending, accepted, rejected)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Profiles: Users can read all, update own
  - Skills: Public read, authenticated insert
  - Projects: Public read, owner can update/delete
  - Project members: Project owner can manage, users can apply
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  bio text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'project_owner', 'admin')),
  experience text DEFAULT 'beginner' CHECK (experience IN ('beginner', 'intermediate', 'advanced')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id bigserial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User skills junction table
CREATE TABLE IF NOT EXISTS user_skills (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id bigint REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill_id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  domain text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'near_completion', 'completed')),
  duration text NOT NULL,
  progress int DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  slots_total int NOT NULL CHECK (slots_total > 0),
  slots_filled int DEFAULT 0 CHECK (slots_filled >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project skills junction table
CREATE TABLE IF NOT EXISTS project_skills (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  skill_id bigint REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

-- Project members table
CREATE TABLE IF NOT EXISTS project_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Skills policies (public read, authenticated can add)
CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- User skills policies
CREATE POLICY "User skills are viewable by everyone"
  ON user_skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own skills"
  ON user_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON user_skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Project owners can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Project skills policies
CREATE POLICY "Project skills are viewable by everyone"
  ON project_skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Project owners can manage project skills"
  ON project_skills FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete project skills"
  ON project_skills FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Project members policies
CREATE POLICY "Project members are viewable by authenticated users"
  ON project_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can apply to projects"
  ON project_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND role = 'member');

CREATE POLICY "Project owners can update member status"
  ON project_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
      AND projects.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete members"
  ON project_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', 'User'), 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_members_updated_at ON project_members;
CREATE TRIGGER update_project_members_updated_at
  BEFORE UPDATE ON project_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();