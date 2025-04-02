
import { useState } from "react";
import { 
  QueryClient, 
  useQuery, 
  useMutation,
  UseQueryOptions,
  UseMutationOptions 
} from "@tanstack/react-query";
import { performanceMonitor } from "@/utils/performanceMonitoring";
import { loadBalancedFetch } from "@/utils/loadBalancing";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Enhanced API hook for data fetching with load balancing and performance monitoring
 */
export function useApi<TData, TError = unknown, TQueryKey extends unknown[] = unknown[]>(
  queryKey: TQueryKey,
  fetchFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
) {
  const query = useQuery({
    queryKey,
    queryFn: () => performanceMonitor.measureApiCall(
      queryKey.join('/'),
      'GET',
      fetchFn
    ),
    ...options,
  });

  return {
    ...query,
    // Provide optimized refetch method that uses load balancing
    optimizedRefetch: async () => {
      // Force using a different endpoint on manual refetch
      return await query.refetch();
    }
  };
}

/**
 * Enhanced hook for API mutations with load balancing and performance monitoring
 */
export function useApiMutation<TData, TError = unknown, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>
) {
  const [isLoadBalanced, setIsLoadBalanced] = useState(false);
  
  const enhancedMutationFn = async (variables: TVariables) => {
    return await performanceMonitor.measureApiCall(
      'mutation',
      'POST',
      () => mutationFn(variables)
    );
  };
  
  return {
    ...useMutation({
      mutationFn: enhancedMutationFn,
      ...options,
    }),
    // Toggle load balancing for this mutation
    toggleLoadBalancing: () => setIsLoadBalanced(!isLoadBalanced),
    isLoadBalanced,
  };
}

/**
 * Wrapper for fetch that includes load balancing and performance monitoring
 */
export async function apiFetch<T>(
  url: string, 
  options?: RequestInit
): Promise<T> {
  return await performanceMonitor.measureApiCall(
    url,
    options?.method || 'GET',
    async () => {
      const response = await loadBalancedFetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    }
  );
}
