// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loadingScreen');
const scrollTopBtn = document.getElementById('scrollTop');
const themeToggle = document.getElementById('themeToggle');
const greeting = document.getElementById('greeting');
const bottomNavItems = document.querySelectorAll('.nav-item');

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
});

// ===== SCROLL TO TOP =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== THEME TOGGLE =====
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    
    const moon = themeToggle.querySelector('.fa-moon');
    const sun = themeToggle.querySelector('.fa-sun');
    
    if (document.body.classList.contains('light-theme')) {
        moon.style.opacity = '0';
        sun.style.opacity = '1';
        document.documentElement.style.setProperty('--background', '#f8fafc');
        document.documentElement.style.setProperty('--surface', '#ffffff');
        document.documentElement.style.setProperty('--text-primary', '#1e293b');
        document.documentElement.style.setProperty('--text-secondary', '#64748b');
    } else {
        moon.style.opacity = '1';
        sun.style.opacity = '0';
        document.documentElement.style.setProperty('--background', '#0f172a');
        document.documentElement.style.setProperty('--surface', '#1e293b');
        document.documentElement.style.setProperty('--text-primary', '#f1f5f9');
        document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
    }
});

// ===== DYNAMIC GREETING =====
function updateGreeting() {
    const hour = new Date().getHours();
    let message = '';
    
    if (hour < 12) message = 'Good Morning';
    else if (hour < 18) message = 'Good Afternoon';
    else message = 'Good Evening';
    
    greeting.textContent = message + ',';
}

updateGreeting();
setInterval(updateGreeting, 60000); // Update every minute

// ===== BOTTOM NAV ACTIVE STATE =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === `#${currentSection}`) {
            item.classList.add('active');
        } else if (href === '#home' && currentSection === '') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== ANIMATION ON SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.bot-card, .info-card, .action-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// ===== REAL-TIME STATS =====
function updateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        if (!stat.dataset.animated) {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    stat.dataset.animated = true;
                }
                stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
            }, 20);
        }
    });
}

setTimeout(updateStats, 2000);

// ===== COPY CONTACT INFO =====
document.querySelectorAll('.contact-info p').forEach(item => {
    item.addEventListener('click', function() {
        const text = this.textContent;
        navigator.clipboard.writeText(text)
            .then(() => {
                const original = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML = original;
                }, 2000);
            });
    });
});

// ===== SCROLLABLE BOTTOM NAVIGATION =====
function initScrollableNavigation() {
    const navContainer = document.querySelector('.nav-container');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    const categoryIndicator = document.getElementById('currentCategory');
    const navProgress = document.getElementById('navProgress');
    const categories = document.querySelectorAll('.nav-category');
    
    if (!navContainer || !scrollLeftBtn) return;
    
    const categoryWidth = 280; // Width of each category
    const scrollAmount = categoryWidth + 32; // Category width + gap
    
    // Calculate total scrollable width
    const totalWidth = categories.length * scrollAmount;
    let currentPosition = 0;
    let currentCategoryIndex = 0;
    
    // Update category indicator and progress
    function updateIndicator() {
        const categoryTitles = ['Main', 'Categories', 'More Tools', 'Development'];
        categoryIndicator.textContent = categoryTitles[currentCategoryIndex] || 'Main';
        
        // Update progress bar
        const progress = ((currentCategoryIndex + 1) / categories.length) * 100;
        navProgress.style.width = `${progress}%`;
        
        // Update active category
        categories.forEach((cat, index) => {
            if (index === currentCategoryIndex) {
                cat.style.opacity = '1';
                cat.style.transform = 'scale(1.02)';
                cat.style.borderColor = 'var(--primary)';
            } else {
                cat.style.opacity = '0.8';
                cat.style.transform = 'scale(1)';
                cat.style.borderColor = 'rgba(124, 58, 237, 0.2)';
            }
        });
    }
    
    // Scroll left function
    scrollLeftBtn.addEventListener('click', () => {
        if (currentCategoryIndex > 0) {
            currentCategoryIndex--;
            currentPosition += scrollAmount;
            navContainer.scrollTo({
                left: currentPosition,
                behavior: 'smooth'
            });
            updateIndicator();
        }
    });
    
    // Scroll right function
    scrollRightBtn.addEventListener('click', () => {
        if (currentCategoryIndex < categories.length - 1) {
            currentCategoryIndex++;
            currentPosition -= scrollAmount;
            navContainer.scrollTo({
                left: currentPosition,
                behavior: 'smooth'
            });
            updateIndicator();
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    navContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    navContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left - scroll right
            if (currentCategoryIndex < categories.length - 1) {
                currentCategoryIndex++;
                currentPosition -= scrollAmount;
                navContainer.scrollTo({
                    left: currentPosition,
                    behavior: 'smooth'
                });
                updateIndicator();
            }
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right - scroll left
            if (currentCategoryIndex > 0) {
                currentCategoryIndex--;
                currentPosition += scrollAmount;
                navContainer.scrollTo({
                    left: currentPosition,
                    behavior: 'smooth'
                });
                updateIndicator();
            }
        }
    }
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            scrollLeftBtn.click();
        } else if (e.key === 'ArrowRight') {
            scrollRightBtn.click();
        }
    });
    
    // Auto-hide scroll indicators when at edges
    function updateScrollIndicators() {
        scrollLeftBtn.style.opacity = currentCategoryIndex === 0 ? '0.3' : '0.8';
        scrollRightBtn.style.opacity = currentCategoryIndex === categories.length - 1 ? '0.3' : '0.8';
        
        scrollLeftBtn.style.cursor = currentCategoryIndex === 0 ? 'not-allowed' : 'pointer';
        scrollRightBtn.style.cursor = currentCategoryIndex === categories.length - 1 ? 'not-allowed' : 'pointer';
    }
    
    // Initialize
    updateIndicator();
    updateScrollIndicators();
    
    // Update indicators on scroll
    navContainer.addEventListener('scroll', () => {
        const scrollPos = Math.abs(navContainer.scrollLeft);
        currentCategoryIndex = Math.floor(scrollPos / scrollAmount);
        currentPosition = -scrollPos;
        updateIndicator();
        updateScrollIndicators();
    });
    
    // Add click handlers to all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.nav-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Store active page in localStorage
            const pageName = this.querySelector('span').textContent;
            localStorage.setItem('lastActivePage', pageName);
        });
    });
    
    // Restore last active page on load
    const lastActivePage = localStorage.getItem('lastActivePage');
    if (lastActivePage) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.querySelector('span').textContent === lastActivePage) {
                btn.classList.add('active');
            }
        });
    }
}

// ===== ENHANCED BOTTOM NAV ANIMATIONS =====
function addNavAnimations() {
    const navContainer = document.querySelector('.nav-container');
    
    // Add floating animation to buttons
    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
        btn.style.animationDelay = `${index * 0.1}s`;
        btn.classList.add('fade-in-up');
    });
    
    // Add parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const bottomNav = document.querySelector('.bottom-nav');
        
        if (bottomNav) {
            const opacity = 1 - (scrollY / 500);
            bottomNav.style.opacity = Math.max(opacity, 0.8);
            
            // Slight movement effect
            bottomNav.style.transform = `translateY(${scrollY * 0.02}px)`;
        }
    });
    
    // Hover effect for categories
    document.querySelectorAll('.nav-category').forEach(category => {
        category.addEventListener('mouseenter', () => {
            category.style.transform = 'translateY(-5px)';
            category.style.boxShadow = '0 10px 30px rgba(124, 58, 237, 0.3)';
        });
        
        category.addEventListener('mouseleave', () => {
            category.style.transform = 'translateY(0)';
            category.style.boxShadow = 'none';
        });
    });
}

// ===== UPDATE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Existing initialization...
    
    // Add new navigation functions
    initScrollableNavigation();
    addNavAnimations();
    
    // Add CSS animation classes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.5s ease forwards;
            opacity: 0;
        }
        
        /* Smooth transitions for nav */
        .nav-category {
            transition: all 0.3s ease;
        }
        
        .nav-btn {
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(style);
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to hero
    const heroTitle = document.querySelector('.hero-title');
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 500);
    
    // Update active nav on load
    updateActiveNav();
});