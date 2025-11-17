// Fredi AI Authentication System with Brain Game Verification
class FrediAuth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('frediUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.verificationGames = JSON.parse(localStorage.getItem('verificationGames')) || {};
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

    // === BRAIN GAME VERIFICATION SYSTEM ===

    // Create Brain Verification Game
    createVerificationGame(email) {
        const gameId = this.generateId();
        const gameType = this.getRandomGameType();
        const gameData = this.generateGameData(gameType);
        const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        this.verificationGames[email] = {
            id: gameId,
            type: gameType,
            data: gameData,
            expiry: expiry,
            attempts: 0,
            maxAttempts: 3
        };
        
        localStorage.setItem('verificationGames', JSON.stringify(this.verificationGames));
        return { gameId, gameType, gameData };
    }

    // Get Random Game Type
    getRandomGameType() {
        const games = [
            'pattern_match',
            'memory_sequence', 
            'color_match',
            'shape_rotation',
            'number_sequence'
        ];
        return games[Math.floor(Math.random() * games.length)];
    }

    // Generate Game Data Based on Type
    generateGameData(gameType) {
        switch(gameType) {
            case 'pattern_match':
                return this.generatePatternMatchGame();
            case 'memory_sequence':
                return this.generateMemorySequenceGame();
            case 'color_match':
                return this.generateColorMatchGame();
            case 'shape_rotation':
                return this.generateShapeRotationGame();
            case 'number_sequence':
                return this.generateNumberSequenceGame();
            default:
                return this.generatePatternMatchGame();
        }
    }

    // Pattern Match Game
    generatePatternMatchGame() {
        const patterns = ['▲▲▼▼', '◀◀▶▶', '◆◆●●', '⬟⬟⬠⬠'];
        const correctPattern = patterns[Math.floor(Math.random() * patterns.length)];
        const options = this.shuffleArray([...patterns, '▲▼▲▼', '◀▶◀▶', '◆●◆●', '⬟⬠⬟⬠']);
        
        return {
            question: "Select the pattern that matches the sequence:",
            pattern: correctPattern,
            options: options,
            correctAnswer: correctPattern,
            difficulty: 'easy'
        };
    }

    // Memory Sequence Game
    generateMemorySequenceGame() {
        const sequences = [
            { sequence: [2, 4, 6, 8], answer: 10 },
            { sequence: [1, 3, 5, 7], answer: 9 },
            { sequence: [5, 10, 15, 20], answer: 25 },
            { sequence: [3, 6, 9, 12], answer: 15 }
        ];
        return sequences[Math.floor(Math.random() * sequences.length)];
    }

    // Color Match Game
    generateColorMatchGame() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        const targetColor = colors[Math.floor(Math.random() * colors.length)];
        const options = this.shuffleArray([...colors]);
        
        return {
            question: "Select the color that matches the target:",
            targetColor: targetColor,
            options: options,
            correctAnswer: targetColor,
            difficulty: 'easy'
        };
    }

    // Shape Rotation Game
    generateShapeRotationGame() {
        const shapes = ['▲', '◀', '▶', '▼', '◆', '●'];
        const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
        const rotations = ['0deg', '90deg', '180deg', '270deg'];
        const correctRotation = rotations[Math.floor(Math.random() * rotations.length)];
        
        return {
            question: "Select the shape that matches after rotation:",
            targetShape: targetShape,
            rotation: correctRotation,
            options: rotations,
            correctAnswer: correctRotation,
            difficulty: 'medium'
        };
    }

    // Number Sequence Game
    generateNumberSequenceGame() {
        const sequences = [
            { numbers: [2, 4, 8, 16], answer: 32 },
            { numbers: [1, 1, 2, 3, 5], answer: 8 },
            { numbers: [10, 20, 30, 40], answer: 50 },
            { numbers: [3, 9, 27, 81], answer: 243 }
        ];
        return sequences[Math.floor(Math.random() * sequences.length)];
    }

    // Verify Game Solution
    verifyGameSolution(email, userAnswer) {
        const game = this.verificationGames[email];
        
        if (!game || game.expiry < Date.now()) {
            return { success: false, error: 'Game expired' };
        }

        if (game.attempts >= game.maxAttempts) {
            return { success: false, error: 'Maximum attempts exceeded' };
        }

        game.attempts++;
        localStorage.setItem('verificationGames', JSON.stringify(this.verificationGames));

        let isCorrect = false;
        
        switch(game.type) {
            case 'pattern_match':
            case 'color_match':
            case 'shape_rotation':
                isCorrect = userAnswer === game.data.correctAnswer;
                break;
            case 'memory_sequence':
            case 'number_sequence':
                isCorrect = parseInt(userAnswer) === game.data.answer;
                break;
        }

        if (isCorrect) {
            delete this.verificationGames[email];
            localStorage.setItem('verificationGames', JSON.stringify(this.verificationGames));
            return { success: true };
        } else {
            return { 
                success: false, 
                error: 'Incorrect answer',
                attemptsLeft: game.maxAttempts - game.attempts
            };
        }
    }

    // Show Brain Verification Game
    async showBrainVerificationGame(email) {
        const game = this.createVerificationGame(email);
        const modal = document.getElementById('brainVerificationModal');
        
        if (!modal) {
            this.createBrainVerificationModal();
            // Wait for modal to be created
            setTimeout(() => this.renderGame(game, email), 100);
        } else {
            this.renderGame(game, email);
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    // Create Brain Verification Modal
    createBrainVerificationModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'brainVerificationModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="brain-verification-container">
                    <div class="verification-header">
                        <h3>🤖 Human Verification</h3>
                        <p>Complete this challenge to verify you're human</p>
                    </div>
                    <div class="game-container" id="gameContainer">
                        <!-- Game will be rendered here -->
                    </div>
                    <div class="verification-footer">
                        <div class="attempts-info" id="attemptsInfo">
                            Attempts: <span id="attemptsCount">0</span>/3
                        </div>
                        <button class="auth-btn" id="verifyGameBtn">
                            <i class="fas fa-check"></i>
                            Verify
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.addBrainGameStyles();
    }

    // Render Game Based on Type
    renderGame(game, email) {
        const container = document.getElementById('gameContainer');
        if (!container) return;

        let gameHTML = '';
        
        switch(game.gameType) {
            case 'pattern_match':
                gameHTML = this.renderPatternMatchGame(game.gameData);
                break;
            case 'memory_sequence':
                gameHTML = this.renderMemorySequenceGame(game.gameData);
                break;
            case 'color_match':
                gameHTML = this.renderColorMatchGame(game.gameData);
                break;
            case 'shape_rotation':
                gameHTML = this.renderShapeRotationGame(game.gameData);
                break;
            case 'number_sequence':
                gameHTML = this.renderNumberSequenceGame(game.gameData);
                break;
        }

        container.innerHTML = gameHTML;
        this.setupGameEventListeners(game.gameType, email);
    }

    // Render Pattern Match Game
    renderPatternMatchGame(gameData) {
        return `
            <div class="game-content">
                <div class="game-question">${gameData.question}</div>
                <div class="target-pattern">${gameData.pattern}</div>
                <div class="game-options">
                    ${gameData.options.map((option, index) => `
                        <label class="game-option">
                            <input type="radio" name="pattern" value="${option}">
                            <span class="option-content">${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Render Memory Sequence Game
    renderMemorySequenceGame(gameData) {
        return `
            <div class="game-content">
                <div class="game-question">Complete the number sequence:</div>
                <div class="number-sequence">${gameData.sequence.join(' → ')} → ?</div>
                <div class="game-input">
                    <input type="number" id="sequenceAnswer" placeholder="Enter the next number">
                </div>
            </div>
        `;
    }

    // Render Color Match Game
    renderColorMatchGame(gameData) {
        return `
            <div class="game-content">
                <div class="game-question">${gameData.question}</div>
                <div class="target-color" style="background: ${gameData.targetColor}"></div>
                <div class="color-options">
                    ${gameData.options.map((color, index) => `
                        <div class="color-option" data-color="${color}" style="background: ${color}"></div>
                    `).join('')}
                </div>
                <input type="hidden" id="selectedColor" value="">
            </div>
        `;
    }

    // Render Shape Rotation Game
    renderShapeRotationGame(gameData) {
        return `
            <div class="game-content">
                <div class="game-question">${gameData.question}</div>
                <div class="shape-preview">
                    <div class="shape" data-shape="${gameData.targetShape}" style="transform: rotate(${gameData.rotation})">
                        ${gameData.targetShape}
                    </div>
                </div>
                <div class="rotation-options">
                    ${gameData.options.map(rotation => `
                        <label class="rotation-option">
                            <input type="radio" name="rotation" value="${rotation}">
                            <span>${rotation}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Render Number Sequence Game
    renderNumberSequenceGame(gameData) {
        return `
            <div class="game-content">
                <div class="game-question">What comes next in this sequence?</div>
                <div class="number-display">${gameData.numbers.join(', ')}</div>
                <div class="game-input">
                    <input type="number" id="numberSequenceAnswer" placeholder="Enter the next number">
                </div>
            </div>
        `;
    }

    // Setup Game Event Listeners
    setupGameEventListeners(gameType, email) {
        const verifyBtn = document.getElementById('verifyGameBtn');
        const attemptsInfo = document.getElementById('attemptsInfo');
        const attemptsCount = document.getElementById('attemptsCount');

        if (gameType === 'color_match') {
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.addEventListener('click', () => {
                    colorOptions.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    document.getElementById('selectedColor').value = option.dataset.color;
                });
            });
        }

        if (verifyBtn) {
            verifyBtn.onclick = () => {
                this.handleGameVerification(gameType, email);
            };
        }

        // Update attempts count
        const game = this.verificationGames[email];
        if (game && attemptsCount) {
            attemptsCount.textContent = game.attempts;
        }
    }

    // Handle Game Verification
    handleGameVerification(gameType, email) {
        let userAnswer = '';

        switch(gameType) {
            case 'pattern_match':
            case 'shape_rotation':
                const selectedOption = document.querySelector('input[name="pattern"], input[name="rotation"]:checked');
                userAnswer = selectedOption ? selectedOption.value : '';
                break;
            case 'memory_sequence':
                userAnswer = document.getElementById('sequenceAnswer').value;
                break;
            case 'color_match':
                userAnswer = document.getElementById('selectedColor').value;
                break;
            case 'number_sequence':
                userAnswer = document.getElementById('numberSequenceAnswer').value;
                break;
        }

        if (!userAnswer) {
            this.showMessage('Please complete the verification challenge', 'error');
            return;
        }

        const result = this.verifyGameSolution(email, userAnswer);
        
        if (result.success) {
            this.showMessage('Verification successful!', 'success');
            this.completeSignup();
        } else {
            if (result.attemptsLeft > 0) {
                this.showMessage(`Incorrect answer. ${result.attemptsLeft} attempts remaining.`, 'error');
                // Refresh game
                this.showBrainVerificationGame(email);
            } else {
                this.showMessage('Too many failed attempts. Please try again later.', 'error');
                this.closeBrainVerificationModal();
            }
        }
    }

    // Complete Signup After Verification
    completeSignup() {
        const pendingUser = JSON.parse(sessionStorage.getItem('pendingUser'));
        
        if (!pendingUser) {
            this.showMessage('Verification session expired', 'error');
            return;
        }

        // Add user to database
        pendingUser.isVerified = true;
        pendingUser.verificationMethod = 'brain_game';
        this.users.push(pendingUser);
        localStorage.setItem('frediUsers', JSON.stringify(this.users));

        // Set as current user
        this.currentUser = pendingUser;
        localStorage.setItem('currentUser', JSON.stringify(pendingUser));

        // Clear pending user
        sessionStorage.removeItem('pendingUser');
        this.closeBrainVerificationModal();

        this.showMessage('Account created successfully! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    // Close Brain Verification Modal
    closeBrainVerificationModal() {
        const modal = document.getElementById('brainVerificationModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    // Add Brain Game Styles
    addBrainGameStyles() {
        if (!document.querySelector('#brain-game-styles')) {
            const styles = document.createElement('style');
            styles.id = 'brain-game-styles';
            styles.textContent = `
                .brain-verification-container {
                    max-width: 500px;
                    margin: 0 auto;
                }
                .verification-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .verification-header h3 {
                    color: var(--light);
                    margin-bottom: 10px;
                }
                .game-container {
                    background: var(--darker);
                    border: 1px solid var(--glass-border);
                    border-radius: 15px;
                    padding: 30px;
                    margin-bottom: 20px;
                }
                .game-question {
                    color: var(--light);
                    font-size: 1.1rem;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .target-pattern {
                    font-size: 2rem;
                    text-align: center;
                    margin: 20px 0;
                    color: var(--primary);
                }
                .game-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-top: 20px;
                }
                .game-option {
                    display: flex;
                    align-items: center;
                    padding: 15px;
                    border: 2px solid var(--glass-border);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .game-option:hover {
                    border-color: var(--primary);
                }
                .game-option input[type="radio"] {
                    display: none;
                }
                .game-option input[type="radio"]:checked + .option-content {
                    background: var(--primary);
                    color: white;
                }
                .option-content {
                    padding: 10px 15px;
                    border-radius: 8px;
                    background: var(--dark);
                    transition: all 0.3s ease;
                    width: 100%;
                    text-align: center;
                    font-size: 1.2rem;
                }
                .target-color {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    margin: 20px auto;
                    border: 3px solid var(--glass-border);
                }
                .color-options {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 20px;
                }
                .color-option {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 3px solid transparent;
                    transition: all 0.3s ease;
                }
                .color-option.selected {
                    border-color: var(--primary);
                    transform: scale(1.1);
                }
                .shape-preview {
                    text-align: center;
                    margin: 20px 0;
                }
                .shape {
                    font-size: 3rem;
                    display: inline-block;
                    transition: transform 0.3s ease;
                }
                .rotation-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-top: 20px;
                }
                .rotation-option {
                    display: flex;
                    align-items: center;
                    padding: 15px;
                    border: 2px solid var(--glass-border);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .rotation-option:hover {
                    border-color: var(--primary);
                }
                .rotation-option input[type="radio"] {
                    display: none;
                }
                .rotation-option input[type="radio"]:checked + span {
                    color: var(--primary);
                    font-weight: 600;
                }
                .number-sequence, .number-display {
                    font-size: 1.5rem;
                    text-align: center;
                    margin: 20px 0;
                    color: var(--primary);
                    font-weight: 600;
                }
                .game-input {
                    text-align: center;
                    margin-top: 20px;
                }
                .game-input input {
                    width: 200px;
                    padding: 12px;
                    border: 2px solid var(--glass-border);
                    border-radius: 8px;
                    background: var(--dark);
                    color: var(--light);
                    font-size: 1.1rem;
                    text-align: center;
                }
                .verification-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .attempts-info {
                    color: var(--gray-light);
                    font-size: 0.9rem;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Utility function to shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // === UPDATED SIGNUP METHOD ===
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

        // Send welcome email
        await this.sendWelcomeEmail(newUser);

        // Show brain verification game instead of code verification
        await this.showBrainVerificationGame(email);
    }

    // === EMAIL FUNCTIONALITY METHODS ===

    async sendEmail(to, subject, htmlContent) {
        try {
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
                return await this.sendSMTPEmail(to, subject, htmlContent);
            }
        } catch (error) {
            console.error('Email sending failed:', error);
            console.log(`Email to: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Content: ${htmlContent}`);
            return false;
        }
    }

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
                    
                    <p>Get started by exploring your dashboard!</p>
                    
                    <div class="footer">
                        <p>&copy; 2024 Fredi AI. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(user.email, emailSubject, emailHtml);
    }

    // === EXISTING AUTH METHODS ===

    handleLogin() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const loginBtn = document.getElementById('loginBtn');

        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';

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

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }
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
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex].subscription = 'pro';
                this.users[userIndex].subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
                
                localStorage.setItem('frediUsers', JSON.stringify(this.users));
                
                this.currentUser = this.users[userIndex];
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                
                this.showMessage('Payment successful! Your account has been upgraded to Pro.', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            }
        }, 3000);
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

        const greetingElement = document.getElementById('greetingMessage');
        if (greetingElement) {
            greetingElement.textContent = `${greeting}, ${this.currentUser?.fullName || 'Guest'}!`;
        }

        return greeting;
    }

    // Update notifications
    initUpdateNotifications() {
        const lastUpdateCheck = localStorage.getItem('lastUpdateCheck');
        const currentTime = Date.now();
        
        if (!lastUpdateCheck || (currentTime - parseInt(lastUpdateCheck)) > 24 * 60 * 60 * 1000) {
            this.checkForUpdates();
            localStorage.setItem('lastUpdateCheck', currentTime.toString());
        }

        this.checkForUpdates();
    }

    async checkForUpdates() {
        try {
            const updates = await this.fetchUpdates();
            
            if (updates && updates.length > 0) {
                this.showUpdateNotification(updates);
                
                if (this.currentUser && this.currentUser.notifications?.productUpdates) {
                    this.sendUpdateEmail(updates);
                }
            }
        } catch (error) {
            console.error('Update check failed:', error);
        }
    }

    async fetchUpdates() {
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
                        title: 'Brain Verification System',
                        description: 'New human verification system with fun games.',
                        date: new Date().toISOString(),
                        type: 'security'
                    }
                ];
                resolve(updates);
            }, 1000);
        });
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
        return btoa(password);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    generateAvatar(name) {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        return `<span>${initials}</span>`;
    }

    updateUserInDatabase(user) {
        const users = JSON.parse(localStorage.getItem('frediUsers')) || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('frediUsers', JSON.stringify(users));
        }
    }

    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;

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

        setTimeout(() => {
            messageEl.classList.add('show');
        }, 100);

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
