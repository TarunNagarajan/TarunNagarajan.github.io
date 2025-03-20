document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading bar
    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading';
    document.body.appendChild(loadingBar);

    // Add scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Smooth scroll to top
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Handle page transitions
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        
        if (link && link.href && link.href.startsWith(window.location.origin) && !link.hasAttribute('download')) {
            e.preventDefault();
            
            // Show loading bar
            loadingBar.classList.add('active');
            
            // Add fade out effect
            document.body.classList.add('fade-out');
            
            // Navigate to new page after transition
            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
        }
    });

    // Smooth scroll for anchor links
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

    // Remove loading bar when page is loaded
    window.addEventListener('load', () => {
        loadingBar.classList.remove('active');
        document.body.classList.remove('fade-out');
    });

    // Add smooth scrolling to all elements
    const addSmoothScrolling = () => {
        document.querySelectorAll('*').forEach(element => {
            element.style.scrollBehavior = 'smooth';
        });
    };

    // Initialize smooth scrolling
    addSmoothScrolling();

    // Update current time with smooth transition
    const updateTimeWithTransition = () => {
        const timeElements = document.querySelectorAll('.current-time, #currentDateTime, #navDateTime');
        const now = new Date();
        const formatted = now.toISOString().replace('T', ' ').slice(0, 19);
        
        timeElements.forEach(element => {
            if (element.textContent !== formatted) {
                element.style.opacity = '0';
                setTimeout(() => {
                    element.textContent = formatted;
                    element.style.opacity = '1';
                }, 150);
            }
        });
    };

    // Update time every second with smooth transition
    setInterval(updateTimeWithTransition, 1000);
});