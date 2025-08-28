// Common types for the Marvelous Learning Platform

export interface CourseProgress {
  section: number;
  progress: number;
  timestamp: number;
  completed: boolean;
}

export interface CourseMetadata {
  id: string;
  title: string;
  description: string;
  category: 'mathematics' | 'physics';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  featured: boolean;
  available: boolean;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  progress: Record<string, CourseProgress>;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'ja' | 'en';
  animationSpeed: 'slow' | 'normal' | 'fast';
  autoSave: boolean;
}

export interface Section {
  id: number;
  title: string;
  content: string;
  interactive?: boolean;
  completed: boolean;
}

export interface Course {
  metadata: CourseMetadata;
  sections: Section[];
  currentSection: number;
  progress: CourseProgress;
}

export interface AnalyticsEvent {
  type: 'page_load' | 'course_access' | 'section_complete' | 'interaction';
  target: string;
  data?: Record<string, any> | undefined;
  timestamp: number;
}

export interface ToastMessage {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Canvas and visualization types
export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

export interface Vector2D extends Point2D {
  magnitude?: number;
  angle?: number;
}

export interface Vector3D extends Point3D {
  magnitude?: number;
}

export interface Matrix2x2 {
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface Matrix3x3 {
  elements: number[][];
}

export interface AnimationOptions {
  duration: number;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  loop: boolean;
  autoStart: boolean;
}

export interface CanvasVisualization {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  animate: boolean;
  frame: number;
}

// MathJax integration
declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      startup: {
        promise: Promise<void>;
      };
    };
    MarvelousLearning: {
      platform: any;
      courseManager: any;
      analytics: any;
      utils: any;
    };
  }
}

export {};
