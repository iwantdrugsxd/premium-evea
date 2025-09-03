-- Clear all vendors from the vendors table
-- This will remove all vendor onboarding entries

-- First, clear the vendor_portfolio table (due to foreign key constraints)
DELETE FROM vendor_portfolio;

-- Then clear the vendors table
DELETE FROM vendors;

-- Reset the auto-increment sequence
ALTER SEQUENCE vendors_id_seq RESTART WITH 1;

-- Verify the tables are empty
SELECT 'vendors' as table_name, COUNT(*) as count FROM vendors
UNION ALL
SELECT 'vendor_portfolio' as table_name, COUNT(*) as count FROM vendor_portfolio;

-- Success message
SELECT 'All vendor entries have been cleared successfully!' as status;
