import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { PerformanceMonitor } from '@/lib/supabase-optimized';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      // Get performance statistics
      const cacheStats = cache.getStats();
      const queryStats = PerformanceMonitor.getStats();

      return NextResponse.json({
        success: true,
        data: {
          cache: cacheStats,
          queries: queryStats,
          timestamp: new Date().toISOString()
        }
      });
    }

    if (action === 'clear-cache') {
      // Clear cache
      cache.clear();
      return NextResponse.json({
        success: true,
        message: 'Cache cleared successfully'
      });
    }

    if (action === 'reset-stats') {
      // Reset performance statistics
      PerformanceMonitor.reset();
      return NextResponse.json({
        success: true,
        message: 'Performance statistics reset successfully'
      });
    }

    // Default: return all performance data
    const cacheStats = cache.getStats();
    const queryStats = PerformanceMonitor.getStats();

    return NextResponse.json({
      success: true,
      data: {
        cache: cacheStats,
        queries: queryStats,
        timestamp: new Date().toISOString(),
        actions: [
          '?action=stats - Get performance statistics',
          '?action=clear-cache - Clear cache',
          '?action=reset-stats - Reset performance statistics'
        ]
      }
    });

  } catch (error) {
    console.error('Performance monitoring error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
