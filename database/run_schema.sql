-- Run this script in your Supabase SQL editor to fix the comments and likes functionality

-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS story_comments CASCADE;
DROP TABLE IF EXISTS story_likes CASCADE;
DROP TABLE IF EXISTS community_stories CASCADE;

-- Recreate tables with proper schema
CREATE TABLE community_stories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  event_date DATE,
  tags TEXT[],
  images TEXT[],
  user_id VARCHAR(255) NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE story_likes (
  id SERIAL PRIMARY KEY,
  story_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, user_id)
);

CREATE TABLE story_comments (
  id SERIAL PRIMARY KEY,
  story_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_community_stories_user_id ON community_stories(user_id);
CREATE INDEX idx_community_stories_event_type ON community_stories(event_type);
CREATE INDEX idx_community_stories_created_at ON community_stories(created_at);
CREATE INDEX idx_community_stories_published ON community_stories(is_published);

CREATE INDEX idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX idx_story_likes_user_id ON story_likes(user_id);

CREATE INDEX idx_story_comments_story_id ON story_comments(story_id);
CREATE INDEX idx_story_comments_user_id ON story_comments(user_id);

-- Enable RLS
ALTER TABLE community_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view published stories" ON community_stories
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can insert their own stories" ON community_stories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view likes" ON story_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON story_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view comments" ON story_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON story_comments
  FOR INSERT WITH CHECK (true);

-- Insert sample data (only if tables are empty)
INSERT INTO community_stories (title, content, event_type, location, event_date, tags, images, user_id)
SELECT 
  'Sample Event Story',
  'This is a sample event story to get you started!',
  'Other',
  'Sample Location',
  CURRENT_DATE,
  ARRAY['sample', 'event'],
  ARRAY['https://via.placeholder.com/400x300/666666/FFFFFF?text=Sample+Image'],
  'user-123'
WHERE NOT EXISTS (SELECT 1 FROM community_stories LIMIT 1);
