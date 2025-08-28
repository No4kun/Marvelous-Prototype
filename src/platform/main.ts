// Main Platform Class - TypeScript Implementation

import type { 
  CourseMetadata, 
  AnalyticsEvent, 
  ToastMessage 
} from '../types/index.js';
import { PlatformUtils } from '../shared/utils.js';

export class MarvelousLearningPlatform {
  private courses: Map<string, CourseMetadata> = new Map();
  private analytics: AnalyticsEvent[] = [];
  private sessionStart: number = Date.now();

  constructor() {
    this.init();
  }

  private init(): void {
    this.setupNavigation();
    this.setupHeroAnimation();
    this.setupScrollEffects();
    this.setupCourseCards();
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.startHeroCanvas();
    this.initializeCourses();
  }

  private initializeCourses(): void {
    const courseConfigs: CourseMetadata[] = [
      {
        id: 'eigenvalues',
        title: '固有値・固有ベクトル',
        description: '線形変換の本質を理解し、データサイエンスの基盤を学ぶ',
        category: 'mathematics',
        difficulty: 'intermediate',
        estimatedTime: 45,
        featured: true,
        available: true
      },
      {
        id: 'basis-transformation',
        title: '基底変換',
        description: 'ベクトル空間の異なる表現と線形写像の深層理解',
        category: 'mathematics',
        difficulty: 'advanced',
        estimatedTime: 60,
        featured: false,
        available: true
      },
      {
        id: 'celestial-mechanics',
        title: '天体力学',
        description: 'ケプラーの法則と万有引力による宇宙の運動',
        category: 'physics',
        difficulty: 'intermediate',
        estimatedTime: 50,
        featured: true,
        available: true
      }
    ];

    courseConfigs.forEach(course => this.courses.set(course.id, course));
  }

  public setupNavigation(): void {
    const header = document.querySelector('.main-header') as HTMLElement;
    if (!header) return;
    
    const scrollHandler = PlatformUtils.throttle(() => {
      if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }
    }, 16);

    window.addEventListener('scroll', scrollHandler);
    this.highlightActiveNavLink();
  }

  private highlightActiveNavLink(): void {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    const scrollHandler = PlatformUtils.throttle(() => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id') || '';
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, 100);

    window.addEventListener('scroll', scrollHandler);
  }

  public setupMobileMenu(): void {
    const hamburger = document.querySelector('.hamburger-menu') as HTMLElement;
    const navMenu = document.querySelector('.nav-menu') as HTMLElement;
    
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  public setupHeroAnimation(): void {
    const heroTitle = document.querySelector('.hero-title') as HTMLElement;
    if (heroTitle) {
      this.typewriterEffect(heroTitle);
    }

    this.animateCounters();
    this.animateFloatingElements();
  }

  private typewriterEffect(element: HTMLElement): void {
    const text = element.textContent || '';
    element.textContent = '';
    element.style.borderRight = '2px solid #667eea';
    
    let i = 0;
    const typeSpeed = 50;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, typeSpeed);
      } else {
        setTimeout(() => {
          element.style.borderRight = 'none';
        }, 500);
      }
    };
    
    setTimeout(type, 500);
  }

  private animateCounters(): void {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter: Element) => {
      const target = parseInt((counter as HTMLElement).getAttribute('data-target') || counter.textContent || '0');
      const count = parseInt(counter.textContent || '0');
      const increment = target / 200;

      if (count < target) {
        counter.textContent = Math.ceil(count + increment).toString();
        setTimeout(() => animateCounter(counter), 1);
      } else {
        counter.textContent = target + '+';
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          (counter as HTMLElement).setAttribute('data-target', counter.textContent || '0');
          counter.textContent = '0';
          animateCounter(counter);
          observer.unobserve(counter);
        }
      });
    });

    counters.forEach(counter => observer.observe(counter));
  }

  private animateFloatingElements(): void {
    const formulas = document.querySelectorAll('.floating-formula');
    
    formulas.forEach((formula, index) => {
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      
      (formula as HTMLElement).style.left = randomX + '%';
      (formula as HTMLElement).style.top = randomY + '%';
      (formula as HTMLElement).style.animationDelay = (index * 0.5) + 's';
    });
  }

  public startHeroCanvas(): void {
    const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    this.animateHeroCanvas(ctx, canvas);
  }

  private animateHeroCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    let frame = 0;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];
    
    // Create particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 1,
        color: `hsl(${240 + Math.random() * 60}, 70%, 60%)`
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(102, 126, 234, ${1 - distance / 80})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw mathematical wave
      ctx.beginPath();
      ctx.strokeStyle = '#667eea';
      ctx.lineWidth = 2;
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin((x + frame) * 0.02) * 30;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      frame++;
      requestAnimationFrame(animate);
    };

    animate();
  }

  public setupScrollEffects(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
      '.course-card, .feature-card, .subject-section, .about-content'
    );
    
    animateElements.forEach(el => observer.observe(el));

    // Parallax effect
    const parallaxHandler = PlatformUtils.throttle(() => {
      const scrolled = window.pageYOffset;
      const heroParticles = document.querySelector('.hero-particles') as HTMLElement;
      
      if (heroParticles) {
        heroParticles.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    }, 16);

    window.addEventListener('scroll', parallaxHandler);
  }

  public setupCourseCards(): void {
    const courseCards = document.querySelectorAll('.course-card:not(.coming-soon)');
    
    courseCards.forEach(card => {
      const cardElement = card as HTMLElement;
      const launchButton = card.querySelector('.launch-button') as HTMLElement;
      
      cardElement.style.cursor = 'pointer';
      
      cardElement.addEventListener('mouseenter', () => {
        cardElement.style.transform = 'translateY(-8px)';
        cardElement.style.boxShadow = '0 20px 40px -5px rgba(0, 0, 0, 0.15)';
        
        if (launchButton && !launchButton.classList.contains('disabled')) {
          launchButton.style.transform = 'scale(1.1)';
        }
      });

      cardElement.addEventListener('mouseleave', () => {
        cardElement.style.transform = 'translateY(-4px)';
        cardElement.style.boxShadow = '';
        
        if (launchButton && !launchButton.classList.contains('disabled')) {
          launchButton.style.transform = 'scale(1)';
        }
      });

      if (launchButton && !launchButton.classList.contains('disabled')) {
        launchButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.launchCourse(cardElement);
        });
      }

      cardElement.addEventListener('click', (e) => {
        e.preventDefault();
        this.launchCourse(cardElement);
      });

      // Keyboard support
      cardElement.setAttribute('tabindex', '0');
      cardElement.setAttribute('role', 'button');
      const title = cardElement.querySelector('.card-title')?.textContent || '';
      cardElement.setAttribute('aria-label', `${title}講座を開く`);
      
      cardElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.launchCourse(cardElement);
        }
      });
    });

    this.setupComingSoonCards();
  }

  private setupComingSoonCards(): void {
    const comingSoonCards = document.querySelectorAll('.course-card.coming-soon');
    
    comingSoonCards.forEach(card => {
      const cardElement = card as HTMLElement;
      cardElement.style.cursor = 'not-allowed';
      cardElement.setAttribute('aria-disabled', 'true');
      cardElement.setAttribute('aria-label', '近日公開予定の講座');
      
      cardElement.addEventListener('click', (e) => {
        e.preventDefault();
        this.showComingSoonMessage(cardElement);
      });
    });
  }

  public launchCourse(card: HTMLElement): void {
    const courseUrl = card.getAttribute('data-url');
    const courseTitle = card.querySelector('.card-title')?.textContent || '';
    
    // Animation
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.style.transform = 'translateY(-4px)';
    }, 150);

    // Analytics
    this.trackInteraction('course_access', courseTitle);

    // Navigation
    setTimeout(() => {
      if (courseUrl) {
        this.showLoadingOverlay();
        window.location.href = courseUrl;
      } else {
        // Fallback navigation
        const urlMap: Record<string, string> = {
          '固有値': 'eigenvalues-and-eigenvectors.html',
          '基底': 'basis-transformation.html',
          '天体': 'celestial-mechanics.html'
        };
        
        const url = Object.entries(urlMap).find(([key]) => 
          courseTitle.includes(key)
        )?.[1];
        
        if (url) {
          this.showLoadingOverlay();
          window.location.href = url;
        }
      }
    }, 300);
  }

  private showLoadingOverlay(): void {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <p>講座を読み込み中...</p>
      </div>
    `;
    
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '9999',
      backdropFilter: 'blur(5px)'
    });
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 3000);
  }

  private showComingSoonMessage(card: HTMLElement): void {
    const courseTitle = card.querySelector('.card-title')?.textContent || '';
    
    const toast: ToastMessage = {
      type: 'info',
      title: courseTitle,
      message: 'この講座は近日公開予定です。お楽しみに！',
      duration: 3000
    };
    
    PlatformUtils.showToast(toast);
    
    // Shake animation
    card.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      card.style.animation = '';
    }, 500);
  }

  public setupSmoothScrolling(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href') || '');
        
        if (target) {
          PlatformUtils.scrollToElement(target as HTMLElement, 20);
        }
      });
    });
  }

  public trackInteraction(type: string, target: string, data?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      type: type as any,
      target,
      data,
      timestamp: Date.now()
    };
    
    this.analytics.push(event);
    console.log('Analytics:', event);
  }

  public getSessionTime(): number {
    return Date.now() - this.sessionStart;
  }

  public getCourseMetadata(courseId: string): CourseMetadata | undefined {
    return this.courses.get(courseId);
  }

  public getAllCourses(): CourseMetadata[] {
    return Array.from(this.courses.values());
  }
}
