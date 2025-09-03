-- Community Stories Database Schema

-- Stories table
CREATE TABLE IF NOT EXISTS community_stories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  event_date DATE,
  tags TEXT[], -- Array of tags
  images TEXT[], -- Array of Cloudinary image URLs
  user_id VARCHAR(255) NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Story likes table
CREATE TABLE IF NOT EXISTS story_likes (
  id SERIAL PRIMARY KEY,
  story_id INTEGER REFERENCES community_stories(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, user_id)
);

-- Story comments table
CREATE TABLE IF NOT EXISTS story_comments (
  id SERIAL PRIMARY KEY,
  story_id INTEGER REFERENCES community_stories(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_stories_user_id ON community_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_community_stories_event_type ON community_stories(event_type);
CREATE INDEX IF NOT EXISTS idx_community_stories_created_at ON community_stories(created_at);
CREATE INDEX IF NOT EXISTS idx_community_stories_published ON community_stories(is_published);

CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_user_id ON story_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_user_id ON story_comments(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE community_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_stories
CREATE POLICY "Anyone can view published stories" ON community_stories
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can insert their own stories" ON community_stories
  FOR INSERT WITH CHECK (true); -- Allow anyone to create stories for now

CREATE POLICY "Users can update their own stories" ON community_stories
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own stories" ON community_stories
  FOR DELETE USING (user_id = auth.uid()::text);

-- RLS Policies for story_likes
CREATE POLICY "Anyone can view likes" ON story_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON story_likes
  FOR INSERT WITH CHECK (true); -- Allow anyone to like for now

CREATE POLICY "Users can delete their own likes" ON story_likes
  FOR DELETE USING (user_id = auth.uid()::text);

-- RLS Policies for story_comments
CREATE POLICY "Anyone can view comments" ON story_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON story_comments
  FOR INSERT WITH CHECK (true); -- Allow anyone to comment for now

CREATE POLICY "Users can update their own comments" ON story_comments
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own comments" ON story_comments
  FOR DELETE USING (user_id = auth.uid()::text);

-- Insert some sample data
INSERT INTO community_stories (title, content, event_type, location, event_date, tags, images, user_id) VALUES
(
  'My Dream Wedding with EVEA',
  'EVEA made our wedding absolutely magical! From the initial planning to the final dance, everything was perfect. The team was professional, creative, and made sure every detail was taken care of. Our guests are still talking about how beautiful everything was!',
  'Wedding',
  'Mumbai',
  '2024-01-15',
  ARRAY['wedding', 'mumbai', 'dream', 'perfect'],
  ARRAY['https://res.cloudinary.com/your-cloud/image/upload/v1234567890/wedding1.jpg'],
  'user-123'
),
(
  'Amazing Birthday Party Experience',
  'My daughter''s 10th birthday party was a huge success thanks to EVEA! The princess theme was executed flawlessly, and all the kids had an amazing time. The decorations, games, and entertainment were top-notch.',
  'Birthday Party',
  'Delhi',
  '2024-02-20',
  ARRAY['birthday', 'kids', 'princess', 'fun'],
  ARRAY['https://res.cloudinary.com/your-cloud/image/upload/v1234567890/birthday1.jpg'],
  'user-456'
),
(
  'Corporate Event Success',
  'Our annual corporate event was handled beautifully by EVEA. The team managed everything from venue setup to catering, and the event ran smoothly. Highly recommend their services for corporate events!',
  'Corporate Event',
  'Bangalore',
  '2024-03-10',
  ARRAY['corporate', 'professional', 'success'],
  ARRAY['https://res.cloudinary.com/your-cloud/image/upload/v1234567890/corporate1.jpg'],
  'user-789'
);

-- Insert some sample likes
INSERT INTO story_likes (story_id, user_id) VALUES
(1, 'user-456'),
(1, 'user-789'),
(2, 'user-123'),
(2, 'user-789'),
(3, 'user-123'),
(3, 'user-456');

-- Insert some sample comments
INSERT INTO story_comments (story_id, user_id, content) VALUES
(1, 'user-456', 'Congratulations! Your wedding looks absolutely beautiful!'),
(1, 'user-789', 'EVEA really knows how to make dreams come true!'),
(2, 'user-123', 'What a lovely party! The decorations are amazing.'),
(3, 'user-123', 'Great to hear about your successful corporate event!');
