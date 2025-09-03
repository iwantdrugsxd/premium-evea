-- Sample Community Data
-- Run this file AFTER you have actual users in your auth.users table
-- Replace the UUIDs below with actual user IDs from your system

-- First, let's get some actual user IDs (uncomment and modify as needed)
-- SELECT id, email FROM auth.users LIMIT 3;

-- Sample Community Posts
-- Replace 'your-actual-user-uuid-1', 'your-actual-user-uuid-2', etc. with real user IDs
INSERT INTO community_posts (user_id, event_type, title, content, tags, likes_count, comments_count) VALUES
  ('your-actual-user-uuid-1', 'Wedding', 'Our Dream Wedding at The Taj', 'Can''t thank EVEA enough for making our special day absolutely perfect! The Premium package was worth every penny. The team of 10 coordinators ensured everything ran smoothly. From the initial planning to the final execution, every detail was handled with precision and care. The venue looked absolutely stunning, and our guests are still talking about how smoothly everything went!', ARRAY['#LuxuryWedding', '#EVEAPremium', '#MumbaiWedding'], 342, 28),
  
  ('your-actual-user-uuid-2', 'Corporate', 'Annual Tech Summit 2025 Success!', 'Successfully hosted 500+ attendees at our annual summit. EVEA''s Professional package handled everything from vendor management to live streaming setup. The feedback has been incredible! The team''s attention to detail and professional approach made this our best event yet. The live streaming setup was flawless, and the networking sessions were perfectly organized.', ARRAY['#CorporateEvent', '#TechSummit', '#LiveStreaming'], 189, 15),
  
  ('your-actual-user-uuid-3', 'Birthday', '50th Birthday Bash - A Night to Remember', 'The Basic package exceeded our expectations! Even with the starter package, EVEA''s team of 5 made sure every detail was perfect. The decoration and vendor coordination were flawless. It''s amazing how much value we got from the Basic package - truly exceeded all our expectations!', ARRAY['#BirthdayParty', '#EVEABasic', '#DelhiEvents'], 127, 9);

-- Sample Community Articles
INSERT INTO community_articles (author_id, category, title, excerpt, content, reading_time, tags, is_published, is_featured, published_at) VALUES
  ('your-actual-user-uuid-1', 'Trend Analysis', '10 Trends Shaping Mumbai''s Event Scene in 2025', 'Discover the latest innovations in event planning, from immersive AR experiences to sustainable celebration practices that are transforming how we create memorable moments. This comprehensive guide covers everything from technology integration to eco-friendly practices that are revolutionizing the event industry.', 'Full article content here with detailed analysis of trends, case studies, and expert insights...', '8 min read', ARRAY['#Trends', '#Mumbai', '#2025'], true, true, NOW() - INTERVAL '2 days'),
  
  ('your-actual-user-uuid-1', 'Vendor Reviews', 'Vendor Spotlight: Mumbai''s Top Caterers', 'We''ve curated a list of the most exceptional catering services in Mumbai, featuring authentic cuisines and innovative menu options that will elevate your event. From traditional Maharashtrian cuisine to international fusion, these caterers bring years of experience and culinary excellence to every event.', 'Full article content here with detailed vendor profiles, menu samples, pricing guides, and customer testimonials...', '6 min read', ARRAY['#Catering', '#Mumbai', '#Vendors'], true, false, NOW() - INTERVAL '1 week');

-- Sample Comments (optional - requires actual post/article IDs)
-- INSERT INTO community_comments (user_id, item_id, item_type, content) VALUES
--   ('your-actual-user-uuid-2', 1, 'post', 'Congratulations! Your wedding looked absolutely beautiful!'),
--   ('your-actual-user-uuid-3', 1, 'post', 'EVEA really does amazing work!'),
--   ('your-actual-user-uuid-1', 1, 'article', 'Great insights! Looking forward to implementing these trends.');

-- Instructions for use:
-- 1. First, create some users in your system through the registration process
-- 2. Get their UUIDs by running: SELECT id, email FROM auth.users;
-- 3. Replace 'your-actual-user-uuid-1', 'your-actual-user-uuid-2', etc. with the actual UUIDs
-- 4. Run this script to populate your community with sample data
