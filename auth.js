// Advanced Authentication System for Fredi AI

class AuthenticationSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.systemStatus = {
            activeUsers: 0,
            serverLoad: 0,
            securityLevel: 'high',
            responseTime: 0
        };
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupRealTimeUpdates();
        this.autoDetectTheme();
        this.setupSplashScreen();
        this.loadRecentActivities();
        this.monitorSystemStatus();
        this.checkExistingSession();
    }
    
    // Auto-detect browser theme
    autoDetectTheme() {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        const setTheme = (isDark) => {
            const root = document.documentElement;
            
            if (isDark) {
                // Dark theme colors
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
                // Light theme colors
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
        };
        
        // Set initial theme
        setTheme(prefersDarkScheme.matches);
        
        // Listen for theme changes
        prefersDarkScheme.addEventListener('change', (e) => {
            setTheme(e.matches);
        });
    }
    
    setupSplashScreen() {
        const splashScreen = document.getElementById('splash-screen');
        const authContainer = document.querySelector('.auth-main-container');
        
        setTimeout(() => {
            if (splashScreen) {
                splashScreen.style.display = 'none';
            }
            if (authContainer) {
                authContainer.style.opacity = '1';
            }
        }, 2000); // Reduced to 2 seconds for auth page
    }
    
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target));
        });
        
        // Form switching links
        document.querySelectorAll('.switch-to-signup').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToTab('signup');
            });
        });
        
        document.querySelectorAll('.switch-to-login').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToTab('login');
            });
        });
        
        // Forgot password
        const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToTab('forgot-password');
            });
        }
        
        // Form submissions
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }
        
        // Password toggle
        this.setupPasswordToggles();
        
        // Real-time validation
        this.setupRealTimeValidation();
        
        // Quick login buttons
        const quickLoginDev = document.getElementById('quickLoginDev');
        if (quickLoginDev) {
            quickLoginDev.addEventListener('click', () => this.quickLogin('developer'));
        }
        
        const quickLoginAdmin = document.getElementById('quickLoginAdmin');
        if (quickLoginAdmin) {
            quickLoginAdmin.addEventListener('click', () => this.quickLogin('admin'));
        }
        
        // Brain verification
        const verifyGameBtn = document.getElementById('verifyGameBtn');
        if (verifyGameBtn) {
            verifyGameBtn.addEventListener('click', () => this.handleVerification());
        }
        
        const resetGameBtn = document.getElementById('resetGameBtn');
        if (resetGameBtn) {
            resetGameBtn.addEventListener('click', () => this.resetVerificationGame());
        }
        
        // Continue to dashboard
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.redirectToDashboard());
        }
    }
    
    switchTab(clickedTab) {
        const tabs = document.querySelectorAll('.auth-tab');
        const tabName = clickedTab.getAttribute('data-tab');
        
        // Update active tab
        tabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');
        
        // Show corresponding form
        document.querySelectorAll('.auth-form-container').forEach(container => {
            container.classList.remove('active');
        });
        
        if (tabName === 'forgot-password') {
            document.getElementById('forgotPasswordContainer').classList.add('active');
        } else {
            document.getElementById(`${tabName}FormContainer`).classList.add('active');
        }
    }
    
    switchToTab(tabName) {
        const tab = document.querySelector(`.auth-tab[data-tab="${tabName}"]`);
        if (tab) {
            this.switchTab(tab);
        }
    }
    
    setupPasswordToggles() {
        const toggleButtons = document.querySelectorAll('.password-toggle');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
    
    setupRealTimeValidation() {
        // Username validation with debounce
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            let timeout;
            usernameInput.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.validateUsername(usernameInput.value);
                }, 500);
            });
        }
        
        // Email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                this.validateEmail(emailInput.value);
            });
        }
        
        // Password strength
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.checkPasswordStrength(passwordInput.value);
            });
        }
        
        // Confirm password
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                const password = document.getElementById('password')?.value;
                this.validateConfirmPassword(password, confirmPasswordInput.value);
            });
        }
    }
    
    async validateUsername(username) {
        const feedback = document.getElementById('usernameFeedback');
        const input = document.getElementById('username');
        
        if (!username) {
            this.showFeedback(feedback, 'error', 'Username is required');
            return;
        }
        
        if (username.length < 3) {
            this.showFeedback(feedback, 'error', 'Username must be at least 3 characters');
            return;
        }
        
        // Show checking state
        this.showChecking(feedback, 'username');
        
        // Simulate API call
        setTimeout(() => {
            const isAvailable = !['admin', 'root', 'system'].includes(username.toLowerCase());
            
            if (isAvailable) {
                this.showFeedback(feedback, 'valid', 'Username available');
                input.classList.add('valid');
                input.classList.remove('error');
            } else {
                this.showFeedback(feedback, 'error', 'Username not available');
                input.classList.add('error');
                input.classList.remove('valid');
            }
        }, 1000);
    }
    
    validateEmail(email) {
        const feedback = document.getElementById('emailFeedback');
        const input = document.getElementById('email');
        
        if (!email) {
            this.showFeedback(feedback, 'error', 'Email is required');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.showFeedback(feedback, 'error', 'Please enter a valid email');
            input.classList.add('error');
            input.classList.remove('valid');
            return;
        }
        
        // Show checking state
        this.showChecking(feedback, 'email');
        
        // Simulate email verification
        setTimeout(() => {
            const isValid = !email.includes('fake') && !email.includes('test');
            
            if (isValid) {
                this.showFeedback(feedback, 'valid', 'Email valid');
                input.classList.add('valid');
                input.classList.remove('error');
            } else {
                this.showFeedback(feedback, 'error', 'Email domain not supported');
                input.classList.add('error');
                input.classList.remove('valid');
            }
        }, 800);
    }
    
    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthValue = document.getElementById('strengthValue');
        const requirements = {
            length: document.getElementById('reqLength'),
            uppercase: document.getElementById('reqUppercase'),
            lowercase: document.getElementById('reqLowercase'),
            number: document.getElementById('reqNumber'),
            special: document.getElementById('reqSpecial')
        };
        
        let score = 0;
        let strength = 'none';
        
        // Check requirements
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        // Update requirement indicators
        this.updateRequirement(requirements.length, hasLength);
        this.updateRequirement(requirements.uppercase, hasUppercase);
        this.updateRequirement(requirements.lowercase, hasLowercase);
        this.updateRequirement(requirements.number, hasNumber);
        this.updateRequirement(requirements.special, hasSpecial);
        
        // Calculate score
        if (hasLength) score += 20;
        if (hasUppercase) score += 20;
        if (hasLowercase) score += 20;
        if (hasNumber) score += 20;
        if (hasSpecial) score += 20;
        
        // Determine strength level
        if (score >= 80) {
            strength = 'very-strong';
        } else if (score >= 60) {
            strength = 'strong';
        } else if (score >= 40) {
            strength = 'medium';
        } else if (score >= 20) {
            strength = 'weak';
        }
        
        // Update UI
        strengthFill.className = 'strength-fill';
        if (strength !== 'none') {
            strengthFill.classList.add(strength);
        }
        
        strengthFill.style.width = `${score}%`;
        strengthValue.textContent = strength.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        // Update progress
        this.updateSignupProgress();
    }
    
    updateRequirement(element, isValid) {
        if (isValid) {
            element.classList.add('valid');
            element.querySelector('i').className = 'fas fa-check-circle';
        } else {
            element.classList.remove('valid');
            element.querySelector('i').className = 'fas fa-circle';
        }
    }
    
    validateConfirmPassword(password, confirmPassword) {
        const feedback = document.getElementById('confirmPasswordFeedback');
        const input = document.getElementById('confirmPassword');
        
        if (!confirmPassword) {
            this.showFeedback(feedback, 'error', 'Please confirm your password');
            input.classList.add('error');
            input.classList.remove('valid');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showFeedback(feedback, 'error', 'Passwords do not match');
            input.classList.add('error');
            input.classList.remove('valid');
            return;
        }
        
        this.showFeedback(feedback, 'valid', 'Passwords match');
        input.classList.add('valid');
        input.classList.remove('error');
        
        // Update progress
        this.updateSignupProgress();
    }
    
    updateSignupProgress() {
        const inputs = [
            document.getElementById('fullName'),
            document.getElementById('username'),
            document.getElementById('email'),
            document.getElementById('phone'),
            document.getElementById('password'),
            document.getElementById('confirmPassword')
        ];
        
        let validCount = 0;
        inputs.forEach(input => {
            if (input && input.classList.contains('valid')) {
                validCount++;
            }
        });
        
        const progress = Math.floor((validCount / inputs.length) * 100);
        const progressBar = document.getElementById('progressBarFill');
        const progressPercent = document.getElementById('progressPercent');
        
        if (progressBar && progressPercent) {
            progressBar.style.width = `${progress}%`;
            progressPercent.textContent = `${progress}%`;
        }
        
        // Update steps
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            if (index < Math.ceil(validCount / 2)) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    showFeedback(element, type, message) {
        if (!element) return;
        
        element.innerHTML = '';
        
        if (type === 'valid') {
            element.innerHTML = `
                <span class="valid-icon"><i class="fas fa-check-circle"></i></span>
                <span class="feedback-text">${message}</span>
            `;
        } else if (type === 'error') {
            element.innerHTML = `
                <span class="error-icon"><i class="fas fa-exclamation-circle"></i></span>
                <span class="feedback-text">${message}</span>
            `;
        }
    }
    
    showChecking(element, type) {
        if (!element) return;
        
        element.innerHTML = `
            <span class="availability-check">
                <i class="fas fa-sync fa-spin"></i>
                Checking ${type}...
            </span>
        `;
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const identifier = document.getElementById('loginIdentifier').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const loginBtn = document.getElementById('loginBtn');
        
        // Validate inputs
        if (!identifier || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        // Update login status
        this.updateLoginStatus('Authenticating...', 'processing');
        
        try {
            // Simulate API call with delay
            await this.simulateApiCall(1500);
            
            // Mock authentication logic
            const user = this.mockAuthentication(identifier, password);
            
            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
                
                // Save session if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('fredi_user', JSON.stringify(user));
                } else {
                    sessionStorage.setItem('fredi_user', JSON.stringify(user));
                }
                
                // Update login status
                this.updateLoginStatus('Authentication successful!', 'success');
                
                // Show success modal
                this.showSuccessModal('Welcome back!', 'Redirecting to dashboard...');
                
                // Record activity
                this.recordActivity('login', `User logged in from ${navigator.userAgent.slice(0, 50)}...`);
                
            } else {
                throw new Error('Invalid credentials');
            }
            
        } catch (error) {
            this.updateLoginStatus('Authentication failed', 'error');
            this.showNotification(error.message || 'Invalid credentials', 'error');
            
        } finally {
            // Reset button state
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }
    
    async handleSignup(e) {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            userType: document.getElementById('userType').value,
            agreeTerms: document.getElementById('agreeTerms').checked
        };
        
        // Validate all fields
        let isValid = true;
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'agreeTerms' && !value) {
                this.showNotification(`Please fill in ${key}`, 'error');
                isValid = false;
            }
        });
        
        if (!formData.agreeTerms) {
            this.showNotification('Please agree to the terms and conditions', 'error');
            isValid = false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show brain verification
        this.showBrainVerification();
    }
    
    async handleForgotPassword(e) {
        e.preventDefault();
        
        const email = document.getElementById('resetEmail').value;
        const resetBtn = document.getElementById('resetPasswordBtn');
        
        if (!email) {
            this.showNotification('Please enter your email', 'error');
            return;
        }
        
        // Show loading state
        resetBtn.classList.add('loading');
        resetBtn.disabled = true;
        
        try {
            // Simulate API call
            await this.simulateApiCall(2000);
            
            this.showNotification('Reset instructions sent to your email', 'success');
            
            // Reset form
            document.getElementById('forgotPasswordForm').reset();
            
        } catch (error) {
            this.showNotification('Failed to send reset instructions', 'error');
            
        } finally {
            // Reset button state
            resetBtn.classList.remove('loading');
            resetBtn.disabled = false;
        }
    }
    
    quickLogin(role) {
        const credentials = {
            'developer': { identifier: 'fredi_dev', password: 'dev123' },
            'admin': { identifier: 'admin', password: 'admin123' }
        };
        
        const creds = credentials[role];
        if (!creds) return;
        
        // Fill form
        document.getElementById('loginIdentifier').value = creds.identifier;
        document.getElementById('loginPassword').value = creds.password;
        
        // Show notification
        this.showNotification(`Filled ${role} credentials`, 'info');
        
        // Trigger validation
        this.checkPasswordStrength(creds.password);
    }
    
    showBrainVerification() {
        const modal = document.getElementById('brainVerificationModal');
        if (!modal) return;
        
        // Initialize game
        this.initVerificationGame();
        
        // Show modal
        modal.classList.add('active');
        
        // Start timer
        this.startVerificationTimer();
    }
    
    initVerificationGame() {
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) return;
        
        // Generate random emoji sequence
        const emojis = ['😀', '🎮', '🚀', '🌟', '💻', '🎯', '🔥', '⚡'];
        const sequence = [];
        
        // Clear container
        gameContainer.innerHTML = '';
        
        // Create emoji tiles
        emojis.forEach((emoji, index) => {
            const tile = document.createElement('div');
            tile.className = 'emoji-tile';
            tile.textContent = emoji;
            tile.dataset.index = index;
            
            tile.addEventListener('click', () => {
                if (!tile.classList.contains('active')) {
                    tile.classList.add('active');
                    sequence.push(emoji);
                    this.updateGameSequence(sequence);
                }
            });
            
            gameContainer.appendChild(tile);
        });
        
        // Store sequence in game instance
        this.gameSequence = sequence;
        this.userSequence = [];
    }
    
    updateGameSequence(sequence) {
        const currentSequence = document.getElementById('currentSequence');
        if (currentSequence) {
            currentSequence.textContent = JSON.stringify(sequence);
        }
        
        // Update progress bar
        const progress = (sequence.length / 4) * 100;
        const progressBar = document.getElementById('gameProgressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
    
    startVerificationTimer() {
        let timeLeft = 60;
        const timeElement = document.getElementById('timeRemaining');
        const attemptsElement = document.getElementById('attemptsCount');
        
        this.verificationTimer = setInterval(() => {
            timeLeft--;
            
            if (timeElement) {
                timeElement.textContent = `Time: ${timeLeft}s`;
            }
            
            if (timeLeft <= 0) {
                clearInterval(this.verificationTimer);
                this.handleVerificationFailure();
            }
        }, 1000);
        
        // Reset attempts
        this.verificationAttempts = 0;
        if (attemptsElement) {
            attemptsElement.textContent = '0';
        }
    }
    
    handleVerification() {
        this.verificationAttempts++;
        
        const attemptsElement = document.getElementById('attemptsCount');
        if (attemptsElement) {
            attemptsElement.textContent = this.verificationAttempts;
        }
        
        if (this.verificationAttempts >= 3) {
            this.handleVerificationFailure();
            return;
        }
        
        // Check if user has selected at least 4 emojis
        const activeTiles = document.querySelectorAll('.emoji-tile.active');
        if (activeTiles.length < 4) {
            this.showNotification('Please select at least 4 emojis', 'error');
            return;
        }
        
        // For demo purposes, always succeed
        clearInterval(this.verificationTimer);
        this.completeSignup();
    }
    
    resetVerificationGame() {
        this.initVerificationGame();
        this.verificationAttempts = 0;
        
        const attemptsElement = document.getElementById('attemptsCount');
        if (attemptsElement) {
            attemptsElement.textContent = '0';
        }
        
        const timeElement = document.getElementById('timeRemaining');
        if (timeElement) {
            timeElement.textContent = 'Time: 60s';
        }
        
        clearInterval(this.verificationTimer);
        this.startVerificationTimer();
    }
    
    handleVerificationFailure() {
        this.showNotification('Verification failed. Please try again.', 'error');
        
        const modal = document.getElementById('brainVerificationModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    completeSignup() {
        // Close verification modal
        const modal = document.getElementById('brainVerificationModal');
        if (modal) {
            modal.classList.remove('active');
        }
        
        // Get form data
        const user = {
            id: Date.now(),
            fullName: document.getElementById('fullName').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            userType: document.getElementById('userType').value,
            joinedAt: new Date().toISOString(),
            avatar: this.generateAvatar(document.getElementById('fullName').value)
        };
        
        // Save user
        this.currentUser = user;
        this.isAuthenticated = true;
        localStorage.setItem('fredi_user', JSON.stringify(user));
        
        // Show success modal
        this.showSuccessModal('Account created successfully!', 'Welcome to Fredi AI community');
        
        // Record activity
        this.recordActivity('signup', `New ${user.userType} account created`);
    }
    
    showSuccessModal(title, message) {
        const modal = document.getElementById('successModal');
        const successTitle = document.getElementById('successTitle');
        const successMessage = document.getElementById('successMessage');
        const progressBar = document.getElementById('successProgressBar');
        
        if (modal && successTitle && successMessage) {
            successTitle.textContent = title;
            successMessage.textContent = message;
            modal.classList.add('active');
            
            // Start progress bar
            let progress = 0;
            const interval = setInterval(() => {
                progress += 2;
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }
                
                if (progress >= 100) {
                    clearInterval(interval);
                    this.redirectToDashboard();
                }
            }, 50);
        }
    }
    
    redirectToDashboard() {
        // Close modal
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('active');
        }
        
        // FIXED: Redirect to dashboard.html instead of index.html
        window.location.href = 'dashboard.html'; // <<< HAPA NIME-BADILISHA
        
        // Alternative: Create dashboard.html automatically if it doesn't exist
        // this.ensureDashboardExists();
    }
    
    // Optional: Create dashboard.html if it doesn't exist
    ensureDashboardExists() {
        // Check if dashboard.html exists
        fetch('dashboard.html')
            .then(response => {
                if (!response.ok) {
                    // Create a basic dashboard if it doesn't exist
                    this.createBasicDashboard();
                } else {
                    window.location.href = 'dashboard.html';
                }
            })
            .catch(() => {
                // Create a basic dashboard if fetch fails
                this.createBasicDashboard();
            });
    }
    
    createBasicDashboard() {
        // Create a basic dashboard HTML content
        const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fredi AI - Dashboard</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <div class="dashboard-container">
        <header class="dashboard-header">
            <div class="logo">
                <div class="logo-icon">F</div>
                <div class="logo-text">FREDI AI Dashboard</div>
            </div>
            <div class="user-menu">
                <div class="user-avatar">
                    <span id="userAvatar">FE</span>
                </div>
                <div class="user-info">
                    <span id="userName">Fredi Elibarick Ezra</span>
                    <span class="user-role" id="userRole">Developer</span>
                </div>
            </div>
        </header>
        
        <main class="dashboard-main">
            <div class="welcome-section">
                <h1>Welcome to Fredi AI Dashboard!</h1>
                <p>You have successfully logged in.</p>
                <a href="index.html" class="btn btn-primary">Back to Home</a>
                <button class="btn btn-secondary" id="logoutBtn">Logout</button>
            </div>
        </main>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Load user data
            const userData = localStorage.getItem('fredi_user') || sessionStorage.getItem('fredi_user');
            if (userData) {
                const user = JSON.parse(userData);
                document.getElementById('userName').textContent = user.fullName;
                document.getElementById('userAvatar').textContent = user.avatar || user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
                document.getElementById('userRole').textContent = user.userType || 'Developer';
            }
            
            // Logout functionality
            document.getElementById('logoutBtn').addEventListener('click', function() {
                localStorage.removeItem('fredi_user');
                sessionStorage.removeItem('fredi_user');
                window.location.href = 'auth.html';
            });
        });
    </script>
</body>
</html>
        `;
        
        // Create and download the dashboard.html file
        const blob = new Blob([dashboardHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Redirect to the created dashboard
        window.location.href = url;
    }
    
    mockAuthentication(identifier, password) {
        // Mock users for demo
        const mockUsers = [
            {
                id: 1,
                username: 'fredi_dev',
                email: 'fredi@example.com',
                phone: '255752593977',
                fullName: 'Fredi Elibarick Ezra',
                role: 'developer',
                avatar: 'FE',
                joinedAt: '2023-01-01'
            },
            {
                id: 2,
                username: 'admin',
                email: 'admin@frediai.com',
                phone: '255000000000',
                fullName: 'System Administrator',
                role: 'admin',
                avatar: 'SA',
                joinedAt: '2023-01-01'
            }
        ];
        
        // Find user
        const user = mockUsers.find(u => 
            u.username === identifier || 
            u.email === identifier || 
            u.phone === identifier
        );
        
        // Mock password validation
        if (user && password === 'dev123' || password === 'admin123') {
            return user;
        }
        
        return null;
    }
    
    generateAvatar(name) {
        // Simple avatar generation from name
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    updateLoginStatus(text, status) {
        const statusElement = document.getElementById('loginStatus');
        if (!statusElement) return;
        
        const statusText = statusElement.querySelector('.status-text');
        const statusDot = statusElement.querySelector('.status-dot');
        
        if (statusText) {
            statusText.textContent = text;
        }
        
        if (statusDot) {
            statusDot.className = 'status-dot';
            if (status === 'success') {
                statusDot.style.background = '#4CAF50';
            } else if (status === 'error') {
                statusDot.style.background = '#f44336';
            } else {
                statusDot.style.background = '#FF9800';
            }
        }
    }
    
    async simulateApiCall(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    
    setupRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateSystemStatus();
        }, 5000);
    }
    
    updateSystemStatus() {
        // Update active users (random between 50-150)
        const activeUsers = Math.floor(Math.random() * 100) + 50;
        const activeUsersElement = document.getElementById('activeUsers');
        if (activeUsersElement) {
            activeUsersElement.textContent = activeUsers;
        }
        
        // Update server load (random between 5-40%)
        const serverLoad = Math.floor(Math.random() * 35) + 5;
        const serverLoadElement = document.getElementById('serverLoad');
        if (serverLoadElement) {
            serverLoadElement.textContent = `${serverLoad}%`;
        }
        
        // Update system status object
        this.systemStatus = {
            activeUsers,
            serverLoad,
            securityLevel: serverLoad > 80 ? 'medium' : 'high',
            responseTime: Math.floor(Math.random() * 100) + 20
        };
    }
    
    monitorSystemStatus() {
        // Initial update
        this.updateSystemStatus();
        
        // Update every 30 seconds
        setInterval(() => {
            this.updateSystemStatus();
        }, 30000);
    }
    
    loadRecentActivities() {
        const activitiesContainer = document.getElementById('loginActivities');
        if (!activitiesContainer) return;
        
        const activities = [
            { icon: '🔐', text: 'Security protocol updated', time: '2 min ago' },
            { icon: '🚀', text: 'New API version deployed', time: '15 min ago' },
            { icon: '👥', text: '3 new developers joined', time: '1 hour ago' },
            { icon: '🛠️', text: 'System maintenance completed', time: '3 hours ago' }
        ];
        
        activitiesContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-details">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }
    
    recordActivity(type, description) {
        const activity = {
            type,
            description,
            timestamp: new Date().toISOString(),
            user: this.currentUser?.username || 'guest'
        };
        
        // In a real app, you would send this to your backend
        console.log('Activity recorded:', activity);
    }
    
    checkExistingSession() {
        const userData = localStorage.getItem('fredi_user') || sessionStorage.getItem('fredi_user');
        
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isAuthenticated = true;
                
                // Show welcome back notification
                setTimeout(() => {
                    this.showNotification(`Welcome back, ${this.currentUser.fullName}!`, 'info');
                }, 1000);
                
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .auth-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    z-index: 1001;
                    animation: slideIn 0.3s ease;
                    max-width: 400px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    color: white;
                }
                
                .auth-notification.success {
                    background: #4CAF50;
                }
                
                .auth-notification.error {
                    background: #f44336;
                }
                
                .auth-notification.info {
                    background: #2196F3;
                }
                
                .auth-notification.warning {
                    background: #FF9800;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 1.5rem;
                    cursor: pointer;
                    margin-left: auto;
                    opacity: 0.7;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Close button event
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
}

// Initialize authentication system
document.addEventListener('DOMContentLoaded', () => {
    const authSystem = new AuthenticationSystem();
    window.authSystem = authSystem; // Make accessible globally
});
