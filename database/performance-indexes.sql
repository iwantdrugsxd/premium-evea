-- Performance Optimization Indexes
-- Run this in your Supabase SQL editor to dramatically improve query performance

-- =============================================
-- VENDORS TABLE INDEXES
-- =============================================

-- Primary query indexes
CREATE INDEX IF NOT EXISTS idx_vendors_status_rating ON vendors(status, rating DESC);
CREATE INDEX IF NOT EXISTS idx_vendors_category_status ON vendors(category, status);
CREATE INDEX IF NOT EXISTS idx_vendors_location_status ON vendors(location, status);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at ON vendors(created_at DESC);

-- Search optimization indexes
CREATE INDEX IF NOT EXISTS idx_vendors_name_trgm ON vendors USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_vendors_description_trgm ON vendors USING gin(description gin_trgm_ops);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_vendors_status_rating_events ON vendors(status, rating DESC, events_count DESC);
CREATE INDEX IF NOT EXISTS idx_vendors_category_rating ON vendors(category, rating DESC) WHERE status = 'approved';

-- =============================================
-- VENDOR_PORTFOLIO TABLE INDEXES
-- =============================================

-- Foreign key and category indexes
CREATE INDEX IF NOT EXISTS idx_vendor_portfolio_vendor_id ON vendor_portfolio(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_portfolio_category ON vendor_portfolio(category);
CREATE INDEX IF NOT EXISTS idx_vendor_portfolio_created_at ON vendor_portfolio(created_at DESC);

-- Composite index for vendor portfolio queries
CREATE INDEX IF NOT EXISTS idx_vendor_portfolio_vendor_category ON vendor_portfolio(vendor_id, category);

-- =============================================
-- VENDOR_REVIEWS TABLE INDEXES
-- =============================================

-- Foreign key and rating indexes
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_vendor_id ON vendor_reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_rating ON vendor_reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_created_at ON vendor_reviews(created_at DESC);

-- Composite index for vendor review queries
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_vendor_rating ON vendor_reviews(vendor_id, rating DESC);

-- =============================================
-- EVENTS TABLE INDEXES
-- =============================================

-- Primary event indexes
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- Composite index for active events
CREATE INDEX IF NOT EXISTS idx_events_active_category ON events(is_active, category) WHERE is_active = true;

-- =============================================
-- EVENT_SERVICES TABLE INDEXES
-- =============================================

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_event_services_event_id ON event_services(event_id);
CREATE INDEX IF NOT EXISTS idx_event_services_category ON event_services(category);

-- Composite index for event services queries
CREATE INDEX IF NOT EXISTS idx_event_services_event_category ON event_services(event_id, category);

-- =============================================
-- EVENT_PACKAGES TABLE INDEXES
-- =============================================

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_event_packages_event_id ON event_packages(event_id);
CREATE INDEX IF NOT EXISTS idx_event_packages_name ON event_packages(name);

-- Composite index for event packages queries
CREATE INDEX IF NOT EXISTS idx_event_packages_event_name ON event_packages(event_id, name);

-- =============================================
-- COMMUNITY STORIES INDEXES
-- =============================================

-- Story query indexes
CREATE INDEX IF NOT EXISTS idx_community_stories_published ON community_stories(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_stories_event_type ON community_stories(event_type, is_published);
CREATE INDEX IF NOT EXISTS idx_community_stories_user_id ON community_stories(user_id, created_at DESC);

-- Search optimization for stories
CREATE INDEX IF NOT EXISTS idx_community_stories_title_trgm ON community_stories USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_community_stories_content_trgm ON community_stories USING gin(content gin_trgm_ops);

-- =============================================
-- STORY LIKES INDEXES
-- =============================================

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_user_id ON story_likes(user_id);

-- Composite unique index (already exists but ensuring it's optimized)
CREATE UNIQUE INDEX IF NOT EXISTS idx_story_likes_unique ON story_likes(story_id, user_id);

-- =============================================
-- STORY COMMENTS INDEXES
-- =============================================

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON story_comments(story_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_story_comments_user_id ON story_comments(user_id);

-- =============================================
-- PERFORMANCE MONITORING
-- =============================================

-- Create a function to check index usage
CREATE OR REPLACE FUNCTION check_index_usage()
RETURNS TABLE(
    table_name text,
    index_name text,
    index_size text,
    index_usage_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename as table_name,
        indexname as index_name,
        pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
        idx_tup_read + idx_tup_fetch as index_usage_count
    FROM pg_stat_user_indexes 
    WHERE schemaname = 'public'
    ORDER BY index_usage_count DESC;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- QUERY OPTIMIZATION SETTINGS
-- =============================================

-- Enable query optimization
SET enable_seqscan = off;  -- Force index usage when possible
SET random_page_cost = 1.1;  -- Optimize for SSD storage

-- =============================================
-- ANALYZE TABLES FOR BETTER QUERY PLANNING
-- =============================================

-- Update table statistics for better query planning
ANALYZE vendors;
ANALYZE vendor_portfolio;
ANALYZE vendor_reviews;
ANALYZE events;
ANALYZE event_services;
ANALYZE event_packages;
ANALYZE community_stories;
ANALYZE story_likes;
ANALYZE story_comments;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if indexes were created successfully
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Check index sizes
SELECT 
    schemaname||'.'||tablename as table_name,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
