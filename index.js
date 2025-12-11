// Main JavaScript file for Developer Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initSplashScreen();
    initProjectsCarousel();
    initCodeCarousel();
    initAnimations();
    initAutoDetectTheme();
});

// Auto-detect theme from browser
function initAutoDetectTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(isDark) {
        const root = document.documentElement;
        
        if (isDark) {
            root.style.setProperty('--primary-color', '#5a6ee1');
            root.style.setProperty('--secondary-color', '#4a0db4');
            root.style.setProperty('--accent-color', '#ff2d95');
            root.style.setProperty('--bg-color', '#121212');
            root.style.setProperty('--card-bg', '#1e1e1e');
            root.style.setProperty('--text-color', '#e0e0e0');
            root.style.setProperty('--text-secondary', '#a0a0a0');
            root.style.setProperty('--border-color', '#2d2d2d');
            root.style.setProperty('--shadow', '0 4px 6px rgba(0, 0, 0, 0.3)');
            root.style.setProperty('--gradient', 'linear-gradient(135deg, #5a6ee1 0%, #4a0db4 100%)');
        } else {
            root.style.setProperty('--primary-color', '#4361ee');
            root.style.setProperty('--secondary-color', '#3a0ca3');
            root.style.setProperty('--accent-color', '#f72585');
            root.style.setProperty('--bg-color', '#f8f9fa');
            root.style.setProperty('--card-bg', '#ffffff');
            root.style.setProperty('--text-color', '#212529');
            root.style.setProperty('--text-secondary', '#6c757d');
            root.style.setProperty('--border-color', '#e9ecef');
            root.style.setProperty('--shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
            root.style.setProperty('--gradient', 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)');
        }
    }
    
    // Set initial theme
    setTheme(prefersDarkScheme.matches);
    
    // Listen for theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        setTheme(e.matches);
    });
}

// Splash Screen
function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    
    // Remove splash screen after 5 seconds
    setTimeout(() => {
        splashScreen.style.display = 'none';
        document.querySelector('.welcome-container').style.opacity = '1';
    }, 5000);
}

// Projects Carousel
function initProjectsCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const projectCards = document.querySelectorAll('.project-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const totalProjects = projectCards.length;
    let currentIndex = 0;
    let autoSlideInterval;
    
    function updateCarousel() {
        const cardWidth = projectCards[0].offsetWidth;
        const translateX = -currentIndex * cardWidth;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update active states
        projectCards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalProjects;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalProjects) % totalProjects;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    // Button events
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Indicator events
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            goToSlide(index);
        });
    });
    
    // Auto slide every 5 seconds
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Pause auto-slide on hover
    const carousel = document.querySelector('.projects-carousel');
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    
    // Initialize
    updateCarousel();
    startAutoSlide();
}

// Code Carousel
function initCodeCarousel() {
    const snippets = document.querySelectorAll('.code-snippet');
    const navButtons = document.querySelectorAll('.nav-btn');
    let currentIndex = 0;
    let autoCodeInterval;

    function showSnippet(index) {
        snippets.forEach(snippet => snippet.classList.remove('active'));
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        snippets[index].classList.add('active');
        navButtons[index].classList.add('active');
        currentIndex = index;
    }

    navButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            showSnippet(index);
            resetAutoCodeSlide();
        });
    });

    // Auto-rotate code carousel every 4 seconds
    function startAutoCodeSlide() {
        autoCodeInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % snippets.length;
            showSnippet(currentIndex);
        }, 4000);
    }

    function resetAutoCodeSlide() {
        clearInterval(autoCodeInterval);
        startAutoCodeSlide();
    }

    // Initialize
    showSnippet(0);
    startAutoCodeSlide();

    // Animated background effect
    const floatingCode = document.querySelector('.floating-code');
    setInterval(() => {
        if (floatingCode) {
            floatingCode.style.transform = `translate(-50%, calc(-50% + ${Math.sin(Date.now() / 2000) * 10}px))`;
        }
    }, 50);
}

// Animations on Scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    document.querySelectorAll('.project-card, .feature-card, .tech-item').forEach(el => {
        observer.observe(el);
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideUp 0.6s ease forwards;
        opacity: 0;
        transform: translateY(30px);
    }
    
    @keyframes slideUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
