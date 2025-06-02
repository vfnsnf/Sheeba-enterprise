/*=============== WEBSITE FUNCTIONALITY ===============*/

// ===== GLOBAL VARIABLES =====
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');
const scrollTop = document.getElementById('scroll-top');
const sections = document.querySelectorAll('section[id]');

// ===== CACHE MANAGEMENT =====
class CacheManager {
    constructor() {
        this.cacheName = 'sheebaEnterprise_v1.0';
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    }

    // Set cache with expiry
    setCache(key, data) {
        const cacheData = {
            data: data,
            timestamp: Date.now(),
            expiry: this.cacheExpiry
        };
        try {
            localStorage.setItem(`${this.cacheName}_${key}`, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Cache storage failed:', error);
        }
    }

    // Get cache if not expired
    getCache(key) {
        try {
            const cached = localStorage.getItem(`${this.cacheName}_${key}`);
            if (!cached) return null;

            const cacheData = JSON.parse(cached);
            const now = Date.now();

            if (now - cacheData.timestamp > cacheData.expiry) {
                this.removeCache(key);
                return null;
            }

            return cacheData.data;
        } catch (error) {
            console.warn('Cache retrieval failed:', error);
            return null;
        }
    }

    // Remove specific cache
    removeCache(key) {
        try {
            localStorage.removeItem(`${this.cacheName}_${key}`);
        } catch (error) {
            console.warn('Cache removal failed:', error);
        }
    }

    // Clear all cache
    clearAllCache() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.cacheName)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Cache clearing failed:', error);
        }
    }
}

const cacheManager = new CacheManager();

// ===== MOBILE NAVIGATION =====
class MobileNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Show menu
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                this.showMenu();
            });
        }

        // Hide menu
        if (navClose) {
            navClose.addEventListener('click', () => {
                this.hideMenu();
            });
        }

        // Hide menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hideMenu();
            });
        });

        // Hide menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                this.hideMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideMenu();
            }
        });
    }

    showMenu() {
        navMenu.classList.add('show-menu');
        document.body.style.overflow = 'hidden';
    }

    hideMenu() {
        navMenu.classList.remove('show-menu');
        document.body.style.overflow = '';
    }
}

// ===== SCROLL EFFECTS =====
class ScrollEffects {
    constructor() {
        this.init();
    }

    init() {
        this.bindScrollEvents();
        this.updateActiveSection();
    }

    bindScrollEvents() {
        window.addEventListener('scroll', () => {
            this.handleHeaderScroll();
            this.handleScrollTop();
            this.updateActiveSection();
        });

        // Scroll to top functionality
        if (scrollTop) {
            scrollTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    handleHeaderScroll() {
        if (window.scrollY >= 100) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }
    }

    handleScrollTop() {
        if (window.scrollY >= 400) {
            scrollTop.classList.add('show');
        } else {
            scrollTop.classList.remove('show');
        }
    }

    updateActiveSection() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav__menu a[href*=${sectionId}]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                correspondingLink?.classList.add('active-link');
            } else {
                correspondingLink?.classList.remove('active-link');
            }
        });
    }
}

// ===== ANIMATIONS =====
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.initAOS();
        this.animateCounters();
        this.initParallax();
        this.initTypewriter();
    }

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true,
                mirror: false,
                offset: 100,
                delay: 0,
                anchorPlacement: 'top-bottom'
            });

            // Refresh AOS on window resize
            window.addEventListener('resize', () => {
                AOS.refresh();
            });
        }
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        const observerOptions = {
            threshold: 0.7,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }

    initParallax() {
        const parallaxElements = document.querySelectorAll('.hero__floating .floating-element');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.2;
                element.style.transform = `translateY(${rate * speed}px)`;
            });
        });
    }

    initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid';
            
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    element.style.borderRight = 'none';
                }
            }, 100);
        });
    }
}

// ===== PRODUCT FILTERING =====
class ProductFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter__btn');
        this.productCards = document.querySelectorAll('[data-category]');
        this.init();
    }

    init() {
        this.bindEvents();
        this.cacheProducts();
    }

    bindEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.filterProducts(filter);
                this.updateActiveFilter(e.target);
            });
        });
    }

    filterProducts(filter) {
        this.productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });

        // Cache the current filter
        cacheManager.setCache('currentFilter', filter);
    }

    updateActiveFilter(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('filter__btn--active');
        });
        activeButton.classList.add('filter__btn--active');
    }

    cacheProducts() {
        const products = Array.from(this.productCards).map(card => ({
            category: card.getAttribute('data-category'),
            html: card.outerHTML
        }));
        cacheManager.setCache('products', products);
    }

    loadCachedFilter() {
        const cachedFilter = cacheManager.getCache('currentFilter');
        if (cachedFilter) {
            this.filterProducts(cachedFilter);
            const activeButton = document.querySelector(`[data-filter="${cachedFilter}"]`);
            if (activeButton) {
                this.updateActiveFilter(activeButton);
            }
        }
    }
}

// ===== FORM HANDLING =====
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadFormData();
    }

    bindEvents() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(form);
            });

            // Auto-save form data
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.saveFormData(form);
                });
            });
        });
    }

    handleSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        this.showLoadingState(form);

        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage(form);
            this.clearFormData(form);
            form.reset();
        }, 2000);

        // Cache form submission
        cacheManager.setCache('lastSubmission', {
            timestamp: Date.now(),
            data: data
        });
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = '#e74c3c';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    showLoadingState(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
    }

    showSuccessMessage(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitButton.style.background = '#27ae60';
            
            setTimeout(() => {
                submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                submitButton.style.background = '';
            }, 3000);
        }
    }

    saveFormData(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const formId = form.id || 'default-form';
        cacheManager.setCache(`formData_${formId}`, data);
    }

    loadFormData() {
        this.forms.forEach(form => {
            const formId = form.id || 'default-form';
            const savedData = cacheManager.getCache(`formData_${formId}`);
            
            if (savedData) {
                Object.keys(savedData).forEach(key => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field && savedData[key]) {
                        field.value = savedData[key];
                    }
                });
            }
        });
    }

    clearFormData(form) {
        const formId = form.id || 'default-form';
        cacheManager.removeCache(`formData_${formId}`);
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.optimizeScrollEvents();
        this.enableServiceWorker();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/images/hero-bg.jpg'
           // '/images/'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.includes('.css') ? 'style' : 'image';
            document.head.appendChild(link);
        });
    }

    optimizeScrollEvents() {
        let ticking = false;

        const optimizedScroll = () => {
            // Scroll event logic here
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(optimizedScroll);
                ticking = true;
            }
        });
    }

    enableServiceWorker() {
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
    }
}

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }
}

// ===== SEARCH FUNCTIONALITY =====
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchData = [];
        this.init();
    }

    init() {
        if (!this.searchInput) return;
        
        this.loadSearchData();
        this.bindEvents();
    }

    bindEvents() {
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                this.performSearch(query);
            } else {
                this.clearResults();
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
                this.clearResults();
            }
        });
    }

    loadSearchData() {
        // Load searchable content
        const searchableElements = document.querySelectorAll('[data-searchable]');
        this.searchData = Array.from(searchableElements).map(element => ({
            title: element.dataset.title || element.textContent.substring(0, 50),
            content: element.textContent,
            url: element.dataset.url || '#',
            type: element.dataset.type || 'content'
        }));

        // Cache search data
        cacheManager.setCache('searchData', this.searchData);
    }

    performSearch(query) {
        const results = this.searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase())
        );

        this.displayResults(results, query);
    }

    displayResults(results, query) {
        if (!this.searchResults) return;

        this.searchResults.innerHTML = '';
        
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        } else {
            results.slice(0, 5).forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.className = 'search-result-item';
                resultElement.innerHTML = `
                    <h4>${this.highlightText(result.title, query)}</h4>
                    <p>${this.highlightText(result.content.substring(0, 100), query)}...</p>
                `;
                resultElement.addEventListener('click', () => {
                    window.location.href = result.url;
                });
                this.searchResults.appendChild(resultElement);
            });
        }

        this.searchResults.style.display = 'block';
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    clearResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
        }
    }
}

// ===== NEWSLETTER MANAGER =====
class NewsletterManager {
    constructor() {
        this.newsletterForms = document.querySelectorAll('.footer__newsletter');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubscription(form);
            });
        });
    }

    handleSubscription(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (!this.isValidEmail(email)) {
            this.showMessage(form, 'Please enter a valid email address', 'error');
            return;
        }

        // Check if already subscribed
        const subscribers = cacheManager.getCache('subscribers') || [];
        if (subscribers.includes(email)) {
            this.showMessage(form, 'You are already subscribed!', 'info');
            return;
        }

        // Add to subscribers
        subscribers.push(email);
        cacheManager.setCache('subscribers', subscribers);

        this.showMessage(form, 'Successfully subscribed to our newsletter!', 'success');
        form.reset();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(form, message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `newsletter-message newsletter-message--${type}`;
        messageElement.textContent = message;
        
        form.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}

// ===== ANALYTICS TRACKER =====
class AnalyticsTracker {
    constructor() {
        this.events = [];
        this.init();
    }

    init() {
        this.trackPageView();
        this.bindEvents();
        this.startSession();
    }

    bindEvents() {
        // Track button clicks
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.trackEvent('button_click', {
                    button_text: e.target.textContent.trim(),
                    button_class: e.target.className
                });
            });
        });

        // Track form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                this.trackEvent('form_submit', {
                    form_id: form.id || 'unknown'
                });
            });
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.trackEvent('scroll_depth', { percent: maxScroll });
                }
            }
        });
    }

    trackPageView() {
        this.trackEvent('page_view', {
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer
        });
    }

    trackEvent(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                url: window.location.href,
                user_agent: navigator.userAgent
            }
        };

        this.events.push(event);
        
        // Cache events
        cacheManager.setCache('analytics_events', this.events);
        
        console.log('Event tracked:', event);
    }

    startSession() {
        const sessionId = Date.now().toString();
        this.trackEvent('session_start', { session_id: sessionId });
        
        // Track session end on page unload
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', { session_id: sessionId });
        });
    }
}

// ===== MAIN INITIALIZATION =====
class SheebaEnterpriseApp {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize core components
            new MobileNavigation();
            new ScrollEffects();
            new AnimationController();
            new FormHandler();
            new PerformanceOptimizer();
            new ThemeManager();
            new NewsletterManager();
            new AnalyticsTracker();

            // Initialize product filter only on products page
            if (document.querySelector('.filter__btn')) {
                const productFilter = new ProductFilter();
                productFilter.loadCachedFilter();
            }

            // Initialize search only if search elements exist
            if (document.getElementById('search-input')) {
                new SearchManager();
            }

            console.log('Sheeba Enterprise website initialized successfully');
            
        } catch (error) {
            console.error('Error initializing website:', error);
        }
    }
}

// ===== UTILITY FUNCTIONS =====
const utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
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
    },

    // Format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format date
    formatDate(date, options = {}) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        }).format(new Date(date));
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    
    // Track error for analytics
    if (window.analyticsTracker) {
        window.analyticsTracker.trackEvent('javascript_error', {
            message: event.error.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }
});

// ===== INITIALIZE APPLICATION =====
const app = new SheebaEnterpriseApp();

// ===== EXPORT FOR GLOBAL ACCESS =====
window.SheebaEnterprise = {
    app,
    cacheManager,
    utils
};

// ===== HERO SECTION FUNCTIONALITY =====
class HeroSection {
  constructor() {
    this.heroSection = document.querySelector('.hero-section');
    this.heroContent = document.querySelector('.hero-content');
    this.heroVisual = document.querySelector('.hero-visual');
    this.particles = document.querySelector('.hero-particles');
    this.floatElements = document.querySelectorAll('.float-element');
    
    this.init();
  }
  
  init() {
    this.setupParallaxEffect();
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupIntersectionObserver();
  }
  
  setupParallaxEffect() {
    // Parallax effect for background particles
    window.addEventListener('scroll', () => {
      if (!this.particles) return;
      
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      
      this.particles.style.transform = `translateY(${rate}px)`;
    });
  }
  
  setupScrollAnimations() {
    // Smooth scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-cta[href^="#"]');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  setupHoverEffects() {
    // Enhanced hover effects for CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-cta');
    
    ctaButtons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px) scale(1.05)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
      });
    });
    
    // Floating elements interaction
    this.floatElements.forEach((element, index) => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.2) rotate(360deg)';
        element.style.transition = 'all 0.3s ease';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  }
  
  setupIntersectionObserver() {
    // Trigger animations when hero section comes into view
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerAnimations();
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    if (this.heroSection) {
      observer.observe(this.heroSection);
    }
  }
  
  triggerAnimations() {
    // Add animation classes for enhanced effects
    const animatedElements = [
      '.hero-content',
      '.hero-visual',
      '.hero-badge',
      '.hero-title',
      '.hero-tagline',
      '.hero-stats',
      '.hero-actions',
      '.hero-scroll-indicator'
    ];
    
    animatedElements.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (element) {
        setTimeout(() => {
          element.classList.add('animate-in');
        }, index * 100);
      }
    });
  }
  
  // Counter animation for stats
  animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const target = parseInt(stat.textContent);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          stat.textContent = target + '+';
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current) + '+';
        }
      }, 16);
    });
  }
}

// ===== HERO UTILITIES =====
const HeroUtils = {
  // Smooth reveal animation
  revealOnScroll() {
    const reveals = document.querySelectorAll('.hero-content > *');
    
    reveals.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 200);
    });
  },
  
  // Dynamic background adjustment based on time
  adjustBackgroundByTime() {
    const hour = new Date().getHours();
    const heroSection = document.querySelector('.hero-section');
    
    if (hour >= 6 && hour < 12) {
      // Morning
      heroSection.style.filter = 'brightness(1.1) contrast(1.05)';
    } else if (hour >= 12 && hour < 18) {
      // Afternoon
      heroSection.style.filter = 'brightness(1) contrast(1)';
    } else {
      // Evening/Night
      heroSection.style.filter = 'brightness(0.9) contrast(1.1)';
    }
  },
  
  // Responsive image loading Hero Image
  loadOptimizedImages() {
    const heroImage = document.querySelector('.hero-image');
    if (!heroImage) return;
    
    const isMobile = window.innerWidth <= 768;
    const imageUrl = isMobile 
      ? 'images/hero-image/hero-bg.webp'
      : 'images/hero-image/hero-bg.webp';
    
    heroImage.src = imageUrl;
  }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize hero section
  const heroSection = new HeroSection();
  
  // Apply utilities
  HeroUtils.adjustBackgroundByTime();
  HeroUtils.loadOptimizedImages();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    HeroUtils.loadOptimizedImages();
  });
  
  // Trigger counter animation when stats come into view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroSection.animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  });
  
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events for better performance
function throttle(func, limit) {
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

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
  // Parallax and other scroll-based animations
}, 16));
