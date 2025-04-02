
/**
 * Load balancing utility for distributing API requests
 */

// Simulated API endpoints (in a real scenario, these would be actual different server endpoints)
const API_ENDPOINTS = [
  'primary',
  'secondary',
  'tertiary'
];

// Simple round-robin load balancer
let currentEndpointIndex = 0;

/**
 * Get the next endpoint in the round-robin sequence
 */
export const getNextEndpoint = (): string => {
  const endpoint = API_ENDPOINTS[currentEndpointIndex];
  currentEndpointIndex = (currentEndpointIndex + 1) % API_ENDPOINTS.length;
  return endpoint;
};

/**
 * Wraps the fetch API to distribute requests across different endpoints
 * @param url The API endpoint path
 * @param options Fetch options
 */
export const loadBalancedFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  // In a real implementation, you would prefix the URL with different server domains
  // For simulation purposes, we're just logging which endpoint would be used
  const endpoint = getNextEndpoint();
  console.log(`Using endpoint: ${endpoint} for request to ${url}`);
  
  try {
    // Add exponential backoff and retry logic for failed requests
    return await fetchWithRetry(url, options);
  } catch (error) {
    console.error(`Request to ${url} failed:`, error);
    throw error;
  }
};

/**
 * Implements exponential backoff for failed requests
 */
const fetchWithRetry = async (
  url: string, 
  options?: RequestInit, 
  retries = 3, 
  backoff = 300
): Promise<Response> => {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    // Wait for backoff duration before retrying
    await new Promise(resolve => setTimeout(resolve, backoff));
    
    // Retry with exponential backoff
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
};
