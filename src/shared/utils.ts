// Shared utilities for the Marvelous Learning Platform

import type { ToastMessage, AnimationOptions } from '../types/index.js';

export class PlatformUtils {
  /**
   * Format numbers for display
   */
  static formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Debounce function calls
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);
    };
  }

  /**
   * Throttle function calls
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function (this: any, ...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Generate unique IDs
   */
  static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Deep clone objects
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Check if element is in viewport
   */
  static isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Smooth scroll to element
   */
  static scrollToElement(element: HTMLElement, offset: number = 0): void {
    const headerHeight = document.querySelector('.main-header')?.clientHeight || 0;
    const targetPosition = element.offsetTop - headerHeight - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Format time duration
   */
  static formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}分`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}時間${remainingMinutes > 0 ? remainingMinutes + '分' : ''}`;
  }

  /**
   * Save data to localStorage with error handling
   */
  static saveToStorage(key: string, data: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Load data from localStorage with error handling
   */
  static loadFromStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  /**
   * Create and show toast messages
   */
  static showToast(message: ToastMessage): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${message.type}`;
    
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">
          ${this.getToastIcon(message.type)}
        </div>
        <div class="toast-text">
          <strong>${message.title}</strong>
          <p>${message.message}</p>
        </div>
        <button class="toast-close" aria-label="閉じる">×</button>
      </div>
    `;

    // Styling
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      zIndex: '1001',
      maxWidth: '400px',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });

    document.body.appendChild(toast);

    // Animation
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Close functionality
    const closeBtn = toast.querySelector('.toast-close') as HTMLButtonElement;
    closeBtn?.addEventListener('click', () => {
      this.removeToast(toast);
    });

    // Auto remove
    const duration = message.duration || 5000;
    setTimeout(() => {
      this.removeToast(toast);
    }, duration);
  }

  private static getToastIcon(type: string): string {
    const icons = {
      success: '<i class="fas fa-check-circle" style="color: #48bb78;"></i>',
      warning: '<i class="fas fa-exclamation-triangle" style="color: #ed8936;"></i>',
      error: '<i class="fas fa-exclamation-circle" style="color: #f56565;"></i>',
      info: '<i class="fas fa-info-circle" style="color: #667eea;"></i>'
    };
    return icons[type as keyof typeof icons] || icons.info;
  }

  private static removeToast(toast: HTMLElement): void {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
}

export class AnimationUtils {
  /**
   * Easing functions
   */
  static easing = {
    linear: (t: number): number => t,
    easeIn: (t: number): number => t * t,
    easeOut: (t: number): number => t * (2 - t),
    easeInOut: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
  };

  /**
   * Animate a value between start and end
   */
  static animate(
    start: number,
    end: number,
    options: AnimationOptions,
    callback: (value: number) => void
  ): void {
    const startTime = Date.now();
    const { duration, easing, loop } = options;

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = this.easing[easing](progress);
      const value = start + (end - start) * easedProgress;

      callback(value);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (loop) {
        setTimeout(() => {
          this.animate(start, end, options, callback);
        }, 100);
      }
    };

    if (options.autoStart) {
      requestAnimationFrame(step);
    }
  }

  /**
   * Create fade in animation
   */
  static fadeIn(element: HTMLElement, duration: number = 300): void {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;

    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  }

  /**
   * Create fade out animation
   */
  static fadeOut(element: HTMLElement, duration: number = 300): Promise<void> {
    return new Promise((resolve) => {
      element.style.transition = `opacity ${duration}ms ease`;
      element.style.opacity = '0';

      setTimeout(() => {
        resolve();
      }, duration);
    });
  }
}

export class MathUtils {
  /**
   * Convert degrees to radians
   */
  static degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convert radians to degrees
   */
  static radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * Clamp value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Linear interpolation
   */
  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  /**
   * Map value from one range to another
   */
  static map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

  /**
   * Distance between two points
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
}
