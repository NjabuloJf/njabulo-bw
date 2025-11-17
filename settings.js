// Fredi AI Settings Management System
class FrediSettings {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.settings = JSON.parse(localStorage.getItem('frediSettings')) || this.getDefaultSettings();
        this.init();
    }

    init() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.loadSettings();
        this.initEventListeners();
        this.loadSystemInfo();
        this.updateHealthMetrics();
    }

    getDefaultSettings() {
        return {
            general: {
                language: 'en',
                timezone: 'Africa/Dar_es_Salaam',
                autoSave: true,
                animations: true,
                hardwareAcceleration: true,
                cacheStrategy: 'balanced'
            },
            appearance: {
                theme: 'dark',
                accentColor: '#6366f1',
                fontSize: 'medium',
                compactMode: false,
                sidebarPosition: 'left',
                gridDensity: 'cozy'
            },
            notifications: {
                push: true,
                email: true,
                sound: true,
                systemUpdates: true,
                securityAlerts: true,
                featureAnnouncements: true,
                marketing: false
            },
            privacy: {
                dataCollection: false,
                cookies: true,
                location: false,
                twoFactor: false,
                autoLogout: '30'
            },
            advanced: {
                developerMode: false,
                debugConsole: false,
                apiAccess: false
            },
            system: {
                autoUpdates: true,
                autoBackup: true,
                errorReporting: true
            }
        };
    }

    loadSettings() {
        // Load all settings into the UI
        this.loadGeneralSettings();
        this.loadAppearanceSettings();
        this.loadNotificationSettings();
        this.loadPrivacySettings();
        this.loadAdvancedSettings();
        this.loadSystemSettings();
    }

    loadGeneralSettings() {
        const general = this.settings.general;
        
        // Set values
        document.getElementById('languageSelect').value = general.language;
        document.getElementById('timezoneSelect').value = general.timezone;
        document.getElementById('autoSaveToggle').checked = general.autoSave;
        document.getElementById('animationsToggle').checked = general.animations;
        document.getElementById('hardwareAccelToggle').checked = general.hardwareAcceleration;
        document.getElementById('cacheSelect').value = general.cacheStrategy;
    }

    loadAppearanceSettings() {
        const appearance = this.settings.appearance;
        
        // Theme
        document.querySelector(`input[name="theme"][value="${appearance.theme}"]`).checked = true;
        
        // Accent color
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.color === appearance.accentColor) {
                option.classList.add('active');
            }
        });
        
        // Font size
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.size === appearance.fontSize) {
                btn.classList.add('active');
            }
        });
        
        // Other settings
        document.getElementById('compactModeToggle').checked = appearance.compactMode;
        document.getElementById('sidebarPosition').value = appearance.sidebarPosition;
        document.getElementById('gridDensity').value = appearance.gridDensity;
    }

    loadNotificationSettings() {
        const notifications = this.settings.notifications;
        
        document.getElementById('pushNotificationsToggle').checked = notifications.push;
        document.getElementById('emailNotificationsToggle').checked = notifications.email;
        document.getElementById('soundEffectsToggle').checked = notifications.sound;
        document.getElementById('systemUpdatesToggle').checked = notifications.systemUpdates;
        document.getElementById('securityAlertsToggle').checked = notifications.securityAlerts;
        document.getElementById('featureAnnouncementsToggle').checked = notifications.featureAnnouncements;
        document.getElementById('marketingEmailsToggle').checked = notifications.marketing;
    }

    loadPrivacySettings() {
        const privacy = this.settings.privacy;
        
        document.getElementById('dataCollectionToggle').checked = privacy.dataCollection;
        document.getElementById('cookiesToggle').checked = privacy.cookies;
        document.getElementById('locationServicesToggle').checked = privacy.location;
        document.getElementById('twoFactorToggle').checked = privacy.twoFactor;
        document.getElementById('autoLogoutSelect').value = privacy.autoLogout;
    }

    loadAdvancedSettings() {
        const advanced = this.settings.advanced;
        
        document.getElementById('developerModeToggle').checked = advanced.developerMode;
        document.getElementById('debugConsoleToggle').checked = advanced.debugConsole;
        document.getElementById('apiAccessToggle').checked = advanced.apiAccess;
    }

    loadSystemSettings() {
        const system = this.settings.system;
        
        document.getElementById('autoUpdatesToggle').checked = system.autoUpdates;
        document.getElementById('autoBackupToggle').checked = system.autoBackup;
        document.getElementById('errorReportingToggle').checked = system.errorReporting;
    }

    initEventListeners() {
        // Tab switching
        const tabs = document.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                this.switchTab(target);
            });
        });

        // Save settings
        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettings();
        });

        // Cancel changes
        document.getElementById('cancelSettingsBtn').addEventListener('click', () => {
            this.loadSettings();
            this.showMessage('Changes discarded', 'info');
        });

        // Export settings
        document.getElementById('exportSettingsBtn').addEventListener('click', () => {
            this.exportSettings();
        });

        // Reset settings
        document.getElementById('resetSettingsBtn').addEventListener('click', () => {
            this.resetSettings();
        });

        // Color options
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.applyAccentColor(option.dataset.color);
            });
        });

        // Font size buttons
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.applyFontSize(btn.dataset.size);
            });
        });

        // Theme options
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.applyTheme(radio.value);
            });
        });

        // Manage sessions
        document.getElementById('manageSessionsBtn').addEventListener('click', () => {
            this.showSessionsModal();
        });

        // Export data
        document.getElementById('exportDataBtn').addEventListener('click', () => {
            this.exportUserData();
        });

        // Clear cache
        document.getElementById('clearCacheBtn').addEventListener('click', () => {
            this.clearCache();
        });

        // Logout all sessions
        document.getElementById('logoutAllSessionsBtn').addEventListener('click', () => {
            this.logoutAllSessions();
        });

        // Close sessions modal
        document.getElementById('closeSessionsModal').addEventListener('click', () => {
            this.closeSessionsModal();
        });
    }

    switchTab(tabName) {
        // Update active tab
        const tabs = document.querySelectorAll('.settings-tab');
        const tabContents = document.querySelectorAll('.settings-tab-content');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    saveSettings() {
        try {
            // Collect all settings
            this.collectGeneralSettings();
            this.collectAppearanceSettings();
            this.collectNotificationSettings();
            this.collectPrivacySettings();
            this.collectAdvancedSettings();
            this.collectSystemSettings();

            // Save to localStorage
            localStorage.setItem('frediSettings', JSON.stringify(this.settings));

            // Apply settings
            this.applyAllSettings();

            this.showMessage('Settings saved successfully!', 'success');

        } catch (error) {
            console.error('Error saving settings:', error);
            this.showMessage('Error saving settings', 'error');
        }
    }

    collectGeneralSettings() {
        this.settings.general = {
            language: document.getElementById('languageSelect').value,
            timezone: document.getElementById('timezoneSelect').value,
            autoSave: document.getElementById('autoSaveToggle').checked,
            animations: document.getElementById('animationsToggle').checked,
            hardwareAcceleration: document.getElementById('hardwareAccelToggle').checked,
            cacheStrategy: document.getElementById('cacheSelect').value
        };
    }

    collectAppearanceSettings() {
        const theme = document.querySelector('input[name="theme"]:checked').value;
        const accentColor = document.querySelector('.color-option.active').dataset.color;
        const fontSize = document.querySelector('.font-size-btn.active').dataset.size;

        this.settings.appearance = {
            theme: theme,
            accentColor: accentColor,
            fontSize: fontSize,
            compactMode: document.getElementById('compactModeToggle').checked,
            sidebarPosition: document.getElementById('sidebarPosition').value,
            gridDensity: document.getElementById('gridDensity').value
        };
    }

    collectNotificationSettings() {
        this.settings.notifications = {
            push: document.getElementById('pushNotificationsToggle').checked,
            email: document.getElementById('emailNotificationsToggle').checked,
            sound: document.getElementById('soundEffectsToggle').checked,
            systemUpdates: document.getElementById('systemUpdatesToggle').checked,
            securityAlerts: document.getElementById('securityAlertsToggle').checked,
            featureAnnouncements: document.getElementById('featureAnnouncementsToggle').checked,
            marketing: document.getElementById('marketingEmailsToggle').checked
        };
    }

    collectPrivacySettings() {
        this.settings.privacy = {
            dataCollection: document.getElementById('dataCollectionToggle').checked,
            cookies: document.getElementById('cookiesToggle').checked,
            location: document.getElementById('locationServicesToggle').checked,
            twoFactor: document.getElementById('twoFactorToggle').checked,
            autoLogout: document.getElementById('autoLogoutSelect').value
        };
    }

    collectAdvancedSettings() {
        this.settings.advanced = {
            developerMode: document.getElementById('developerModeToggle').checked,
            debugConsole: document.getElementById('debugConsoleToggle').checked,
            apiAccess: document.getElementById('apiAccessToggle').checked
        };
    }

    collectSystemSettings() {
        this.settings.system = {
            autoUpdates: document.getElementById('autoUpdatesToggle').checked,
            autoBackup: document.getElementById('autoBackupToggle').checked,
            errorReporting: document.getElementById('errorReportingToggle').checked
        };
    }

    applyAllSettings() {
        this.applyTheme(this.settings.appearance.theme);
        this.applyAccentColor(this.settings.appearance.accentColor);
        this.applyFontSize(this.settings.appearance.fontSize);
        this.applyAnimations(this.settings.general.animations);
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    applyAccentColor(color) {
        document.documentElement.style.setProperty('--primary', color);
        
        // Generate lighter/darker variants
        const lighter = this.lightenColor(color, 20);
        const darker = this.darkenColor(color, 20);
        
        document.documentElement.style.setProperty('--primary-light', lighter);
        document.documentElement.style.setProperty('--primary-dark', darker);
    }

    applyFontSize(size) {
        const sizes = {
            small: '14px',
            medium: '16px',
            large: '18px',
            xlarge: '20px'
        };
        
        document.documentElement.style.setProperty('--base-font-size', sizes[size]);
    }

    applyAnimations(enabled) {
        if (!enabled) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R > 0 ? R : 0) * 0x10000 +
            (G > 0 ? G : 0) * 0x100 +
            (B > 0 ? B : 0)).toString(16).slice(1);
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
            this.settings = this.getDefaultSettings();
            localStorage.setItem('frediSettings', JSON.stringify(this.settings));
            this.loadSettings();
            this.applyAllSettings();
            this.showMessage('All settings reset to default', 'success');
        }
    }

    exportSettings() {
        const settingsData = {
            app: 'Fredi AI',
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            settings: this.settings
        };

        const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fredi-ai-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('Settings exported successfully!', 'success');
    }

    exportUserData() {
        const userData = {
            profile: this.currentUser,
            settings: this.settings,
            activity: JSON.parse(localStorage.getItem('userActivity') || '{}'),
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fredi-ai-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('Data exported successfully!', 'success');
    }

    clearCache() {
        if (confirm('Are you sure you want to clear all cached data? This will not affect your settings or account data.')) {
            // Clear specific cache items
            localStorage.removeItem('cachedProjects');
            localStorage.removeItem('cachedMenu');
            localStorage.removeItem('updateCache');
            
            // Clear session storage
            sessionStorage.clear();
            
            this.showMessage('Cache cleared successfully!', 'success');
        }
    }

    loadSystemInfo() {
        // App version
        document.getElementById('appVersion').textContent = '1.0.0';

        // Browser info
        document.getElementById('browserInfo').textContent = this.getBrowserInfo();

        // Platform info
        document.getElementById('platformInfo').textContent = this.getPlatformInfo();

        // Screen resolution
        document.getElementById('screenResolution').textContent = 
            `${screen.width}x${screen.height}`;

        // Local storage usage
        this.updateStorageUsage();

        // Connection type
        this.detectConnectionType();
    }

    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = "Unknown";
        
        if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Safari")) browser = "Safari";
        else if (ua.includes("Edge")) browser = "Edge";
        
        return browser;
    }

    getPlatformInfo() {
        const ua = navigator.userAgent;
        let platform = "Unknown";
        
        if (ua.includes("Windows")) platform = "Windows";
        else if (ua.includes("Mac")) platform = "macOS";
        else if (ua.includes("Linux")) platform = "Linux";
        else if (ua.includes("Android")) platform = "Android";
        else if (ua.includes("iOS")) platform = "iOS";
        
        return platform;
    }

    updateStorageUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        const usageMB = (total / 1024 / 1024).toFixed(2);
        document.getElementById('localStorageUsage').textContent = `${usageMB} MB / 5 MB`;
    }

    detectConnectionType() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            document.getElementById('connectionType').textContent = connection.effectiveType || 'Unknown';
        } else {
            document.getElementById('connectionType').textContent = 'Unknown';
        }
    }

    updateHealthMetrics() {
        // Simulate system metrics (in real app, these would come from actual system data)
        setInterval(() => {
            document.getElementById('cpuUsage').textContent = `${Math.floor(Math.random() * 30) + 40}%`;
            document.getElementById('memoryUsage').textContent = `${Math.floor(Math.random() * 20) + 50}%`;
            document.getElementById('storageUsage').textContent = `${Math.floor(Math.random() * 10) + 70}%`;
            
            // Update progress bars
            this.updateProgressBars();
        }, 5000);
    }

    updateProgressBars() {
        const metrics = ['cpuUsage', 'memoryUsage', 'storageUsage'];
        metrics.forEach(metric => {
            const value = parseInt(document.getElementById(metric).textContent);
            const fill = document.querySelector(`#${metric}`).closest('.health-metric').querySelector('.metric-fill');
            fill.style.width = `${value}%`;
            
            // Update color based on value
            if (value > 80) fill.style.background = 'var(--danger)';
            else if (value > 60) fill.style.background = 'var(--warning)';
            else fill.style.background = 'var(--success)';
        });
    }

    showSessionsModal() {
        const modal = document.getElementById('sessionsModal');
        const sessionsList = document.getElementById('sessionsList');
        
        // Load sessions (mock data for demo)
        const sessions = [
            {
                device: 'Chrome on Windows',
                location: 'Dar es Salaam, TZ',
                lastActive: 'Current',
                ip: '192.168.1.100',
                active: true
            },
            {
                device: 'Safari on iPhone',
                location: 'Nairobi, KE',
                lastActive: '2 hours ago',
                ip: '196.188.1.50',
                active: false
            },
            {
                device: 'Firefox on Mac',
                location: 'Kampala, UG',
                lastActive: '1 day ago',
                ip: '102.89.32.150',
                active: false
            }
        ];

        sessionsList.innerHTML = sessions.map(session => `
            <div class="session-item ${session.active ? 'active' : ''}">
                <div class="session-icon">
                    <i class="fas fa-desktop"></i>
                </div>
                <div class="session-info">
                    <div class="session-device">${session.device}</div>
                    <div class="session-details">
                        <span class="session-location">${session.location}</span>
                        <span class="session-ip">${session.ip}</span>
                        <span class="session-time">${session.lastActive}</span>
                    </div>
                </div>
                ${session.active ? '<div class="session-badge current">Current</div>' : 
                  '<button class="session-logout" data-ip="${session.ip}">Logout</button>'}
            </div>
        `).join('');

        // Add logout handlers
        document.querySelectorAll('.session-logout').forEach(btn => {
            btn.addEventListener('click', () => {
                this.logoutSession(btn.dataset.ip);
            });
        });

        modal.classList.add('show');
    }

    closeSessionsModal() {
        document.getElementById('sessionsModal').classList.remove('show');
    }

    logoutSession(ip) {
        if (confirm(`Logout session from IP: ${ip}?`)) {
            // In real app, you would call backend API to logout specific session
            this.showMessage('Session logged out successfully', 'success');
            this.showSessionsModal(); // Refresh the list
        }
    }

    logoutAllSessions() {
        if (confirm('Are you sure you want to logout from all devices? You will need to login again.')) {
            // In real app, you would call backend API to logout all sessions
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
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

// Initialize settings management when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('settings.html')) {
        window.frediSettings = new FrediSettings();
    }
});
