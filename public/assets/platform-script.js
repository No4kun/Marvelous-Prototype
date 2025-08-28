// Marvelous Learning Platform JavaScript

class MarvelousLearningPlatform {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupHeroAnimation();
        this.setupScrollEffects();
        this.setupCourseCards();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.startHeroCanvas();
    }

    // Navigation functionality
    setupNavigation() {
        const header = document.querySelector('.main-header');
        
        // Header scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        });

        // Active nav link highlighting
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    // Hero section animation
    setupHeroAnimation() {
        // Typewriter effect for hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            this.typewriterEffect(heroTitle);
        }

        // Animated counter for stats
        this.animateCounters();

        // Floating elements animation
        this.animateFloatingElements();
    }

    typewriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #667eea';
        
        let i = 0;
        const typeSpeed = 50;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, typeSpeed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 500);
            }
        }
        
        // Start typing after a short delay
        setTimeout(type, 500);
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
            const count = parseInt(counter.textContent);
            const inc = target / speed;

            if (count < target) {
                counter.textContent = Math.ceil(count + inc);
                setTimeout(() => animateCounter(counter), 1);
            } else {
                counter.textContent = target + '+';
            }
        };

        // Intersection Observer for counters
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    counter.setAttribute('data-target', counter.textContent);
                    counter.textContent = '0';
                    animateCounter(counter);
                    observer.unobserve(counter);
                }
            });
        });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateFloatingElements() {
        const formulas = document.querySelectorAll('.floating-formula');
        
        formulas.forEach((formula, index) => {
            // Random initial position
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            
            formula.style.left = randomX + '%';
            formula.style.top = randomY + '%';
            
            // Different animation delays
            formula.style.animationDelay = (index * 0.5) + 's';
        });
    }

    // Hero Canvas Animation
    startHeroCanvas() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 300;

        // Animated mathematical visualization
        this.animateHeroCanvas(ctx, canvas);
    }

    animateHeroCanvas(ctx, canvas) {
        let frame = 0;
        const particles = [];
        
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
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off walls
                if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
                if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

                // Draw particle
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

    // Scroll effects and animations
    setupScrollEffects() {
        // Intersection Observer for fade-in animations
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

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.course-card, .feature-card, .subject-section, .about-content'
        );
        
        animateElements.forEach(el => observer.observe(el));

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroParticles = document.querySelector('.hero-particles');
            
            if (heroParticles) {
                heroParticles.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    // Course card interactions
    setupCourseCards() {
        const courseCards = document.querySelectorAll('.course-card:not(.coming-soon)');
        
        courseCards.forEach(card => {
            const launchButton = card.querySelector('.launch-button');
            
            // Add click cursor and interactive states
            card.style.cursor = 'pointer';
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 20px 40px -5px rgba(0, 0, 0, 0.15)';
                
                if (launchButton && !launchButton.classList.contains('disabled')) {
                    launchButton.style.transform = 'scale(1.1)';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = '';
                
                if (launchButton && !launchButton.classList.contains('disabled')) {
                    launchButton.style.transform = 'scale(1)';
                }
            });

            // Launch button click (with event propagation stop)
            if (launchButton && !launchButton.classList.contains('disabled')) {
                launchButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.launchCourse(card);
                });
            }

            // Card click - main navigation
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.launchCourse(card);
            });

            // Keyboard navigation support
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `${card.querySelector('.card-title').textContent}講座を開く`);
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.launchCourse(card);
                }
            });
        });

        // Special effects for featured courses
        const featuredCards = document.querySelectorAll('.course-card.featured');
        featuredCards.forEach(card => {
            this.addShimmerEffect(card);
        });
        
        // Handle coming soon cards
        const comingSoonCards = document.querySelectorAll('.course-card.coming-soon');
        comingSoonCards.forEach(card => {
            card.style.cursor = 'not-allowed';
            card.setAttribute('aria-disabled', 'true');
            card.setAttribute('aria-label', '近日公開予定の講座');
            
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.showComingSoonMessage(card);
            });
        });
    }

    launchCourse(card) {
        const courseUrl = card.getAttribute('data-url');
        const courseId = card.getAttribute('data-course');
        const courseTitle = card.querySelector('.card-title').textContent;
        
        // Add launch animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'translateY(-4px)';
        }, 150);

        // Track course access
        if (window.MarvelousLearning && window.MarvelousLearning.analytics) {
            window.MarvelousLearning.analytics.trackCourseAccess(courseTitle);
        }

        // Navigate to course using data-url attribute
        setTimeout(() => {
            if (courseUrl) {
                // Show loading indicator
                this.showLoadingOverlay();
                
                // Navigate to the course page
                window.location.href = courseUrl;
            } else {
                // Fallback to title-based navigation (legacy support)
                if (courseTitle.includes('固有値') || courseTitle.includes('Eigenvalues')) {
                    window.location.href = 'eigenvalues-and-eigenvectors.html';
                } else if (courseTitle.includes('基底') || courseTitle.includes('Basis')) {
                    window.location.href = 'basis-transformation.html';
                } else if (courseTitle.includes('天体') || courseTitle.includes('Celestial')) {
                    window.location.href = 'celestial-mechanics.html';
                }
            }
        }, 300);
    }

    showLoadingOverlay() {
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <p>講座を読み込み中...</p>
            </div>
        `;
        
        // Add styles
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;
        
        document.body.appendChild(overlay);
        
        // Auto-remove after 3 seconds (fallback)
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 3000);
    }

    showComingSoonMessage(card) {
        const courseTitle = card.querySelector('.card-title').textContent;
        
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'coming-soon-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-clock"></i>
                <div class="toast-text">
                    <strong>${courseTitle}</strong>
                    <p>この講座は近日公開予定です。お楽しみに！</p>
                </div>
            </div>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 1rem;
            box-shadow: var(--shadow-xl);
            z-index: 1001;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Slide in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
        
        // Add shake effect to card
        card.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }

    addShimmerEffect(element) {
        const shimmer = document.createElement('div');
        shimmer.className = 'shimmer-effect';
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 3s infinite;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(shimmer);

        // Add shimmer animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(style);
    }

    // Smooth scrolling for navigation links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Utility functions
class PlatformUtils {
    static formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Performance optimizations
class PerformanceOptimizer {
    constructor() {
        this.setupLazyLoading();
        this.optimizeScrollEvents();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeScrollEvents() {
        // Use throttled scroll events for better performance
        const throttledScroll = PlatformUtils.throttle(() => {
            // Scroll-dependent operations
            this.updateScrollProgress();
        }, 16); // ~60fps

        window.addEventListener('scroll', throttledScroll);
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        // Update scroll progress indicator if exists
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    }
}

// Course data management
class CourseManager {
    constructor() {
        this.courses = {
            'eigenvalues': {
                title: 'Eigenvalues & Eigenvectors',
                file: 'eigenvalues-and-eigenvectors.html',
                status: 'available',
                progress: 0
            },
            'basis': {
                title: 'Basis Transformation',
                file: 'basis-transformation.html',
                status: 'available',
                progress: 0
            },
            'celestial': {
                title: 'Celestial Mechanics',
                file: 'celestial-mechanics.html',
                status: 'available',
                progress: 0
            }
        };
        
        this.loadProgress();
    }

    loadProgress() {
        // Load course progress from localStorage
        Object.keys(this.courses).forEach(courseId => {
            const savedProgress = localStorage.getItem(`course_progress_${courseId}`);
            if (savedProgress) {
                this.courses[courseId].progress = parseInt(savedProgress);
            }
        });
        
        this.updateProgressDisplay();
    }

    updateProgressDisplay() {
        Object.keys(this.courses).forEach(courseId => {
            const progressElement = document.querySelector(`[data-course="${courseId}"] .progress-value`);
            if (progressElement) {
                progressElement.textContent = `${this.courses[courseId].progress}% Complete`;
            }
        });
    }

    saveProgress(courseId, progress) {
        if (this.courses[courseId]) {
            this.courses[courseId].progress = progress;
            localStorage.setItem(`course_progress_${courseId}`, progress.toString());
            this.updateProgressDisplay();
        }
    }
}

// Analytics and tracking
class AnalyticsTracker {
    constructor() {
        this.sessionStart = Date.now();
        this.interactions = [];
    }

    trackInteraction(type, target, data = {}) {
        this.interactions.push({
            type,
            target,
            data,
            timestamp: Date.now()
        });
        
        // Send to analytics service (placeholder)
        console.log('Tracking:', { type, target, data });
    }

    trackCourseAccess(courseName) {
        this.trackInteraction('course_access', courseName);
    }

    trackTimeSpent() {
        return Date.now() - this.sessionStart;
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main platform
    const platform = new MarvelousLearningPlatform();
    
    // Initialize performance optimizations
    const optimizer = new PerformanceOptimizer();
    
    // Initialize course manager
    const courseManager = new CourseManager();
    
    // Initialize analytics
    const analytics = new AnalyticsTracker();
    
    // Make instances globally available
    window.MarvelousLearning = {
        platform,
        optimizer,
        courseManager,
        analytics,
        utils: PlatformUtils
    };

    // Track page load
    analytics.trackInteraction('page_load', 'homepage');
    
    console.log('🎓 Marvelous Learning Platform initialized successfully!');
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
