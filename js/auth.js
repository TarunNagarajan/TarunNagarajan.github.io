document.addEventListener('DOMContentLoaded', function() {
    // Update DateTime
    function updateDateTime() {
        const now = new Date();
        const formatted = now.toISOString().replace('T', ' ').slice(0, 19);
        document.getElementById('currentDateTime').textContent = formatted;
    }

    // Update time initially and every second
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Password Toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // Form Submission
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');

    signInForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signInForm);
        const submitBtn = signInForm.querySelector('button[type="submit"]');
        
        try {
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Redirect to dashboard
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Sign in error:', error);
            alert('Failed to sign in. Please try again.');
            
            // Reset button state
            submitBtn.innerHTML = 'Sign In';
            submitBtn.disabled = false;
        }
    });

    signUpForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signUpForm);
        const submitBtn = signUpForm.querySelector('button[type="submit"]');
        
        try {
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Redirect to dashboard
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Sign up error:', error);
            alert('Failed to create account. Please try again.');
            
            // Reset button state
            submitBtn.innerHTML = 'Create Account';
            submitBtn.disabled = false;
        }
    });

    // Social Auth Buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const provider = button.classList.contains('btn-github') ? 'GitHub' : 'Google';
            alert(`${provider} authentication will be implemented here.`);
        });
    });

        // Session Handling
        class AuthSession {
            constructor() {
                this.currentUser = null;
                this.isAuthenticated = false;
                this.sessionStartTime = null;
                this.lastActivityTime = null;
            }
    
            setSession(userData) {
                this.currentUser = userData;
                this.isAuthenticated = true;
                this.sessionStartTime = new Date().toISOString();
                this.lastActivityTime = new Date().toISOString();
                
                // Store session in localStorage
                localStorage.setItem('authSession', JSON.stringify({
                    user: this.currentUser,
                    isAuthenticated: this.isAuthenticated,
                    sessionStartTime: this.sessionStartTime,
                    lastActivityTime: this.lastActivityTime
                }));
            }
    
            clearSession() {
                this.currentUser = null;
                this.isAuthenticated = false;
                this.sessionStartTime = null;
                this.lastActivityTime = null;
                localStorage.removeItem('authSession');
            }
    
            updateLastActivity() {
                this.lastActivityTime = new Date().toISOString();
                if (this.isAuthenticated) {
                    const session = JSON.parse(localStorage.getItem('authSession'));
                    session.lastActivityTime = this.lastActivityTime;
                    localStorage.setItem('authSession', JSON.stringify(session));
                }
            }
    
            checkSession() {
                const session = localStorage.getItem('authSession');
                if (session) {
                    const parsedSession = JSON.parse(session);
                    this.currentUser = parsedSession.user;
                    this.isAuthenticated = parsedSession.isAuthenticated;
                    this.sessionStartTime = parsedSession.sessionStartTime;
                    this.lastActivityTime = parsedSession.lastActivityTime;
    
                    // Check session expiry (30 minutes)
                    const lastActivity = new Date(this.lastActivityTime);
                    const now = new Date();
                    const diffMinutes = (now - lastActivity) / (1000 * 60);
    
                    if (diffMinutes > 30) {
                        this.clearSession();
                        return false;
                    }
                    return true;
                }
                return false;
            }
        }
    
        // Initialize auth session
        const authSession = new AuthSession();
    
        // Check if user is already authenticated
        if (authSession.checkSession()) {
            // Redirect to dashboard if on auth pages
            if (window.location.pathname.includes('signin.html') || 
                window.location.pathname.includes('signup.html')) {
                window.location.href = 'index.html';
            }
        } else {
            // Redirect to signin if not on auth pages
            if (!window.location.pathname.includes('signin.html') && 
                !window.location.pathname.includes('signup.html')) {
                window.location.href = 'signin.html';
            }
        }
    
        // Form validation
        function validateForm(form) {
            const password = form.querySelector('input[type="password"]');
            if (password.value.length < 8) {
                alert('Password must be at least 8 characters long');
                return false;
            }
            
            const email = form.querySelector('input[type="email"]');
            if (!email.value.includes('@')) {
                alert('Please enter a valid email address');
                return false;
            }
    
            return true;
        }
    
        // Update sign in form handling
        signInForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validateForm(signInForm)) return;
    
            const formData = new FormData(signInForm);
            const submitBtn = signInForm.querySelector('button[type="submit"]');
            
            try {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
                submitBtn.disabled = true;
    
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
    
                // Set session with user data
                authSession.setSession({
                    login: 'TarunNagarajan',
                    email: formData.get('email'),
                    name: 'Tarun Nagarajan',
                    avatar: 'assets/images/avatar.jpg'
                });
    
                window.location.href = 'index.html';
    
            } catch (error) {
                console.error('Sign in error:', error);
                submitBtn.innerHTML = 'Sign In';
                submitBtn.disabled = false;
                alert('Failed to sign in. Please try again.');
            }
        });
    
        // Update sign up form handling
        signUpForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validateForm(signUpForm)) return;
    
            const formData = new FormData(signUpForm);
            const submitBtn = signUpForm.querySelector('button[type="submit"]');
            
            try {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
                submitBtn.disabled = true;
    
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
    
                // Set session with new user data
                authSession.setSession({
                    login: formData.get('email').split('@')[0],
                    email: formData.get('email'),
                    name: formData.get('fullName'),
                    institution: formData.get('institution'),
                    avatar: 'assets/images/default-avatar.jpg'
                });
    
                window.location.href = 'index.html';
    
            } catch (error) {
                console.error('Sign up error:', error);
                submitBtn.innerHTML = 'Create Account';
                submitBtn.disabled = false;
                alert('Failed to create account. Please try again.');
            }
        });
    
        // Add logout functionality to the navbar
        const logoutLink = document.querySelector('.logout-link');
        logoutLink?.addEventListener('click', (e) => {
            e.preventDefault();
            authSession.clearSession();
            window.location.href = 'signin.html';
        });
    
        // Update activity timestamp on user interaction
        ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, () => {
                authSession.updateLastActivity();
            });
        });
    });