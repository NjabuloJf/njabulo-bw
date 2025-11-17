// Fredi AI Dashboard Functionality
class FrediDashboard {
    constructor() {
        this.init();
    }

    init() {
        // Check authentication
        this.checkAuth();
        
        // Initialize components
        this.initScrollProgress();
        this.initScrollToTop();
        this.initThemeToggle();
        this.initRealTimeStats();
        this.initCalendar();
        this.initSmoothScroll();
        this.initAnimations();
        
        // Update time every second
        setInterval(() => this.updateRealTimeStats(), 1000);
    }

    checkAuth() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser && window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }

    // Scroll progress indicator
    initScrollProgress() {
        const scrollProgress = document.getElementById('scrollProgress');
        
        if (scrollProgress) {
            window.addEventListener('scroll', () => {
                const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = (window.scrollY / windowHeight) * 100;
                scrollProgress.style.width = `${scrolled}%`;
            });
        }
    }

    // Scroll to top functionality
    initScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        if (scrollToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            });
            
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Theme toggle functionality
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle ? themeToggle.querySelector('i') : null;
        
        if (themeToggle && icon) {
            // Check for saved theme preference
            const savedTheme = localStorage.getItem('theme') || 'dark';
            if (savedTheme === 'light') {
                document.body.classList.add('light-mode');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
            
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-mode');
                
                if (document.body.classList.contains('light-mode')) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                    localStorage.setItem('theme', 'light');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                    localStorage.setItem('theme', 'dark');
                }
            });
        }
    }

    // Real-time statistics
    initRealTimeStats() {
        this.updateRealTimeStats();
    }

    updateRealTimeStats() {
        // Update online users (simulated)
        const onlineUsers = document.getElementById('onlineUsers');
        if (onlineUsers) {
            const baseUsers = 2847;
            const randomChange = Math.floor(Math.random() * 21) - 10; // -10 to +10
            onlineUsers.textContent = (baseUsers + randomChange).toLocaleString();
        }
        
        // Update response time (simulated)
        const responseTime = document.getElementById('responseTime');
        if (responseTime) {
            const baseTime = 98;
            const timeChange = Math.floor(Math.random() * 6) - 2; // -2 to +3
            responseTime.textContent = (baseTime + timeChange) + 'ms';
        }
        
        // Update datetime in footer
        const now = new Date();
        const options = { 
            timeZone: 'Africa/Dar_es_Salaam',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit'
        };
        const dateTimeString = now.toLocaleString('en-US', options);
        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom) {
            footerBottom.innerHTML = 
                `&copy; 2024 Fredi AI. All rights reserved. | ${dateTimeString} EAT | Powered by Innovation`;
        }
    }

    // Calendar functionality
    initCalendar() {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        
        const monthYearElement = document.getElementById('month-year');
        const daysElement = document.getElementById('days');
        const prevMonthButton = document.getElementById('prev-month');
        const nextMonthButton = document.getElementById('next-month');
        const todayButton = document.getElementById('today');
        
        if (monthYearElement && daysElement) {
            const renderCalendar = (month, year) => {
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const daysInMonth = lastDay.getDate();
                const startingDay = firstDay.getDay();
                
                const monthNames = ["January", "February", "March", "April", "May", "June",
                                    "July", "August", "September", "October", "November", "December"];
                
                monthYearElement.textContent = `${monthNames[month]} ${year}`;
                
                daysElement.innerHTML = '';
                
                // Add empty cells for days before the first day of the month
                for (let i = 0; i < startingDay; i++) {
                    const dayElement = document.createElement('div');
                    dayElement.classList.add('day', 'other-month');
                    const prevMonthLastDay = new Date(year, month, 0).getDate();
                    dayElement.textContent = prevMonthLastDay - startingDay + i + 1;
                    daysElement.appendChild(dayElement);
                }
                
                // Add days of the current month
                const today = new Date();
                for (let i = 1; i <= daysInMonth; i++) {
                    const dayElement = document.createElement('div');
                    dayElement.classList.add('day');
                    dayElement.textContent = i;
                    
                    if (month === today.getMonth() && year === today.getFullYear() && i === today.getDate()) {
                        dayElement.classList.add('today');
                    }
                    
                    daysElement.appendChild(dayElement);
                }
                
                // Calculate how many cells we've added so far
                const totalCells = startingDay + daysInMonth;
                // Add empty cells for days after the last day of the month if needed
                if (totalCells < 42) { // 6 rows x 7 days
                    const nextMonthDays = 42 - totalCells;
                    for (let i = 1; i <= nextMonthDays; i++) {
                        const dayElement = document.createElement('div');
                        dayElement.classList.add('day', 'other-month');
                        dayElement.textContent = i;
                        daysElement.appendChild(dayElement);
                    }
                }
            };
            
            if (prevMonthButton) {
                prevMonthButton.addEventListener('click', function() {
                    currentMonth--;
                    if (currentMonth < 0) {
                        currentMonth = 11;
                        currentYear--;
                    }
                    renderCalendar(currentMonth, currentYear);
                });
            }
            
            if (nextMonthButton) {
                nextMonthButton.addEventListener('click', function() {
                    currentMonth++;
                    if (currentMonth > 11) {
                        currentMonth = 0;
                        currentYear++;
                    }
                    renderCalendar(currentMonth, currentYear);
                });
            }
            
            if (todayButton) {
                todayButton.addEventListener('click', function() {
                    currentDate = new Date();
                    currentMonth = currentDate.getMonth();
                    currentYear = currentDate.getFullYear();
                    renderCalendar(currentMonth, currentYear);
                });
            }
            
            // Initial render
            renderCalendar(currentMonth, currentYear);
        }
    }

    // Smooth scroll for navigation
    initSmoothScroll() {
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
    }

    // Animation on scroll
    initAnimations() {
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

        // Observe all fade-in-up elements
        document.querySelectorAll('.fade-in-up').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('profile.html') ||
        window.location.pathname.includes('payment.html')) {
        window.frediDashboard = new FrediDashboard();
    }
});

// Add this to your existing dashboard.js file

class QuickSettings {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('frediSettings')) || {};
        this.init();
    }

    init() {
        this.initQuickSettings();
        this.loadQuickSettings();
    }

    initQuickSettings() {
        const toggle = document.getElementById('quickSettingsToggle');
        const panel = document.getElementById('quickSettingsPanel');
        const closeBtn = document.getElementById('closeSettings');

        if (toggle && panel) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                panel.classList.toggle('show');
            });

            closeBtn.addEventListener('click', () => {
                panel.classList.remove('show');
            });

            // Close panel when clicking outside
            document.addEventListener('click', (e) => {
                if (!panel.contains(e.target) && !toggle.contains(e.target)) {
                    panel.classList.remove('show');
                }
            });

            // Initialize toggle switches
            this.initToggleSwitches();
        }
    }

    initToggleSwitches() {
        const toggles = document.querySelectorAll('#quickSettingsPanel .toggle-switch input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.handleQuickSettingChange(e.target.id, e.target.checked);
            });
        });

        // Reset settings button
        const resetBtn = document.getElementById('resetSettings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetQuickSettings();
            });
        }
    }

    loadQuickSettings() {
        const settings = this.settings;
        
        // Dark mode
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = settings.appearance?.theme === 'dark';
        }

        // Notifications
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.checked = settings.notifications?.push !== false;
        }

        // Auto updates
        const autoUpdateToggle = document.getElementById('autoUpdateToggle');
        if (autoUpdateToggle) {
            autoUpdateToggle.checked = settings.system?.autoUpdates !== false;
        }

        // Sound effects
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.checked = settings.notifications?.sound !== false;
        }
    }

    handleQuickSettingChange(settingId, value) {
        switch(settingId) {
            case 'darkModeToggle':
                this.toggleDarkMode(value);
                break;
            case 'notificationsToggle':
                this.toggleNotifications(value);
                break;
            case 'autoUpdateToggle':
                this.toggleAutoUpdates(value);
                break;
            case 'soundToggle':
                this.toggleSoundEffects(value);
                break;
        }
        
        this.saveQuickSettings();
    }

    toggleDarkMode(enabled) {
        const theme = enabled ? 'dark' : 'light';
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (this.settings.appearance) {
            this.settings.appearance.theme = theme;
        }
    }

    toggleNotifications(enabled) {
        if (this.settings.notifications) {
            this.settings.notifications.push = enabled;
        }
        
        if (enabled) {
            this.requestNotificationPermission();
        }
    }

    toggleAutoUpdates(enabled) {
        if (this.settings.system) {
            this.settings.system.autoUpdates = enabled;
        }
    }

    toggleSoundEffects(enabled) {
        if (this.settings.notifications) {
            this.settings.notifications.sound = enabled;
        }
    }

    requestNotificationPermission() {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }

    saveQuickSettings() {
        localStorage.setItem('frediSettings', JSON.stringify(this.settings));
    }

    resetQuickSettings() {
        if (confirm('Reset quick settings to default?')) {
            // Reset to default values
            document.getElementById('darkModeToggle').checked = true;
            document.getElementById('notificationsToggle').checked = true;
            document.getElementById('autoUpdateToggle').checked = false;
            document.getElementById('soundToggle').checked = true;
            
            // Apply changes
            this.toggleDarkMode(true);
            this.toggleNotifications(true);
            this.toggleAutoUpdates(false);
            this.toggleSoundEffects(true);
            
            this.showMessage('Quick settings reset', 'success');
        }
    }

    showMessage(message, type) {
        if (window.frediAuth && window.frediAuth.showMessage) {
            window.frediAuth.showMessage(message, type);
        }
    }
}

// Initialize quick settings when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        window.quickSettings = new QuickSettings();
    }
});
