// Simple in-memory cache for API responses
// In production, consider using Redis or similar

interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 100; // Maximum number of items in cache

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void { // Default 5 minutes
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Generate cache key from request parameters
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return `${prefix}:${sortedParams}`;
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const cache = new SimpleCache();

// Cache configuration for different endpoints
export const CACHE_CONFIG = {
  VENDORS: {
    ttl: 5 * 60 * 1000, // 5 minutes
    keyPrefix: 'vendors'
  },
  EVENTS: {
    ttl: 10 * 60 * 1000, // 10 minutes
    keyPrefix: 'events'
  },
  STORIES: {
    ttl: 2 * 60 * 1000, // 2 minutes
    keyPrefix: 'stories'
  },
  VENDOR_DETAILS: {
    ttl: 15 * 60 * 1000, // 15 minutes
    keyPrefix: 'vendor_details'
  }
};

// Helper function to get cached data or fetch and cache
export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get(key);
  if (cached) {
    console.log(`Cache HIT for key: ${key}`);
    return cached;
  }

  console.log(`Cache MISS for key: ${key}`);
  
  // Fetch fresh data
  const data = await fetchFn();
  
  // Cache the result
  cache.set(key, data, ttl);
  
  return data;
}
