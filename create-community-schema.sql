-- Community Features Database Schema
-- This file creates all necessary tables for the community functionality

-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  instagram_link TEXT,
  youtube_link TEXT,
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Articles Table
CREATE TABLE IF NOT EXISTS community_articles (
  id SERIAL PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  reading_time VARCHAR(20) DEFAULT '5 min read',
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Likes Table
CREATE TABLE IF NOT EXISTS community_likes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('post', 'article')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

-- Community Comments Table
CREATE TABLE IF NOT EXISTS community_comments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('post', 'article')),
  content TEXT NOT NULL,
  parent_id INTEGER REFERENCES community_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Follows Table (for following users)
CREATE TABLE IF NOT EXISTS community_follows (
  id SERIAL PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Community Notifications Table
CREATE TABLE IF NOT EXISTS community_notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_event_type ON community_posts(event_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_active ON community_posts(is_active);

CREATE INDEX IF NOT EXISTS idx_community_articles_author_id ON community_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_community_articles_published_at ON community_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_articles_category ON community_articles(category);
CREATE INDEX IF NOT EXISTS idx_community_articles_is_published ON community_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_community_articles_is_featured ON community_articles(is_featured);

CREATE INDEX IF NOT EXISTS idx_community_likes_user_id ON community_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_item ON community_likes(item_id, item_type);

CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_item ON community_comments(item_id, item_type);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON community_comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_follows_follower ON community_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_community_follows_following ON community_follows(following_id);

CREATE INDEX IF NOT EXISTS idx_community_notifications_user_id ON community_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_community_notifications_is_read ON community_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_community_notifications_created_at ON community_notifications(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_notifications ENABLE ROW LEVEL SECURITY;

-- Community Posts Policies
CREATE POLICY "Anyone can view active community posts" ON community_posts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create their own posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Community Articles Policies
CREATE POLICY "Anyone can view published articles" ON community_articles
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create their own articles" ON community_articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own articles" ON community_articles
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own articles" ON community_articles
  FOR DELETE USING (auth.uid() = author_id);

-- Community Likes Policies
CREATE POLICY "Anyone can view likes" ON community_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own likes" ON community_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON community_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Community Comments Policies
CREATE POLICY "Anyone can view active comments" ON community_comments
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create their own comments" ON community_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON community_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON community_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Community Follows Policies
CREATE POLICY "Anyone can view follows" ON community_follows
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own follows" ON community_follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" ON community_follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Community Notifications Policies
CREATE POLICY "Users can view their own notifications" ON community_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON community_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_community_posts_updated_at 
  BEFORE UPDATE ON community_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_articles_updated_at 
  BEFORE UPDATE ON community_articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at 
  BEFORE UPDATE ON community_comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (commented out - uncomment after creating users)
-- Note: These sample records require actual user IDs from auth.users table
-- You can uncomment and modify these after you have real users in your system

/*
INSERT INTO community_posts (user_id, event_type, title, content, tags, likes_count, comments_count) VALUES
  ('your-actual-user-uuid-here', 'Wedding', 'Our Dream Wedding at The Taj', 'Can''t thank EVEA enough for making our special day absolutely perfect! The Premium package was worth every penny. The team of 10 coordinators ensured everything ran smoothly...', ARRAY['#LuxuryWedding', '#EVEAPremium', '#MumbaiWedding'], 342, 28),
  ('your-actual-user-uuid-here', 'Corporate', 'Annual Tech Summit 2025 Success!', 'Successfully hosted 500+ attendees at our annual summit. EVEA''s Professional package handled everything from vendor management to live streaming setup. The feedback has been incredible!', ARRAY['#CorporateEvent', '#TechSummit', '#LiveStreaming'], 189, 15),
  ('your-actual-user-uuid-here', 'Birthday', '50th Birthday Bash - A Night to Remember', 'The Basic package exceeded our expectations! Even with the starter package, EVEA''s team of 5 made sure every detail was perfect. The decoration and vendor coordination were flawless.', ARRAY['#BirthdayParty', '#EVEABasic', '#DelhiEvents'], 127, 9);

INSERT INTO community_articles (author_id, category, title, excerpt, content, reading_time, tags, is_published, is_featured, published_at) VALUES
  ('your-actual-user-uuid-here', 'Trend Analysis', '10 Trends Shaping Mumbai''s Event Scene in 2025', 'Discover the latest innovations in event planning, from immersive AR experiences to sustainable celebration practices that are transforming how we create memorable moments...', 'Full article content here...', '8 min read', ARRAY['#Trends', '#Mumbai', '#2025'], true, true, NOW() - INTERVAL '2 days'),
  ('your-actual-user-uuid-here', 'Vendor Reviews', 'Vendor Spotlight: Mumbai''s Top Caterers', 'We''ve curated a list of the most exceptional catering services in Mumbai, featuring authentic cuisines and innovative menu options that will elevate your event...', 'Full article content here...', '6 min read', ARRAY['#Catering', '#Mumbai', '#Vendors'], true, false, NOW() - INTERVAL '1 week');
*/

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
