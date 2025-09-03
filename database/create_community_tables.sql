-- Create Community Stories Tables
-- Run this in your Supabase SQL Editor

-- 1. Create the main stories table
CREATE TABLE IF NOT EXISTS community_stories (
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

-- 2. Create the likes table
CREATE TABLE IF NOT EXISTS story_likes (
  id SERIAL PRIMARY KEY,
  story_id INTEGER REFERENCES community_stories(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, user_id)
);

-- 3. Create the comments table
CREATE TABLE IF NOT EXISTS story_comments (
  id SERIAL PRIMARY KEY,
  story_id INTEGER REFERENCES community_stories(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_stories_user_id ON community_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_community_stories_event_type ON community_stories(event_type);
CREATE INDEX IF NOT EXISTS idx_community_stories_created_at ON community_stories(created_at);
CREATE INDEX IF NOT EXISTS idx_community_stories_published ON community_stories(is_published);

CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_user_id ON story_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_user_id ON story_comments(user_id);

-- 5. Insert sample data for testing
INSERT INTO community_stories (title, content, event_type, location, event_date, tags, images, user_id) VALUES
(
  'My Dream Wedding with EVEA',
  'EVEA made our wedding absolutely magical! From the initial planning to the final dance, everything was perfect. The team was professional, creative, and made sure every detail was taken care of. Our guests are still talking about how beautiful everything was!',
  'Wedding',
  'Mumbai',
  '2024-01-15',
  ARRAY['wedding', 'mumbai', 'dream', 'perfect'],
  ARRAY['https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg'],
  'user-123'
),
(
  'Amazing Birthday Party Experience',
  'My daughter''s 10th birthday party was a huge success thanks to EVEA! The princess theme was executed flawlessly, and all the kids had an amazing time. The decorations, games, and entertainment were top-notch.',
  'Birthday Party',
  'Delhi',
  '2024-02-20',
  ARRAY['birthday', 'kids', 'princess', 'fun'],
  ARRAY['https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg'],
  'user-456'
);

-- 6. Insert sample likes
INSERT INTO story_likes (story_id, user_id) VALUES
(1, 'user-456'),
(1, 'user-789'),
(2, 'user-123');

-- 7. Insert sample comments
INSERT INTO story_comments (story_id, user_id, content) VALUES
(1, 'user-456', 'Congratulations! Your wedding looks absolutely beautiful!'),
(1, 'user-789', 'EVEA really knows how to make dreams come true!'),
(2, 'user-123', 'What a lovely party! The decorations are amazing.');

-- 8. Enable Row Level Security (optional - for production)
-- ALTER TABLE community_stories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;
