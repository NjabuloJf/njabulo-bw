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

// ===== SCROLLABLE BOTTOM NAVIGATION (No Categories) =====
function initScrollableNavigation() {
    const navContainer = document.querySelector('.nav-container');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    const scrollProgressThumb = document.getElementById('scrollProgressThumb');
    const currentPageEl = document.getElementById('currentPage');
    const totalPagesEl = document.getElementById('totalPages');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    if (!navContainer || !scrollLeftBtn) return;
    
    // Calculate number of pages based on visible buttons
    function calculatePages() {
        const containerWidth = navContainer.clientWidth;
        const buttonWidth = 80 + 16; // button width + margin
        const buttonsPerPage = Math.floor(containerWidth / buttonWidth);
        const totalButtons = navButtons.length;
        return Math.ceil(totalButtons / buttonsPerPage);
    }
    
    let totalPages = calculatePages();
    let currentPage = 1;
    
    // Update total pages display
    totalPagesEl.textContent = totalPages;
    
    // Update scroll progress and page indicator
    function updateScrollIndicators() {
        const scrollLeft = navContainer.scrollLeft;
        const maxScroll = navContainer.scrollWidth - navContainer.clientWidth;
        const scrollPercent = (scrollLeft / maxScroll) * 100;
        
        // Update progress thumb
        scrollProgressThumb.style.width = `${scrollPercent}%`;
        
        // Calculate current page based on scroll position
        if (maxScroll > 0) {
            currentPage = Math.round((scrollLeft / maxScroll) * (totalPages - 1)) + 1;
            currentPage = Math.min(Math.max(currentPage, 1), totalPages);
            currentPageEl.textContent = currentPage;
        }
        
        // Update scroll buttons visibility
        scrollLeftBtn.style.opacity = scrollLeft <= 10 ? '0.3' : '0.9';
        scrollRightBtn.style.opacity = scrollLeft >= maxScroll - 10 ? '0.3' : '0.9';
        
        scrollLeftBtn.style.cursor = scrollLeft <= 10 ? 'not-allowed' : 'pointer';
        scrollRightBtn.style.cursor = scrollLeft >= maxScroll - 10 ? 'not-allowed' : 'pointer';
    }
    
    // Scroll left function
    scrollLeftBtn.addEventListener('click', () => {
        const containerWidth = navContainer.clientWidth;
        const scrollAmount = containerWidth * 0.8; // Scroll 80% of container width
        
        navContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
        
        updateScrollIndicators();
    });
    
    // Scroll right function
    scrollRightBtn.addEventListener('click', () => {
        const containerWidth = navContainer.clientWidth;
        const scrollAmount = containerWidth * 0.8; // Scroll 80% of container width
        
        navContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        updateScrollIndicators();
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
        const swipeThreshold = 30;
        const containerWidth = navContainer.clientWidth;
        const scrollAmount = containerWidth * 0.8;
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left - scroll right
            navContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right - scroll left
            navContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
        
        setTimeout(updateScrollIndicators, 300);
    }
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            scrollLeftBtn.click();
        } else if (e.key === 'ArrowRight') {
            scrollRightBtn.click();
        }
    });
    
    // Recalculate on resize
    window.addEventListener('resize', () => {
        totalPages = calculatePages();
        totalPagesEl.textContent = totalPages;
        updateScrollIndicators();
    });
    
    // Active button click handler
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Don't prevent default for actual navigation
            if (!this.classList.contains('active')) {
                // Store active page
                localStorage.setItem('activeNavBtn', this.getAttribute('href'));
            }
        });
    });
    
    // Restore active button on load
    const activeNavBtn = localStorage.getItem('activeNavBtn');
    if (activeNavBtn) {
        navButtons.forEach(btn => {
            if (btn.getAttribute('href') === activeNavBtn) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Initialize
    updateScrollIndicators();
    
    // Update indicators on scroll
    navContainer.addEventListener('scroll', updateScrollIndicators);
    
    // Auto-scroll to show active button on load
    setTimeout(() => {
        const activeBtn = document.querySelector('.nav-btn.active');
        if (activeBtn) {
            activeBtn.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
    }, 1000);
}

// ===== ADD NAV BUTTON ANIMATIONS =====
function addNavButtonEffects() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    // Add staggered entrance animation
    navButtons.forEach((btn, index) => {
        btn.style.animationDelay = `${index * 0.05}s`;
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            btn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
    
    // Add hover sound effect (optional)
    navButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('active')) {
                btn.style.transform = 'translateY(0) scale(1)';
            }
        });
        
        btn.addEventListener('touchstart', () => {
            btn.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('touchend', () => {
            setTimeout(() => {
                if (!btn.classList.contains('active')) {
                    btn.style.transform = 'scale(1)';
                }
            }, 150);
        });
    });
}

// ===== ENHANCED NAVIGATION FEATURES =====
function enhanceNavigation() {
    const navContainer = document.querySelector('.nav-container');
    
    // Add mouse wheel horizontal scrolling
    navContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        navContainer.scrollLeft += e.deltaY;
    });
    
    // Add active button highlight on scroll into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const btn = entry.target;
                navButtons.forEach(b => b.classList.remove('view-active'));
                btn.classList.add('view-active');
            }
        });
    }, {
        root: navContainer,
        threshold: 0.5
    });
    
    // Observe all buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        observer.observe(btn);
    });
    
    // Add CSS for view-active state
    const style = document.createElement('style');
    style.textContent = `
        .nav-btn.view-active {
            box-shadow: 0 0 15px rgba(124, 58, 237, 0.5) !important;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(124, 58, 237, 0); }
            100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
        }
        
        .nav-btn.active {
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);
}

// ===== INITIALIZE NAVIGATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Existing initialization...
    
    // Initialize new navigation
    initScrollableNavigation();
    addNavButtonEffects();
    enhanceNavigation();
    
    // Add active state to current page button
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const href = btn.getAttribute('href');
        if (href && (currentPath.includes(href) || href === currentPath)) {
            btn.classList.add('active');
        }
    });
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