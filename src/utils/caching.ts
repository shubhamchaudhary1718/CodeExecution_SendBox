/**
 * Simple in-memory cache utility
 */

interface CacheItem {
  value: any;
  expiry: number;
}

class Cache {
  private cache: Map<string, CacheItem> = new Map();
  
  /**
   * Set a value in the cache with an expiry time
   * @param key The cache key
   * @param value The value to cache
   * @param ttlSeconds Time to live in seconds (default: 5 minutes)
   */
  set(key: string, value: any, ttlSeconds = 300): void {
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiry });
    
    // Log cache setting for debugging
    console.log(`Cache: set ${key} (expires in ${ttlSeconds}s)`);
  }
  
  /**
   * Get a value from the cache
   * @param key The cache key
   * @returns The cached value or null if not found or expired
   */
  get(key: string): any | null {
    const item = this.cache.get(key);
    
    // Return null if item doesn't exist
    if (!item) {
      console.log(`Cache: miss for ${key}`);
      return null;
    }
    
    // Return null if item is expired
    if (Date.now() > item.expiry) {
      console.log(`Cache: expired for ${key}`);
      this.cache.delete(key);
      return null;
    }
    
    console.log(`Cache: hit for ${key}`);
    return item.value;
  }
  
  /**
   * Remove an item from the cache
   * @param key The cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
    console.log(`Cache: deleted ${key}`);
  }
  
  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
    console.log("Cache: cleared all items");
  }
  
  /**
   * Get the current size of the cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Export a singleton instance
export const cache = new Cache();

/**
 * Wraps the fetch API with caching capabilities
 * @param url The URL to fetch
 * @param options Fetch options
 * @param ttlSeconds Cache TTL in seconds
 */
export const cachedFetch = async (
  url: string, 
  options?: RequestInit, 
  ttlSeconds = 300
): Promise<any> => {
  const cacheKey = `${url}-${JSON.stringify(options?.body || '')}`;
  
  // Check if we have a cached response
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise, fetch and cache the response
  const response = await fetch(url, options);
  const data = await response.json();
  
  // Only cache successful responses
  if (response.ok) {
    cache.set(cacheKey, data, ttlSeconds);
  }
  
  return data;
};
