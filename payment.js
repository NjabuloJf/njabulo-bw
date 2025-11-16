// Fredi AI Payment Processing
class FrediPayment {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.selectedPlan = 'pro';
        this.selectedMethod = null;
        this.selectedAmount = 9999;
        this.paymentHistory = JSON.parse(localStorage.getItem('paymentHistory')) || [];
        this.init();
    }

    init() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.initEventListeners();
        this.updatePaymentSummary();
    }

    initEventListeners() {
        // Plan selection
        const selectProBtn = document.getElementById('selectProBtn');
        if (selectProBtn) {
            selectProBtn.addEventListener('click', () => {
                this.showPaymentMethods();
            });
        }

        // Free trial
        const startTrialBtn = document.getElementById('startTrialBtn');
        if (startTrialBtn) {
            startTrialBtn.addEventListener('click', () => {
                this.startFreeTrial();
            });
        }

        // Enterprise contact
        const contactEnterpriseBtn = document.getElementById('contactEnterpriseBtn');
        if (contactEnterpriseBtn) {
            contactEnterpriseBtn.addEventListener('click', () => {
                this.contactEnterprise();
            });
        }

        // Payment method selection
        const paymentOptions = document.querySelectorAll('.payment-option');
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectPaymentMethod(option);
            });
        });

        // Amount selection
        const amountOptions = document.querySelectorAll('.amount-option');
        amountOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectAmount(option);
            });
        });

        // Payment form submission
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processPayment();
            });
        }

        // Success modal close
        const closeSuccessModal = document.getElementById('closeSuccessModal');
        if (closeSuccessModal) {
            closeSuccessModal.addEventListener('click', () => {
                this.closeSuccessModal();
            });
        }
    }

    showPaymentMethods() {
        const paymentSection = document.getElementById('paymentMethodSection');
        if (paymentSection) {
            paymentSection.style.display = 'block';
            paymentSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    selectPaymentMethod(option) {
        // Remove selected class from all options
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selected class to clicked option
        option.classList.add('selected');

        // Store selected method
        this.selectedMethod = option.getAttribute('data-method');

        // Show payment form
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.style.display = 'block';
            
            // Update form title
            const formTitle = document.getElementById('paymentFormTitle');
            if (formTitle) {
                const methodNames = {
                    'vodacom': 'Vodacom M-Pesa',
                    'airtel': 'Airtel Money',
                    'halotel': 'Halotel',
                    'card': 'Credit/Debit Card'
                };
                formTitle.textContent = `${methodNames[this.selectedMethod]} Payment`;
            }

            // Show/hide form sections
            const mobileForm = document.getElementById('mobilePaymentForm');
            const cardForm = document.getElementById('cardPaymentForm');
            
            if (this.selectedMethod === 'card') {
                if (mobileForm) mobileForm.style.display = 'none';
                if (cardForm) cardForm.style.display = 'block';
            } else {
                if (mobileForm) mobileForm.style.display = 'block';
                if (cardForm) cardForm.style.display = 'none';
                
                // Pre-fill phone number for mobile payments
                const paymentPhone = document.getElementById('paymentPhone');
                if (paymentPhone && this.currentUser.phone) {
                    paymentPhone.value = this.currentUser.phone;
                }
            }
        }

        this.updatePaymentSummary();
    }

    selectAmount(option) {
        // Remove selected class from all options
        document.querySelectorAll('.amount-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selected class to clicked option
        option.classList.add('selected');

        // Store selected amount
        this.selectedAmount = parseInt(option.getAttribute('data-amount'));

        this.updatePaymentSummary();
    }

    updatePaymentSummary() {
        const summaryPlan = document.getElementById('summaryPlan');
        const summaryAmount = document.getElementById('summaryAmount');
        const summaryTotal = document.getElementById('summaryTotal');

        if (summaryPlan && summaryAmount && summaryTotal) {
            let planText = 'Pro Plan';
            if (this.selectedAmount === 49999) planText = 'Pro Plan - 6 Months';
            if (this.selectedAmount === 89999) planText = 'Pro Plan - 1 Year';

            summaryPlan.textContent = planText;
            summaryAmount.textContent = `TZS ${this.selectedAmount.toLocaleString()}`;
            summaryTotal.textContent = `TZS ${this.selectedAmount.toLocaleString()}`;
        }
    }

    async processPayment() {
        // Validate form
        if (!this.validatePaymentForm()) {
            return;
        }

        // Show processing modal
        this.showProcessingModal();

        try {
            // Simulate payment processing
            await this.simulatePayment();

            // If successful, show success modal
            this.showSuccessModal();

            // Update user subscription
            this.updateUserSubscription();

            // Record payment
            this.recordPayment();

        } catch (error) {
            this.showMessage('Payment failed: ' + error.message, 'error');
            this.hideProcessingModal();
        }
    }

    validatePaymentForm() {
        if (this.selectedMethod === 'card') {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cardName = document.getElementById('cardName').value;

            if (!cardNumber || !expiryDate || !cvv || !cardName) {
                this.showMessage('Please fill in all card details', 'error');
                return false;
            }

            // Basic card validation
            if (!this.validateCardNumber(cardNumber)) {
                this.showMessage('Please enter a valid card number', 'error');
                return false;
            }

            if (!this.validateExpiryDate(expiryDate)) {
                this.showMessage('Please enter a valid expiry date', 'error');
                return false;
            }

            if (!this.validateCVV(cvv)) {
                this.showMessage('Please enter a valid CVV', 'error');
                return false;
            }
        } else {
            const phone = document.getElementById('paymentPhone').value;
            if (!phone) {
                this.showMessage('Please enter your phone number', 'error');
                return false;
            }

            if (!this.validatePhoneNumber(phone)) {
                this.showMessage('Please enter a valid phone number', 'error');
                return false;
            }
        }

        return true;
    }

    validateCardNumber(number) {
        // Simple Luhn algorithm check
        const cleaned = number.replace(/\s+/g, '');
        if (!/^\d+$/.test(cleaned)) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned.charAt(i));
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    validateExpiryDate(date) {
        const [month, year] = date.split('/');
        if (!month || !year) return false;
        
        const now = new Date();
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        
        return expiry > now;
    }

    validateCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }

    validatePhoneNumber(phone) {
        return /^255\d{9}$/.test(phone.replace(/\s/g, ''));
    }

    showProcessingModal() {
        const modal = document.getElementById('paymentProcessingModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';

            // Simulate processing steps
            this.simulateProcessingSteps();
        }
    }

    hideProcessingModal() {
        const modal = document.getElementById('paymentProcessingModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    simulateProcessingSteps() {
        const steps = document.querySelectorAll('.processing-steps .step');
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                steps[currentStep].classList.add('active');
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }

    async simulatePayment() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success (90% success rate for demo)
                if (Math.random() < 0.9) {
                    resolve();
                } else {
                    reject(new Error('Payment gateway timeout'));
                }
            }, 4000);
        });
    }

    showSuccessModal() {
        this.hideProcessingModal();

        const modal = document.getElementById('paymentSuccessModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';

            // Update success details
            document.getElementById('successPlan').textContent = 
                this.selectedAmount === 9999 ? 'Pro Plan - 1 Month' :
                this.selectedAmount === 49999 ? 'Pro Plan - 6 Months' : 'Pro Plan - 1 Year';
            
            document.getElementById('successAmount').textContent = `TZS ${this.selectedAmount.toLocaleString()}`;
            
            const expiryDate = new Date();
            if (this.selectedAmount === 9999) expiryDate.setMonth(expiryDate.getMonth() + 1);
            else if (this.selectedAmount === 49999) expiryDate.setMonth(expiryDate.getMonth() + 6);
            else expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            
            document.getElementById('successExpiry').textContent = expiryDate.toLocaleDateString();
        }
    }

    closeSuccessModal() {
        const modal = document.getElementById('paymentSuccessModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    updateUserSubscription() {
        const users = JSON.parse(localStorage.getItem('frediUsers')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            const expiryDate = new Date();
            if (this.selectedAmount === 9999) expiryDate.setMonth(expiryDate.getMonth() + 1);
            else if (this.selectedAmount === 49999) expiryDate.setMonth(expiryDate.getMonth() + 6);
            else expiryDate.setFullYear(expiryDate.getFullYear() + 1);

            users[userIndex].subscription = 'pro';
            users[userIndex].subscriptionExpiry = expiryDate.toISOString();
            users[userIndex].planType = this.selectedAmount === 9999 ? 'monthly' : 
                                      this.selectedAmount === 49999 ? '6months' : 'yearly';
            
            localStorage.setItem('frediUsers', JSON.stringify(users));
            
            // Update current user
            this.currentUser = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    recordPayment() {
        const payment = {
            id: 'pay_' + Date.now(),
            userId: this.currentUser.id,
            amount: this.selectedAmount,
            currency: 'TZS',
            method: this.selectedMethod,
            plan: 'pro',
            date: new Date().toISOString(),
            status: 'completed'
        };

        this.paymentHistory.push(payment);
        localStorage.setItem('paymentHistory', JSON.stringify(this.paymentHistory));
    }

    startFreeTrial() {
        if (confirm('Start your 7-day free trial of Fredi AI Pro?')) {
            const users = JSON.parse(localStorage.getItem('frediUsers')) || [];
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                const trialExpiry = new Date();
                trialExpiry.setDate(trialExpiry.getDate() + 7);

                users[userIndex].subscription = 'trial';
                users[userIndex].subscriptionExpiry = trialExpiry.toISOString();
                users[userIndex].isTrialUsed = true;
                
                localStorage.setItem('frediUsers', JSON.stringify(users));
                
                // Update current user
                this.currentUser = users[userIndex];
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

                this.showMessage('Free trial activated! Enjoy Pro features for 7 days.', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            }
        }
    }

    contactEnterprise() {
        const email = 'enterprise@frediai.com';
        const subject = 'Enterprise Plan Inquiry';
        const body = `Hello Fredi AI Team,\n\nI am interested in your Enterprise plan. Please contact me with more information.\n\nBest regards,\n${this.currentUser.fullName}`;
        
        window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    }

    showMessage(message, type) {
        if (window.frediAuth && window.frediAuth.showMessage) {
            window.frediAuth.showMessage(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize payment processing when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('payment.html')) {
        window.frediPayment = new FrediPayment();
    }
});
