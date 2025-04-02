
/**
 * Performance monitoring utilities
 */

interface PerformanceMetric {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number | null;
  type: 'api' | 'render' | 'interaction' | 'resource';
  details?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private activeMetrics: Map<string, PerformanceMetric> = new Map();
  
  /**
   * Start timing a performance metric
   * @param id Unique identifier for the metric
   * @param type Type of performance metric
   * @param details Additional details
   * @returns The ID of the started metric
   */
  startTiming(id: string, type: PerformanceMetric['type'], details?: Record<string, any>): string {
    const metric: PerformanceMetric = {
      id,
      startTime: performance.now(),
      endTime: null,
      duration: null,
      type,
      details
    };
    
    this.activeMetrics.set(id, metric);
    console.log(`Performance monitoring: Started ${type} '${id}'`);
    return id;
  }
  
  /**
   * End timing a performance metric
   * @param id The ID of the metric to stop timing
   * @returns The duration of the metric in milliseconds, or null if the metric wasn't found
   */
  endTiming(id: string): number | null {
    const metric = this.activeMetrics.get(id);
    if (!metric) {
      console.warn(`Performance monitoring: No active metric found with id '${id}'`);
      return null;
    }
    
    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    
    this.metrics.push(metric);
    this.activeMetrics.delete(id);
    
    console.log(`Performance monitoring: Ended ${metric.type} '${id}' (${metric.duration.toFixed(2)}ms)`);
    return metric.duration;
  }
  
  /**
   * Get all collected metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
  
  /**
   * Clear all collected metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    console.log("Performance monitoring: Cleared all metrics");
  }
  
  /**
   * Record an API call performance metric
   * @param url The API URL
   * @param method The HTTP method
   * @param callback The API call to execute and measure
   * @returns The result of the callback
   */
  async measureApiCall<T>(url: string, method: string, callback: () => Promise<T>): Promise<T> {
    const id = `api-${method}-${url}-${Date.now()}`;
    this.startTiming(id, 'api', { url, method });
    
    try {
      const result = await callback();
      this.endTiming(id);
      return result;
    } catch (error) {
      this.endTiming(id);
      throw error;
    }
  }
}

// Export a singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for measuring component render performance
 * @param componentName The name of the component
 */
export const useRenderPerformance = (componentName: string): void => {
  // Import React hooks from the top level
  const { useEffect, useRef } = require('react');
  
  const metricId = useRef(`render-${componentName}-${Date.now()}`);
  
  useEffect(() => {
    // Start timing on mount
    performanceMonitor.startTiming(metricId.current, 'render', { component: componentName });
    
    return () => {
      // End timing on unmount
      performanceMonitor.endTiming(metricId.current);
    };
  }, [componentName]);
};
