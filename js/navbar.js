document.addEventListener('DOMContentLoaded', function() {
    // Update DateTime
    function updateNavDateTime() {
        const now = new Date();
        const formatted = now.toISOString().replace('T', ' ').slice(0, 19);
        const navDateTime = document.getElementById('navDateTime');
        if (navDateTime) {
            navDateTime.textContent = formatted;
        }
    }

    // Update time initially and every second
    updateNavDateTime();
    setInterval(updateNavDateTime, 1000);

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // User Dropdown Toggle
    const userButton = document.querySelector('.user-button');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    userButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        dropdownMenu?.classList.remove('active');
    });
});