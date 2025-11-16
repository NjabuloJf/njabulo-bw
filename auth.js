// Fredi AI Authentication System with Real Email SMTP
class FrediAuth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('frediUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.verificationCodes = JSON.parse(localStorage.getItem('verificationCodes')) || {};
        this.smtpConfig = {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'frediezra360@gmail.com',
                pass: 'jaul qirx pugk hnfp'
            }
        };
        this.init();
    }

    init() {
        // Check if user is logged in
        if (this.currentUser && window.location.pathname.includes('login.html')) {
            window.location.href = 'dashboard.html';
        }

        // Initialize event listeners based on current page
        if (window.location.pathname.includes('login.html')) {
            this.initLogin();
        } else if (window.location.pathname.includes('signup.html')) {
            this.initSignup();
        } else if (window.location.pathname.includes('dashboard.html')) {
            this.initDashboard();
            this.initGreetingSystem();
            this.initUpdateNotifications();
        } else if (window.location.pathname.includes('profile.html')) {
            this.initProfile();
        } else if (window.location.pathname.includes('payment.html')) {
            this.initPayment();
        }

        // Initialize greeting system for all pages
        this.showTimeBasedGreeting();
    }

    // === NEW EMAIL FUNCTIONALITY METHODS ===

    // Real Email SMTP Function
    async sendEmail(to, subject, htmlContent) {
        try {
            // Using EmailJS service for SMTP (free tier available)
            if (typeof emailjs !== 'undefined') {
                const templateParams = {
                    to_email: to,
                    subject: subject,
                    message: htmlContent,
                    from_name: 'Fredi AI'
                };

                await emailjs.send('service_your_service_id', 'template_your_template_id', templateParams);
                console.log('Email sent successfully via EmailJS');
                return true;
            } else {
                // Fallback to direct SMTP using your credentials
                return await this.sendSMTPEmail(to, subject, htmlContent);
            }
        } catch (error) {
            console.error('Email sending failed:', error);
            // Fallback to console for demo purposes
            console.log(`Email to: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Content: ${htmlContent}`);
            return false;
        }
    }

    // Direct SMTP Implementation (Client-side fallback)
    async sendSMTPEmail(to, subject, htmlContent) {
        const emailData = {
            to: to,
            subject: subject,
            html: htmlContent,
            from: 'frediezra360@gmail.com'
        };

        try {
            const response = await fetch('https://your-backend-domain.com/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });

            if (response.ok) {
                console.log('Email sent successfully via backend');
                return true;
            } else {
                throw new Error('Backend email service failed');
            }
        } catch (error) {
            console.error('SMTP email failed:', error);
            return false;
        }
    }

    // Send Verification Code with Real Email
    async sendVerificationCode(email, phone) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        this.verificationCodes[email] = { code, expiry };
        localStorage.setItem('verificationCodes', JSON.stringify(this.verificationCodes));

        // Send email
        const emailSubject = 'Fredi AI - Email Verification Code';
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
                    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .code { font-size: 32px; font-weight: bold; text-align: center; color: #6366f1; margin: 30px 0; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Fredi AI</h1>
                        <p>Email Verification</p>
                    </div>
                    <h2>Hello!</h2>
                    <p>Thank you for registering with Fredi AI. Use the verification code below to complete your registration:</p>
                    <div class="code">${code}</div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                    <div class="footer">
                        <p>&copy; 2024 Fredi AI. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const emailSent = await this.sendEmail(email, emailSubject, emailHtml);
        
        if (emailSent) {
            this.showMessage('Verification code sent to your email!', 'success');
        } else {
            this.showMessage('Verification code: ' + code + ' (Email service unavailable)', 'info');
        }

        // Start countdown
        this.startVerificationCountdown();
    }

    // Greeting System
    showTimeBasedGreeting() {
        const hour = new Date().getHours();
        let greeting = '';
        
        if (hour >= 5 && hour < 12) {
            greeting = 'Good morning';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good afternoon';
        } else if (hour >= 17 && hour < 21) {
            greeting = 'Good evening';
        } else {
            greeting = 'Good night';
        }

        // Update greeting in dashboard if available
        const greetingElement = document.getElementById('greetingMessage');
        if (greetingElement) {
            greetingElement.textContent = `${greeting}, ${this.currentUser?.fullName || 'Guest'}!`;
        }

        return greeting;
    }

    // Auto-detect Updates and Notify Users
    initUpdateNotifications() {
        const lastUpdateCheck = localStorage.getItem('lastUpdateCheck');
        const currentTime = Date.now();
        
        // Check for updates every 24 hours
        if (!lastUpdateCheck || (currentTime - parseInt(lastUpdateCheck)) > 24 * 60 * 60 * 1000) {
            this.checkForUpdates();
            localStorage.setItem('lastUpdateCheck', currentTime.toString());
        }

        // Check for updates on page load (can be removed in production)
        this.checkForUpdates();
    }

    async checkForUpdates() {
        try {
            // Simulate checking for updates
            const updates = await this.fetchUpdates();
            
            if (updates && updates.length > 0) {
                this.showUpdateNotification(updates);
                
                // Send email notification to users about updates
                if (this.currentUser && this.currentUser.notifications?.productUpdates) {
                    this.sendUpdateEmail(updates);
                }
            }
        } catch (error) {
            console.error('Update check failed:', error);
        }
    }

    async fetchUpdates() {
        // Simulate fetching updates from server
        return new Promise((resolve) => {
            setTimeout(() => {
                const updates = [
                    {
                        title: 'New AI Features Available',
                        description: 'We\'ve added new AI models and improved processing speed.',
                        date: new Date().toISOString(),
                        type: 'feature'
                    },
                    {
                        title: 'Mobile App Update',
                        description: 'Our mobile app now supports offline mode and faster downloads.',
                        date: new Date().toISOString(),
                        type: 'improvement'
                    }
                ];
                resolve(updates);
            }, 1000);
        });
    }

    showUpdateNotification(updates) {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-header">
                <i class="fas fa-sync-alt"></i>
                <span>New Updates Available</span>
                <button class="close-update">&times;</button>
            </div>
            <div class="update-content">
                ${updates.map(update => `
                    <div class="update-item">
                        <strong>${update.title}</strong>
                        <p>${update.description}</p>
                        <small>${new Date(update.date).toLocaleDateString()}</small>
                    </div>
                `).join('')}
            </div>
        `;

        // Add styles
        if (!document.querySelector('#update-styles')) {
            const styles = document.createElement('style');
            styles.id = 'update-styles';
            styles.textContent = `
                .update-notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--card-bg);
                    border: 1px solid var(--primary);
                    border-radius: 10px;
                    padding: 0;
                    z-index: 10001;
                    max-width: 350px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    backdrop-filter: blur(20px);
                }
                .update-header {
                    background: var(--primary);
                    color: white;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-radius: 10px 10px 0 0;
                }
                .update-header span {
                    flex: 1;
                    font-weight: 600;
                }
                .close-update {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                }
                .update-content {
                    padding: 20px;
                    max-height: 300px;
                    overflow-y: auto;
                }
                .update-item {
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid var(--glass-border);
                }
                .update-item:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }
                .update-item strong {
                    color: var(--light);
                    display: block;
                    margin-bottom: 5px;
                }
                .update-item p {
                    color: var(--gray-light);
                    margin: 0 0 8px 0;
                    font-size: 0.9rem;
                }
                .update-item small {
                    color: var(--gray);
                    font-size: 0.8rem;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.close-update');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    async sendUpdateEmail(updates) {
        const emailSubject = 'Fredi AI - New Updates Available!';
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
                    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .update { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #6366f1; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Fredi AI Updates</h1>
                        <p>Exciting New Features Available</p>
                    </div>
                    <h2>Hello ${this.currentUser.fullName}!</h2>
                    <p>We're excited to share some new updates with you:</p>
                    
                    ${updates.map(update => `
                        <div class="update">
                            <h3>${update.title}</h3>
                            <p>${update.description}</p>
                            <small>Posted on ${new Date(update.date).toLocaleDateString()}</small>
                        </div>
                    `).join('')}
                    
                    <p>Log in to your dashboard to explore these new features!</p>
                    <div class="footer">
                        <p>&copy; 2024 Fredi AI. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(this.currentUser.email, emailSubject, emailHtml);
    }

    // Daily Greeting Email System
    initGreetingSystem() {
        const lastGreeting = localStorage.getItem('lastGreetingDate');
        const today = new Date().toDateString();
        
        if (lastGreeting !== today) {
            this.sendDailyGreeting();
            localStorage.setItem('lastGreetingDate', today);
        }
    }

    async sendDailyGreeting() {
        if (!this.currentUser || !this.currentUser.notifications?.email) return;

        const greeting = this.showTimeBasedGreeting();
        const emailSubject = `Fredi AI - ${greeting} Greeting`;
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
                    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .greeting { font-size: 24px; text-align: center; margin: 30px 0; color: #6366f1; }
                    .stats { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Fredi AI</h1>
                        <p>${greeting} Greeting</p>
                    </div>
                    <div class="greeting">
                        ${greeting}, ${this.currentUser.fullName}!
                    </div>
                    <p>We hope you're having a wonderful day! Here's what's happening with Fredi AI:</p>
                    
                    <div class="stats">
                        <h3>Your Daily Stats</h3>
                        <p>• 25+ AI Projects Available</p>
                        <p>• 10,000+ Active Users</p>
                        <p>• Daily Feature Updates</p>
                    </div>
                    
                    <p>Ready to create something amazing today?</p>
                    <p><a href="${window.location.origin}/dashboard.html" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Go to Dashboard</a></p>
                    
                    <div class="footer">
                        <p>&copy; 2024 Fredi AI. All rights reserved.</p>
                        <p><a href="${window.location.origin}/profile.html" style="color: #6366f1;">Manage your email preferences</a></p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(this.currentUser.email, emailSubject, emailHtml);
    }

    async sendWelcomeEmail(user) {
        const emailSubject = 'Welcome to Fredi AI!';
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
                    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .welcome { font-size: 24px; text-align: center; margin: 30px 0; color: #6366f1; }
                    .features { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0; }
                    .feature { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Fredi AI!</h1>
                        <p>Your AI-Powered Dashboard</p>
                    </div>
                    <div class="welcome">
                        Welcome aboard, ${user.fullName}!
                    </div>
                    <p>We're excited to have you join our community of AI enthusiasts and developers.</p>
                    
                    <div class="features">
                        <div class="feature">
                            <strong>🤖 AI Projects</strong>
                            <p>Access 25+ AI projects</p>
                        </div>
                        <div class="feature">
                            <strong>🚀 Daily Updates</strong>
                            <p>Fresh features every day</p>
                        </div>
                        <div class="feature">
                            <strong>🔒 Secure</strong>
                            <p>Enterprise-grade security</p>
                        </div>
                        <div class="feature">
                            <strong>💡 Innovative</strong>
                            <p>Cutting-edge technology</p>
                        </div>
                    </div>
                    
                    <p>Get started by exploring your dashboard and don't forget to verify your email address to unlock all features!</p>
                    
                    <div class="footer">
                        <p>&copy; 2024 Fredi AI. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(user.email, emailSubject, emailHtml);
    }

    updateUserInDatabase(user) {
        const users = JSON.parse(localStorage.getItem('frediUsers')) || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('frediUsers', JSON.stringify(users));
        }
    }

    // === YOUR EXISTING METHODS (UPDATED) ===

    // Handle user signup (UPDATED)
    async handleSignup() {
        const fullName = document.getElementById('fullName').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate inputs
        if (!this.validateSignup(fullName, username, email, phone, password, confirmPassword)) {
            return;
        }

        // Check if user already exists
        if (this.userExists(username, email)) {
            this.showMessage('Username or email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: this.generateId(),
            fullName,
            username,
            email,
            phone,
            password: this.hashPassword(password),
            avatar: this.generateAvatar(fullName),
            joinDate: new Date().toISOString(),
            isVerified: false,
            subscription: 'free',
            lastLogin: null,
            notifications: {
                email: true,
                sms: false,
                productUpdates: true,
                marketing: false
            }
        };

        // Store user temporarily for verification
        sessionStorage.setItem('pendingUser', JSON.stringify(newUser));

        // Send verification code with real email
        await this.sendVerificationCode(email, phone);

        // Send welcome email
        await this.sendWelcomeEmail(newUser);

        // Show verification modal
        const verificationModal = document.getElementById('verificationModal');
        if (verificationModal) {
            verificationModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    // Handle user login (UPDATED)
    handleLogin() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const loginBtn = document.getElementById('loginBtn');

        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';

        // Simulate API call
        setTimeout(async () => {
            const user = this.authenticateUser(username, password);
            
            if (user) {
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }

                // Update last login
                user.lastLogin = new Date().toISOString();
                this.updateUserInDatabase(user);

                // Show greeting
                const greeting = this.showTimeBasedGreeting();
                this.showMessage(`${greeting}! Login successful! Redirecting...`, 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                this.showMessage('Invalid username or password', 'error');
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            }
        }, 1500);
    }

    // === YOUR EXISTING METHODS (UNCHANGED) ===

    // Login functionality
    initLogin() {
        const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    // Signup functionality
    initSignup() {
        const signupForm = document.getElementById('signupForm');
        const verificationModal = document.getElementById('verificationModal');
        const verifyBtn = document.getElementById('verifyBtn');
        const resendCode = document.getElementById('resendCode');

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                this.handleVerification();
            });
        }

        if (resendCode) {
            resendCode.addEventListener('click', () => {
                if (!resendCode.classList.contains('disabled')) {
                    this.resendVerificationCode();
                }
            });
        }

        // Initialize verification code inputs
        this.initVerificationInputs();
    }

    // Dashboard functionality
    initDashboard() {
        const userMenu = document.getElementById('userMenu');
        const logoutBtn = document.getElementById('logoutBtn');

        // Update user info in header
        this.updateUserInfo();

        // Initialize user menu toggle
        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userMenu.classList.remove('active');
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Show donation modal after 3 seconds if not shown before
        if (!sessionStorage.getItem('donationShown')) {
            setTimeout(() => {
                const donationModal = document.getElementById('donationModal');
                if (donationModal) {
                    donationModal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
                sessionStorage.setItem('donationShown', 'true');
            }, 3000);
        }

        // Close donation modal
        const declineDonation = document.getElementById('declineDonation');
        const donationModal = document.getElementById('donationModal');

        if (declineDonation && donationModal) {
            declineDonation.addEventListener('click', () => {
                donationModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            });

            donationModal.addEventListener('click', (e) => {
                if (e.target === donationModal) {
                    donationModal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }

    // Profile functionality
    initProfile() {
        this.updateProfileInfo();
        this.initProfileTabs();
        this.initProfileForm();
    }

    // Payment functionality
    initPayment() {
        this.initPaymentOptions();
        this.initPaymentForm();
    }

    // Handle verification
    handleVerification() {
        const codeInputs = document.querySelectorAll('.verification-input');
        const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
        const pendingUser = JSON.parse(sessionStorage.getItem('pendingUser'));

        if (!pendingUser) {
            this.showMessage('Verification session expired', 'error');
            return;
        }

        if (this.verifyCode(pendingUser.email, enteredCode)) {
            // Add user to database
            pendingUser.isVerified = true;
            this.users.push(pendingUser);
            localStorage.setItem('frediUsers', JSON.stringify(this.users));

            // Set as current user
            this.currentUser = pendingUser;
            localStorage.setItem('currentUser', JSON.stringify(pendingUser));

            // Clear pending user
            sessionStorage.removeItem('pendingUser');

            this.showMessage('Account created successfully! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            this.showMessage('Invalid verification code', 'error');
        }
    }

    // Handle logout
    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    // Update user info in header
    updateUserInfo() {
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (this.currentUser && userAvatar && userName) {
            userAvatar.innerHTML = this.currentUser.avatar;
            userName.textContent = this.currentUser.fullName;
        }
    }

    // Update profile information
    updateProfileInfo() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        const profileAvatar = document.getElementById('profileAvatar');
        const profileName = document.getElementById('profileName');
        const profileUsername = document.getElementById('profileUsername');
        const profileEmail = document.getElementById('profileEmail');
        const profilePhone = document.getElementById('profilePhone');
        const profileJoinDate = document.getElementById('profileJoinDate');

        if (profileAvatar) profileAvatar.innerHTML = this.currentUser.avatar;
        if (profileName) profileName.textContent = this.currentUser.fullName;
        if (profileUsername) profileUsername.textContent = `@${this.currentUser.username}`;
        if (profileEmail) profileEmail.textContent = this.currentUser.email;
        if (profilePhone) profilePhone.textContent = this.currentUser.phone;
        if (profileJoinDate) {
            const joinDate = new Date(this.currentUser.joinDate);
            profileJoinDate.textContent = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    // Initialize profile tabs
    initProfileTabs() {
        const tabs = document.querySelectorAll('.profile-tab');
        const tabContents = document.querySelectorAll('.profile-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show target content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${target}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // Initialize profile form
    initProfileForm() {
        const profileForm = document.getElementById('profileForm');
        
        if (profileForm && this.currentUser) {
            // Pre-fill form with current user data
            document.getElementById('editFullName').value = this.currentUser.fullName;
            document.getElementById('editUsername').value = this.currentUser.username;
            document.getElementById('editEmail').value = this.currentUser.email;
            document.getElementById('editPhone').value = this.currentUser.phone;

            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }

        // Initialize avatar upload
        const avatarUpload = document.getElementById('avatarUpload');
        if (avatarUpload) {
            avatarUpload.addEventListener('change', (e) => {
                this.handleAvatarUpload(e);
            });
        }
    }

    // Update user profile
    updateProfile() {
        const fullName = document.getElementById('editFullName').value;
        const username = document.getElementById('editUsername').value;
        const email = document.getElementById('editEmail').value;
        const phone = document.getElementById('editPhone').value;

        // Update user in database
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = {
                ...this.users[userIndex],
                fullName,
                username,
                email,
                phone
            };
            
            localStorage.setItem('frediUsers', JSON.stringify(this.users));
            
            // Update current user
            this.currentUser = this.users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            this.showMessage('Profile updated successfully!', 'success');
            this.updateProfileInfo();
        }
    }

    // Handle avatar upload
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // In a real app, you would upload to server
                // For demo, we'll just update the avatar display
                const profileAvatar = document.getElementById('profileAvatar');
                const userAvatar = document.getElementById('userAvatar');
                
                if (profileAvatar) {
                    profileAvatar.innerHTML = `<img src="${e.target.result}" alt="Profile Avatar">`;
                }
                if (userAvatar) {
                    userAvatar.innerHTML = `<img src="${e.target.result}" alt="User Avatar">`;
                }
                
                this.showMessage('Avatar updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    // Initialize payment options
    initPaymentOptions() {
        const paymentOptions = document.querySelectorAll('.payment-option');
        const amountOptions = document.querySelectorAll('.amount-option');

        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                paymentOptions.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        amountOptions.forEach(option => {
            option.addEventListener('click', () => {
                amountOptions.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }

    // Initialize payment form
    initPaymentForm() {
        const paymentForm = document.getElementById('paymentForm');
        
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processPayment();
            });
        }
    }

    // Process payment
    processPayment() {
        const selectedOption = document.querySelector('.payment-option.selected');
        const selectedAmount = document.querySelector('.amount-option.selected');
        
        if (!selectedOption || !selectedAmount) {
            this.showMessage('Please select payment method and amount', 'error');
            return;
        }

        const paymentMethod = selectedOption.getAttribute('data-method');
        const amount = selectedAmount.getAttribute('data-amount');
        const phoneNumber = document.getElementById('paymentPhone').value;

        if (!phoneNumber) {
            this.showMessage('Please enter your phone number', 'error');
            return;
        }

        // Simulate payment processing
        this.showMessage('Processing payment...', 'info');
        
        setTimeout(() => {
            // In a real app, you would integrate with payment gateway
            // For demo, we'll simulate successful payment
            
            // Update user subscription
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex].subscription = 'pro';
                this.users[userIndex].subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
                
                localStorage.setItem('frediUsers', JSON.stringify(this.users));
                
                // Update current user
                this.currentUser = this.users[userIndex];
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                
                this.showMessage('Payment successful! Your account has been upgraded to Pro.', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            }
        }, 3000);
    }

    // Utility methods
    authenticateUser(username, password) {
        return this.users.find(user => 
            (user.username === username || user.email === username) && 
            user.password === this.hashPassword(password)
        );
    }

    userExists(username, email) {
        return this.users.some(user => 
            user.username === username || user.email === email
        );
    }

    validateSignup(fullName, username, email, phone, password, confirmPassword) {
        // Basic validation
        if (!fullName || !username || !email || !phone || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return false;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return false;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return false;
        }

        if (!this.validatePhone(phone)) {
            this.showMessage('Please enter a valid phone number', 'error');
            return false;
        }

        return true;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const re = /^255\d{9}$/;
        return re.test(phone.replace(/\s/g, ''));
    }

    hashPassword(password) {
        // In a real app, use proper hashing like bcrypt
        // For demo, we'll use a simple hash
        return btoa(password);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    generateAvatar(name) {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        return `<span>${initials}</span>`;
    }

    verifyCode(email, code) {
        const storedCode = this.verificationCodes[email];
        
        if (!storedCode || storedCode.expiry < Date.now()) {
            return false;
        }

        return storedCode.code === code;
    }

    resendVerificationCode() {
        const pendingUser = JSON.parse(sessionStorage.getItem('pendingUser'));
        if (pendingUser) {
            this.sendVerificationCode(pendingUser.email, pendingUser.phone);
            this.showMessage('Verification code sent!', 'success');
        }
    }

    startVerificationCountdown() {
        const resendCode = document.getElementById('resendCode');
        const countdownElement = document.getElementById('countdown');
        
        if (!resendCode || !countdownElement) return;

        let timeLeft = 60;
        resendCode.classList.add('disabled');

        const countdown = setInterval(() => {
            timeLeft--;
            countdownElement.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(countdown);
                resendCode.classList.remove('disabled');
                countdownElement.textContent = '60';
                resendCode.innerHTML = 'Didn\'t receive code? <span>Resend</span>';
            }
        }, 1000);
    }

    initVerificationInputs() {
        const inputs = document.querySelectorAll('.verification-input');
        
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    }

    showMessage(message, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles if not already added
        if (!document.querySelector('#message-styles')) {
            const styles = document.createElement('style');
            styles.id = 'message-styles';
            styles.textContent = `
                .message {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--darker);
                    border: 1px solid var(--glass-border);
                    border-radius: 10px;
                    padding: 15px 20px;
                    z-index: 10000;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                }
                .message.show {
                    transform: translateX(0);
                }
                .message.success {
                    border-left: 4px solid var(--success);
                }
                .message.error {
                    border-left: 4px solid var(--danger);
                }
                .message.info {
                    border-left: 4px solid var(--primary);
                }
                .message-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--light);
                }
                .message-content i {
                    font-size: 1.2rem;
                }
                .message.success .message-content i {
                    color: var(--success);
                }
                .message.error .message-content i {
                    color: var(--danger);
                }
                .message.info .message-content i {
                    color: var(--primary);
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(messageEl);

        // Show message
        setTimeout(() => {
            messageEl.classList.add('show');
        }, 100);

        // Hide message after 5 seconds
        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.frediAuth = new FrediAuth();
});
