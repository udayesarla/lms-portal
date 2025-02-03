/*
  # Create courses and user_courses tables

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `instructor` (text)
      - `thumbnail` (text)
      - `duration` (text)
      - `youtube_url` (text)
      - `created_at` (timestamp)
    - `user_courses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `course_id` (uuid, foreign key)
      - `progress` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for course access
    - Add policies for user course progress
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  instructor text NOT NULL,
  thumbnail text NOT NULL,
  duration text NOT NULL,
  youtube_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;

-- Courses are readable by all authenticated users
CREATE POLICY "Courses are viewable by all users"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

-- User course progress is only viewable by the owner
CREATE POLICY "Users can view their own course progress"
  ON user_courses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own course progress
CREATE POLICY "Users can update their own course progress"
  ON user_courses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can enroll in courses
CREATE POLICY "Users can enroll in courses"
  ON user_courses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);