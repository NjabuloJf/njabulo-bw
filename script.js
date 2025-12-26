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

// ===== BOTTOM NAV CLICK HANDLERS =====
bottomNavItems.forEach(item => {
    item.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
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