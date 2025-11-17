// Fredi AI Profile Management
class FrediProfile {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.userActivity = JSON.parse(localStorage.getItem('userActivity')) || {};
        this.init();
    }

    init() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.loadProfileData();
        this.initEventListeners();
        this.loadUserStats();
        this.loadRecentActivity();
        this.loadSessions();
        this.loadSubscriptionData();
    }

    loadProfileData() {
        // Update profile information
        document.getElementById('profileName').textContent = this.currentUser.fullName;
        document.getElementById('profileUsername').textContent = `@${this.currentUser.username}`;
        document.getElementById('userName').textContent = this.currentUser.fullName;
        
        // Update avatar
        const profileAvatar = document.getElementById('profileAvatar');
        const userAvatar = document.getElementById('userAvatar');
        if (profileAvatar) profileAvatar.innerHTML = this.currentUser.avatar;
        if (userAvatar) userAvatar.innerHTML = this.currentUser.avatar;

        // Update form fields
        document.getElementById('editFullName').value = this.currentUser.fullName;
        document.getElementById('editUsername').value = this.currentUser.username;
        document.getElementById('editEmail').value = this.currentUser.email;
        document.getElementById('editPhone').value = this.currentUser.phone;
        document.getElementById('editBio').value = this.currentUser.bio || '';

        // Update verification badge with brain game info
        const verificationBadge = document.getElementById('verificationBadge');
        if (verificationBadge) {
            if (this.currentUser.isVerified) {
                verificationBadge.textContent = 'Verified 🤖';
                verificationBadge.style.background = 'rgba(16, 185, 129, 0.2)';
            } else {
                verificationBadge.textContent = 'Not Verified';
                verificationBadge.style.background = 'rgba(239, 68, 68, 0.2)';
            }
        }

        // Update subscription badge
        const subscriptionBadge = document.getElementById('subscriptionBadge');
        if (subscriptionBadge) {
            subscriptionBadge.textContent = this.currentUser.subscription === 'pro' ? 'Pro Plan 👑' : 'Free Plan';
            subscriptionBadge.style.background = this.currentUser.subscription === 'pro' 
                ? 'rgba(245, 158, 11, 0.2)' 
                : 'rgba(99, 102, 241, 0.2)';
        }

        // Update member since
        const memberSince = document.getElementById('memberSince');
        if (memberSince) {
            const joinDate = new Date(this.currentUser.joinDate);
            memberSince.textContent = `Member since ${joinDate.getFullYear()}`;
        }
    }

    initEventListeners() {
        // Profile form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }

        // Avatar upload
        const avatarUpload = document.getElementById('avatarUpload');
        if (avatarUpload) {
            avatarUpload.addEventListener('change', (e) => {
                this.handleAvatarUpload(e);
            });
        }

        // Password change
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                this.changePassword();
            });
        }

        // 2FA toggle
        const enable2FA = document.getElementById('enable2FA');
        const setup2FABtn = document.getElementById('setup2FABtn');
        
        if (enable2FA) {
            enable2FA.addEventListener('change', (e) => {
                const settings = document.getElementById('2faSettings');
                if (settings) {
                    settings.style.display = e.target.checked ? 'block' : 'none';
                }
                if (setup2FABtn) {
                    setup2FABtn.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }

        if (setup2FABtn) {
            setup2FABtn.addEventListener('click', () => {
                this.setup2FA();
            });
        }

        // Logout all sessions
        const logoutAllBtn = document.getElementById('logoutAllBtn');
        if (logoutAllBtn) {
            logoutAllBtn.addEventListener('click', () => {
                this.logoutAllSessions();
            });
        }

        // Tab switching
        const tabs = document.querySelectorAll('.profile-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                this.switchTab(target);
            });
        });

        // Export buttons
        const exportDataBtn = document.getElementById('exportDataBtn');
        const exportActivityBtn = document.getElementById('exportActivityBtn');
        
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportData('all');
            });
        }
        
        if (exportActivityBtn) {
            exportActivityBtn.addEventListener('click', () => {
                this.exportData('activity');
            });
        }
    }

    updateProfile() {
        const fullName = document.getElementById('editFullName').value;
        const username = document.getElementById('editUsername').value;
        const email = document.getElementById('editEmail').value;
        const phone = document.getElementById('editPhone').value;
        const bio = document.getElementById('editBio').value;

        // Update user in database
        const users = JSON.parse(localStorage.getItem('frediUsers')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                fullName,
                username,
                email,
                phone,
                bio,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem('frediUsers', JSON.stringify(users));
            
            // Update current user
            this.currentUser = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // Update UI
            this.loadProfileData();
            
            // Show success message
            this.showMessage('Profile updated successfully!', 'success');
        }
    }

    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Update avatar in database
                const users = JSON.parse(localStorage.getItem('frediUsers')) || [];
                const userIndex = users.findIndex(u => u.id === this.currentUser.id);
                
                if (userIndex !== -1) {
                    users[userIndex].avatar = `<img src="${e.target.result}" alt="Profile Avatar">`;
                    localStorage.setItem('frediUsers', JSON.stringify(users));
                    
                    // Update current user
                    this.currentUser = users[userIndex];
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    
                    // Update UI
                    this.loadProfileData();
                    
                    this.showMessage('Avatar updated successfully!', 'success');
                }
            };
            reader.readAsDataURL(file);
        }
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;

        // Validate inputs
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showMessage('Please fill in all password fields', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showMessage('New passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        // Verify current password
        if (btoa(currentPassword) !== this.currentUser.password) {
            this.showMessage('Current password is incorrect', 'error');
            return;
        }

        // Update password
        const users = JSON.parse(localStorage.getItem('frediUsers')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].password = btoa(newPassword);
            localStorage.setItem('frediUsers', JSON.stringify(users));
            
            // Update current user
            this.currentUser = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // Clear form
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmNewPassword').value = '';
            
            this.showMessage('Password changed successfully!', 'success');
        }
    }

    setup2FA() {
        // In a real app, you would generate a secret and QR code
        // For demo, we'll show a simulated setup
        
        const modal = document.getElementById('2faModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Simulate QR code generation
            const qrcodeContainer = document.getElementById('qrcode');
            if (qrcodeContainer) {
                qrcodeContainer.innerHTML = `
                    <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; display: inline-block;">
                        <div style="color: #333; text-align: center;">
                            <i class="fas fa-qrcode" style="font-size: 100px; margin-bottom: 10px;"></i>
                            <p>Scan with Google Authenticator</p>
                        </div>
                    </div>
                `;
            }
            
            // Setup verification
            const verifyBtn = document.getElementById('verify2FABtn');
            if (verifyBtn) {
                verifyBtn.onclick = () => {
                    const code = document.getElementById('2faCode').value;
                    if (code === '123456') { // Demo code
                        this.enable2FA();
                        modal.classList.remove('show');
                        document.body.style.overflow = 'auto';
                        this.showMessage('Two-factor authentication enabled!', 'success');
                    } else {
                        this.showMessage('Invalid verification code', 'error');
                    }
                };
            }
            
            // Cancel button
            const cancelBtn = document.getElementById('cancel2FABtn');
            if (cancelBtn) {
                cancelBtn.onclick = () => {
                    modal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                };
            }
        }
    }

    enable2FA() {
        const users = JSON.parse(localStorage.getItem('frediUsers')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].twoFactorEnabled = true;
            users[userIndex].twoFactorMethod = 'authenticator';
            localStorage.setItem('frediUsers', JSON.stringify(users));
            
            this.currentUser = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    logoutAllSessions() {
        if (confirm('Are you sure you want to logout from all devices?')) {
            // In a real app, you would invalidate all sessions
            // For demo, we'll just clear the current session
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    }

    switchTab(tabName) {
        // Update active tab
        const tabs = document.querySelectorAll('.profile-tab');
        const tabContents = document.querySelectorAll('.profile-tab-content');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load tab-specific data
        switch(tabName) {
            case 'activity':
                this.loadActivityCharts();
                break;
            case 'subscription':
                this.loadSubscriptionDetails();
                break;
        }
    }

    loadUserStats() {
        // Load user statistics
        const userStats = this.userActivity[this.currentUser.id] || {
            projects: 0,
            apiCalls: 0,
            storageUsed: 0,
            daysActive: 1
        };

        document.getElementById('projectsCount').textContent = userStats.projects;
        document.getElementById('apiCalls').textContent = userStats.apiCalls.toLocaleString();
        document.getElementById('storageUsed').textContent = `${userStats.storageUsed} MB`;
        document.getElementById('daysActive').textContent = userStats.daysActive;
    }

    loadRecentActivity() {
        const activity = [
            { action: 'Logged in', time: '2 hours ago', icon: 'fas fa-sign-in-alt' },
            { action: 'Created new project', time: '5 hours ago', icon: 'fas fa-plus' },
            { action: 'Updated profile', time: '1 day ago', icon: 'fas fa-user-edit' },
            { action: 'Completed brain verification', time: '1 day ago', icon: 'fas fa-brain' },
            { action: 'Downloaded resources', time: '2 days ago', icon: 'fas fa-download' }
        ];

        const container = document.getElementById('recentActivity');
        if (container) {
            container.innerHTML = activity.map(item => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-action">${item.action}</div>
                        <div class="activity-time">${item.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    loadSessions() {
        const sessions = [
            { device: 'Chrome on Windows', location: 'Dar es Salaam, TZ', lastActive: 'Current', active: true },
            { device: 'Safari on iPhone', location: 'Dar es Salaam, TZ', lastActive: '2 days ago', active: false },
            { device: 'Firefox on Mac', location: 'Nairobi, KE', lastActive: '1 week ago', active: false }
        ];

        const container = document.getElementById('sessionsList');
        if (container) {
            container.innerHTML = sessions.map(session => `
                <div class="session-item ${session.active ? 'active' : ''}">
                    <div class="session-info">
                        <div class="session-device">${session.device}</div>
                        <div class="session-details">
                            <span class="session-location">${session.location}</span>
                            <span class="session-time">${session.lastActive}</span>
                        </div>
                    </div>
                    ${session.active ? '<div class="session-badge">Current</div>' : ''}
                </div>
            `).join('');
        }
    }

    loadSubscriptionData() {
        const subscription = this.currentUser.subscription || 'free';
        const container = document.getElementById('currentSubscription');
        
        if (container) {
            if (subscription === 'pro') {
                const expiry = new Date(this.currentUser.subscriptionExpiry);
                container.innerHTML = `
                    <div class="subscription-status pro">
                        <div class="status-icon">
                            <i class="fas fa-crown"></i>
                        </div>
                        <div class="status-info">
                            <h4>Pro Plan Active</h4>
                            <p>Expires on ${expiry.toLocaleDateString()}</p>
                        </div>
                    </div>
                `;
                
                document.getElementById('cancelSubscriptionBtn').style.display = 'block';
            } else {
                container.innerHTML = `
                    <div class="subscription-status free">
                        <div class="status-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="status-info">
                            <h4>Free Plan</h4>
                            <p>Upgrade to unlock premium features</p>
                        </div>
                    </div>
                `;
            }
        }

        // Load features list
        const featuresList = document.getElementById('featuresList');
        if (featuresList) {
            const features = subscription === 'pro' ? [
                '10,000 API calls per month',
                '10GB storage space',
                'Advanced AI models',
                'Priority customer support',
                'Early access to new features',
                'Custom model training'
            ] : [
                '100 API calls per month',
                '500MB storage space',
                'Basic AI models',
                'Community support',
                'Standard features',
                'Limited access'
            ];

            featuresList.innerHTML = features.map(feature => `
                <div class="feature-item">
                    <i class="fas fa-check"></i>
                    <span>${feature}</span>
                </div>
            `).join('');
        }
    }

    loadActivityCharts() {
        // Simulate chart data
        const apiUsageData = [30, 45, 60, 75, 85, 95, 100, 95, 85, 75, 65, 55];
        const storageData = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
        
        // Simple SVG-based charts
        const apiChart = document.getElementById('apiUsageChart');
        const storageChart = document.getElementById('storageChart');
        
        if (apiChart) {
            apiChart.innerHTML = this.createSimpleChart(apiUsageData, '#6366f1');
        }
        
        if (storageChart) {
            storageChart.innerHTML = this.createSimpleChart(storageData, '#10b981');
        }
    }

    createSimpleChart(data, color) {
        const max = Math.max(...data);
        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (value / max) * 100;
            return `${x},${y}`;
        }).join(' ');
        
        return `
            <svg viewBox="0 0 100 100" class="simple-chart">
                <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2"/>
                <circle cx="${points.split(' ').pop().split(',')[0]}" cy="${points.split(' ').pop().split(',')[1]}" r="3" fill="${color}"/>
            </svg>
        `;
    }

    exportData(type) {
        let data = {};
        
        if (type === 'all') {
            data = {
                profile: this.currentUser,
                activity: this.userActivity[this.currentUser.id] || {},
                settings: this.getUserSettings()
            };
        } else if (type === 'activity') {
            data = this.userActivity[this.currentUser.id] || {};
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fredi-ai-${type}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage(`Data exported successfully!`, 'success');
    }

    getUserSettings() {
        return {
            notifications: {
                email: document.getElementById('emailNotifications')?.checked || false,
                sms: document.getElementById('smsNotifications')?.checked || false,
                productUpdates: document.getElementById('productUpdates')?.checked || false,
                marketing: document.getElementById('marketingEmails')?.checked || false
            },
            preferences: {
                theme: localStorage.getItem('theme') || 'dark',
                timezone: document.getElementById('editTimezone')?.value || 'Africa/Dar_es_Salaam'
            }
        };
    }

    showMessage(message, type) {
        // Reuse the message system from auth.js
        if (window.frediAuth && window.frediAuth.showMessage) {
            window.frediAuth.showMessage(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize profile management when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('profile.html')) {
        window.frediProfile = new FrediProfile();
    }
});
