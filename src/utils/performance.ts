// performance.ts - Performance monitoring utilities

export interface PerformanceMetrics {
  emojiCount: number;
  fps: number;
  memoryUsed?: number;
  renderTime?: number;
}

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring(): void {
    const measure = (): void => {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastTime;
      
      if (deltaTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / deltaTime);
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        this.notifyCallbacks();
      }
      
      this.frameCount++;
      requestAnimationFrame(measure);
    };
    
    requestAnimationFrame(measure);
  }

  private notifyCallbacks(): void {
    const metrics: PerformanceMetrics = {
      emojiCount: 0, // Will be set by component
      fps: this.fps,
    };
    
    // Add memory info if available
    interface PerformanceWithMemory extends Performance {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    }
    
    if ('memory' in performance && (performance as PerformanceWithMemory).memory) {
      const memoryInfo = (performance as PerformanceWithMemory).memory;
      if (memoryInfo) {
        metrics.memoryUsed = Math.round(memoryInfo.usedJSHeapSize / 1048576); // Convert to MB
      }
    }
    
    this.callbacks.forEach(callback => callback(metrics));
  }

  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  getCurrentFPS(): number {
    return this.fps;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility function to throttle function calls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>): void => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    if (timeSinceLastCall >= delay) {
      lastCall = now;
      func(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeoutId = null;
      }, delay - timeSinceLastCall);
    }
  };
}

// Utility function to debounce function calls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}