// Enhanced Hero Interactions
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for floating elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-leaf');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.hero__stat-number');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            const numericValue = parseInt(target.replace(/\D/g, ''));
            const suffix = target.replace(/\d/g, '');
            
            let current = 0;
            const increment = numericValue / 50;
            
            const updateCounter = () => {
                if (current < numericValue) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }

    // Trigger counter animation when hero is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });

    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) {
        observer.observe(heroStats);
    }

    // Button hover effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Dynamic background color change on scroll
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        
        if (scrollPercent < 0.1) {
            hero.style.background = `linear-gradient(135deg, 
                hsl(${120 + scrollPercent * 20}, 70%, 95%) 0%, 
                hsl(${120 + scrollPercent * 15}, 60%, 90%) 50%, 
                hsl(${120 + scrollPercent * 10}, 50%, 85%) 100%)`;
        }
    });
});
