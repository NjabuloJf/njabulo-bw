// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Initialize theme
    initTheme();
    
    // Initialize splash screen
    initSplashScreen();
    
    // Initialize category navigation
    initCategoryNavigation();
    
    // Initialize code carousel
    initCodeCarousel();
    
    // Initialize animations
    initAnimations();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize tooltips
    initTooltips();
}

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Load saved theme or use system preference
    const savedTheme = localStorage.getItem('theme') || 
                      (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
    
    // Theme toggle event
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            themeToggle.checked = newTheme === 'dark';
        }
    });
}

// Splash Screen
function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const dashboard = document.querySelector('.dashboard-container');
    
    // Show splash screen for 5 seconds
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        
        // Show dashboard after splash screen fades out
        setTimeout(() => {
            splashScreen.style.display = 'none';
            dashboard.style.display = 'block';
            
            // Trigger initial animations
            setTimeout(() => {
                dashboard.classList.add('fade-in');
                document.querySelectorAll('.section-header, .developer-card, .stat-card')
                    .forEach(el => el.classList.add('slide-up'));
            }, 100);
            
        }, 500);
    }, 5000);
}

// Category Navigation
function initCategoryNavigation() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');
    
    // Set up category switching
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected category
            categoryContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === categoryId) {
                    setTimeout(() => {
                        content.classList.add('active');
                    }, 10);
                }
            });
            
            // Smooth scroll to category
            document.querySelector('.categories-container').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Dispatch category change event
            document.dispatchEvent(new CustomEvent('categoryChange', {
                detail: { category: categoryId }
            }));
        });
    });
    
    // Auto-rotate categories every 10 seconds
    let currentCategoryIndex = 0;
    const categoryIds = Array.from(categoryBtns).map(btn => btn.getAttribute('data-category'));
    
    function rotateCategories() {
        currentCategoryIndex = (currentCategoryIndex + 1) % categoryIds.length;
        const nextCategory = categoryIds[currentCategoryIndex];
        
        // Find and click the corresponding button
        const nextBtn = document.querySelector(`.category-btn[data-category="${nextCategory}"]`);
        if (nextBtn) {
            nextBtn.click();
        }
    }
    
    // Start auto-rotation if not hovering over categories
    let categoryRotation = setInterval(rotateCategories, 10000);
    
    const categoriesContainer = document.querySelector('.categories-section');
    categoriesContainer.addEventListener('mouseenter', () => {
        clearInterval(categoryRotation);
    });
    
    categoriesContainer.addEventListener('mouseleave', () => {
        categoryRotation = setInterval(rotateCategories, 10000);
    });
}

// Code Carousel
function initCodeCarousel() {
    const codeSamples = document.querySelectorAll('.code-sample');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.carousel-controls .prev-btn');
    const nextBtn = document.querySelector('.carousel-controls .next-btn');
    
    let currentIndex = 0;
    
    function showSample(index) {
        // Update active sample
        codeSamples.forEach(sample => sample.classList.remove('active'));
        codeSamples[index].classList.add('active');
        
        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        // Highlight code
        if (window.hljs) {
            document.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
        
        currentIndex = index;
    }
    
    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSample(index));
    });
    
    // Previous button
    prevBtn.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = codeSamples.length - 1;
        showSample(newIndex);
    });
    
    // Next button
    nextBtn.addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= codeSamples.length) newIndex = 0;
        showSample(newIndex);
    });
    
    // Auto-rotate carousel
    let carouselInterval = setInterval(() => {
        let newIndex = currentIndex + 1;
        if (newIndex >= codeSamples.length) newIndex = 0;
        showSample(newIndex);
    }, 8000);
    
    // Pause on hover
    const carousel = document.querySelector('.code-carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
            let newIndex = currentIndex + 1;
            if (newIndex >= codeSamples.length) newIndex = 0;
            showSample(newIndex);
        }, 8000);
    });
    
    // Initialize with first sample
    showSample(0);
}

// Animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.project-card, .stat-card, .category-content').forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS class for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.opacity = '1';
            
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (this.tooltip && this.tooltip.parentNode) {
                        this.tooltip.parentNode.removeChild(this.tooltip);
                    }
                }, 300);
            }
        });
    });
}

// Project Card Interactions
function initProjectCardInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectTitle = this.querySelector('h4').textContent;
            const projectDescription = this.querySelector('p').textContent;
            
            // Show project details modal (to be implemented)
            showProjectModal({
                title: projectTitle,
                description: projectDescription,
                // Add more project data as needed
            });
        });
    });
}

// Show Project Modal (placeholder)
function showProjectModal(projectData) {
    console.log('Project details:', projectData);
    // Implement modal display logic here
    // You could use a library or create a custom modal
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'exclamation-circle'
    };
    return icons[type] || 'info-circle';
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--bg-card);
        border-left: 4px solid var(--primary-color);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 1000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 350px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-info {
        border-left-color: var(--info-color);
    }
    
    .notification-success {
        border-left-color: var(--accent-color);
    }
    
    .notification-warning {
        border-left-color: var(--warning-color);
    }
    
    .notification-error {
        border-left-color: var(--danger-color);
    }
    
    .notification i {
        font-size: 1.25rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-sm);
    }
    
    .notification-close:hover {
        background: var(--bg-hover);
    }
`;
document.head.appendChild(notificationStyles);

// Performance Optimization
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

// Debounce function
function debounce(func, wait) {
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

// Initialize on window load
window.addEventListener('load', function() {
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to Fredi AI Developer Dashboard! 🚀', 'success');
    }, 6000);
    
    // Initialize lazy loading for images
    initLazyLoading();
});

// Lazy Loading for Images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Escape key closes modals/tooltips
    if (e.key === 'Escape') {
        // Close any open modals or tooltips
        document.querySelectorAll('.modal.show, .tooltip').forEach(el => {
            el.remove();
        });
    }
    
    // Arrow keys for carousel navigation
    if (e.key === 'ArrowLeft') {
        document.querySelector('.carousel-controls .prev-btn').click();
    } else if (e.key === 'ArrowRight') {
        document.querySelector('.carousel-controls .next-btn').click();
    }
});

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Export functions for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApp,
        showNotification,
        throttle,
        debounce
    };
}
