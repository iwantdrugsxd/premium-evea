-- Performance Optimization Indexes - FIXED for your actual schema
-- Run this in your Supabase SQL editor to dramatically improve query performance

-- =============================================
-- ENABLE REQUIRED EXTENSIONS
-- =============================================

-- Enable trigram extension for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================
-- VENDORS TABLE INDEXES (FIXED FOR YOUR SCHEMA)
-- =============================================

-- Primary query indexes (using correct column names)
CREATE INDEX IF NOT EXISTS idx_vendors_is_active ON vendors(is_active);
CREATE INDEX IF NOT EXISTS idx_vendors_average_rating ON vendors(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_vendors_business_type ON vendors(business_type);
CREATE INDEX IF NOT EXISTS idx_vendors_city ON vendors(city);
CREATE INDEX IF NOT EXISTS idx_vendors_state ON vendors(state);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at ON vendors(created_at DESC);

-- Search optimization indexes (using correct column names)
CREATE INDEX IF NOT EXISTS idx_vendors_business_name_trgm ON vendors USING gin(business_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_vendors_description_trgm ON vendors USING gin(description gin_trgm_ops);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_vendors_active_rating ON vendors(is_active, average_rating DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_vendors_business_type_rating ON vendors(business_type, average_rating DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_vendors_city_state ON vendors(city, state);
CREATE INDEX IF NOT EXISTS idx_vendors_rating_events ON vendors(average_rating DESC, total_events_completed DESC) WHERE is_active = true;

-- =============================================
-- EVENT_INQUIRIES TABLE INDEXES
-- =============================================

-- Primary query indexes
CREATE INDEX IF NOT EXISTS idx_event_inquiries_status ON event_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_event_inquiries_vendor_id ON event_inquiries(vendor_id);
CREATE INDEX IF NOT EXISTS idx_event_inquiries_event_type ON event_inquiries(event_type);
CREATE INDEX IF NOT EXISTS idx_event_inquiries_created_at ON event_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_inquiries_customer_email ON event_inquiries(customer_email);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_event_inquiries_vendor_status ON event_inquiries(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_event_inquiries_type_date ON event_inquiries(event_type, event_date);

-- =============================================
-- QUOTATIONS TABLE INDEXES
-- =============================================

-- Primary query indexes
CREATE INDEX IF NOT EXISTS idx_quotations_inquiry_id ON quotations(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotations_valid_until ON quotations(valid_until);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_quotations_inquiry_status ON quotations(inquiry_id, status);

-- =============================================
-- SIMPLE_REVIEWS TABLE INDEXES
-- =============================================

-- Primary query indexes
CREATE INDEX IF NOT EXISTS idx_simple_reviews_vendor_id ON simple_reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_simple_reviews_rating ON simple_reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_simple_reviews_created_at ON simple_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_simple_reviews_is_featured ON simple_reviews(is_featured);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_simple_reviews_vendor_rating ON simple_reviews(vendor_id, rating DESC);
CREATE INDEX IF NOT EXISTS idx_simple_reviews_featured_rating ON simple_reviews(is_featured, rating DESC) WHERE is_featured = true;

-- =============================================
-- USERS TABLE INDEXES
-- =============================================

-- Primary query indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- =============================================
-- SERVICE SEARCH INDEX TABLE INDEXES
-- =============================================

-- Primary query indexes
CREATE INDEX IF NOT EXISTS idx_service_search_status ON service_search_index(status);
CREATE INDEX IF NOT EXISTS idx_service_search_category ON service_search_index(category_name);
CREATE INDEX IF NOT EXISTS idx_service_search_vendor_city ON service_search_index(vendor_city);
CREATE INDEX IF NOT EXISTS idx_service_search_vendor_state ON service_search_index(vendor_state);
CREATE INDEX IF NOT EXISTS idx_service_search_rating ON service_search_index(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_service_search_last_indexed ON service_search_index(last_indexed_at DESC);

-- Search optimization for service search
CREATE INDEX IF NOT EXISTS idx_service_search_title_trgm ON service_search_index USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_service_search_tags_trgm ON service_search_index USING gin(tags_csv gin_trgm_ops);

-- Composite indexes for service search
CREATE INDEX IF NOT EXISTS idx_service_search_category_rating ON service_search_index(category_name, average_rating DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_service_search_city_state ON service_search_index(vendor_city, vendor_state);

-- =============================================
-- SERVICE PRICING TABLE INDEXES
-- =============================================

-- Primary query indexes
CREATE INDEX IF NOT EXISTS idx_service_pricing_service_id ON service_pricing(service_id);
CREATE INDEX IF NOT EXISTS idx_service_pricing_type ON service_pricing(pricing_type);
CREATE INDEX IF NOT EXISTS idx_service_pricing_base_price ON service_pricing(base_price);

-- =============================================
-- SERVICE PACKAGES TABLE INDEXES
-- =============================================

-- Primary query indexes
CREATE INDEX IF NOT EXISTS idx_service_packages_service_id ON service_packages(service_id);
CREATE INDEX IF NOT EXISTS idx_service_packages_type ON service_packages(package_type);
CREATE INDEX IF NOT EXISTS idx_service_packages_price ON service_packages(price);

-- =============================================
-- SERVICE IMAGES TABLE INDEXES
-- =============================================

-- Primary query indexes
CREATE INDEX IF NOT EXISTS idx_service_images_service_id ON service_images(service_id);
CREATE INDEX IF NOT EXISTS idx_service_images_is_primary ON service_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_service_images_order ON service_images(order_index);

-- =============================================
-- SERVICE AREAS TABLE INDEXES
-- =============================================

-- Primary query indexes
CREATE INDEX IF NOT EXISTS idx_service_areas_service_id ON service_areas(service_id);
CREATE INDEX IF NOT EXISTS idx_service_areas_city ON service_areas(city);
CREATE INDEX IF NOT EXISTS idx_service_areas_state ON service_areas(state);

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
ANALYZE event_inquiries;
ANALYZE quotations;
ANALYZE simple_reviews;
ANALYZE users;
ANALYZE service_search_index;
ANALYZE service_pricing;
ANALYZE service_packages;
ANALYZE service_images;
ANALYZE service_areas;

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
