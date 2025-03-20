/**
 * Main JavaScript file for common functionality across the website
 */

// Dark mode implementation
class ThemeManager {
    constructor() {
        this.darkMode = false;
        this.init();
    }

    init() {
        // Check for saved user preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.enableDarkMode();
        }

        // Add theme toggle to navigation if it exists
        this.createThemeToggle();
    }

    createThemeToggle() {
        const nav = document.querySelector('.nav-links');
        if (nav) {
            const themeToggle = document.createElement('li');
            themeToggle.innerHTML = `
                <button class="theme-toggle" aria-label="Toggle dark mode">
                    <i class="fas fa-moon"></i>
                </button>
            `;
            nav.appendChild(themeToggle);

            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    enableDarkMode() {
        document.documentElement.classList.add('dark-mode');
        this.darkMode = true;
        localStorage.setItem('theme', 'dark');
    }

    disableDarkMode() {
        document.documentElement.classList.remove('dark-mode');
        this.darkMode = false;
        localStorage.setItem('theme', 'light');
    }

    toggleTheme() {
        if (this.darkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }
}

// Navigation menu functionality
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.navToggle = document.getElementById('navToggle');
        this.navLinks = document.querySelector('.nav-links');

        if (this.navToggle && this.navLinks) {
            this.navToggle.addEventListener('click', () => this.toggleNav());
            this.setupClickOutside();
        }

        // Add scroll event listener for header
        this.handleScroll();
    }

    toggleNav() {
        this.navLinks.classList.toggle('active');
        this.navToggle.setAttribute('aria-expanded', 
            this.navLinks.classList.contains('active'));
    }

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            if (!this.navLinks.contains(e.target) && 
                !this.navToggle.contains(e.target)) {
                this.navLinks.classList.remove('active');
                this.navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    handleScroll() {
        const header = document.querySelector('.main-header');
        if (header) {
            let lastScroll = 0;

            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;

                if (currentScroll <= 0) {
                    header.classList.remove('scroll-up');
                    return;
                }

                if (currentScroll > lastScroll && 
                    !header.classList.contains('scroll-down')) {
                    // Scrolling down
                    header.classList.remove('scroll-up');
                    header.classList.add('scroll-down');
                } else if (currentScroll < lastScroll && 
                    header.classList.contains('scroll-down')) {
                    // Scrolling up
                    header.classList.remove('scroll-down');
                    header.classList.add('scroll-up');
                }

                lastScroll = currentScroll;
            });
        }
    }
}

// Form validation utility
class FormValidator {
    static validate(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                this.showError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && input.value) {
                if (!this.validateEmail(input.value)) {
                    this.showError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        input.parentElement.appendChild(errorDiv);
        input.classList.add('error');

        input.addEventListener('input', () => {
            errorDiv.remove();
            input.classList.remove('error');
        }, { once: true });
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    const themeManager = new ThemeManager();
    
    // Initialize navigation
    const navigation = new Navigation();

    // Setup form validation for any forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (FormValidator.validate(form)) {
                // Handle form submission
                console.log('Form is valid, processing submission...');
            }
        });
    });
});

// Add global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.message);
    // Could implement error reporting service here
});