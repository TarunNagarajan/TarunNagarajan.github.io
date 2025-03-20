document.addEventListener('DOMContentLoaded', function() {
    // Update current time
    function updateCurrentTime() {
        const now = new Date();
        const formatted = now.toISOString().replace('T', ' ').substring(0, 19);
        document.getElementById('currentTime').textContent = formatted;
    }

    // Initial time update
    updateCurrentTime();
    // Update time every minute
    setInterval(updateCurrentTime, 60000);

    // Sample resources data
    const resources = [
        {
            id: 1,
            type: 'paper',
            title: 'Advanced Machine Learning Algorithms',
            description: 'Comprehensive review of modern ML algorithms and their applications',
            author: 'TarunNagarajan',
            date: '2025-03-19',
            tags: ['ML', 'AI', 'Research'],
            access: 'public',
            views: 245,
            saves: 56
        },
        {
            id: 2,
            type: 'dataset',
            title: 'Climate Change Dataset 2024',
            description: 'Global temperature and weather patterns dataset spanning 50 years',
            author: 'ClimateResearch',
            date: '2025-03-18',
            tags: ['Climate', 'Data', 'Environment'],
            access: 'public',
            views: 189,
            saves: 43
        },
        {
            id: 3,
            type: 'tool',
            title: 'Research Analysis Toolkit',
            description: 'Comprehensive suite of research analysis tools',
            author: 'ResearchTools',
            date: '2025-03-17',
            tags: ['Analysis', 'Tools', 'Research'],
            access: 'public',
            views: 312,
            saves: 89
        }
    ];

    // Render resource card
    function renderResourceCard(resource) {
        return `
            <div class="resource-card">
                <span class="resource-type type-${resource.type}">
                    ${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </span>
                <h3 class="resource-title">${resource.title}</h3>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-meta">
                    <span>
                        <i class="fas fa-eye"></i> ${resource.views} views
                    </span>
                    <span>
                        <i class="fas fa-bookmark"></i> ${resource.saves} saves
                    </span>
                </div>
                <div class="resource-tags">
                    ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // Initialize resources
    function initializeResources() {
        const featuredContainer = document.getElementById('featuredResources');
        const recentContainer = document.getElementById('recentResources');
        const popularContainer = document.getElementById('popularResources');

        if (featuredContainer) {
            featuredContainer.innerHTML = resources
                .filter(r => r.views > 200)
                .map(renderResourceCard)
                .join('');
        }

        if (recentContainer) {
            recentContainer.innerHTML = resources
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(renderResourceCard)
                .join('');
        }

        if (popularContainer) {
            popularContainer.innerHTML = resources
                .sort((a, b) => b.saves - a.saves)
                .map(renderResourceCard)
                .join('');
        }
    }

    // Modal handling
    const modal = document.getElementById('addResourceModal');
    const addResourceBtn = document.getElementById('addResourceBtn');
    const closeModal = document.querySelector('.close-modal');

    addResourceBtn?.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeModal?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close modal when clicking outside
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Handle form submission
    const addResourceForm = document.getElementById('addResourceForm');
    addResourceForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addResourceForm);
        const submitBtn = addResourceForm.querySelector('button[type="submit"]');

        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Add new resource to list
            resources.unshift({
                id: resources.length + 1,
                type: formData.get('type'),
                title: formData.get('title'),
                description: formData.get('description'),
                author: 'TarunNagarajan',
                date: new Date().toISOString().split('T')[0],
                tags: formData.get('tags').split(',').map(t => t.trim()),
                access: formData.get('access'),
                views: 0,
                saves: 0
            });

            // Refresh resources display
            initializeResources();

            // Close modal and reset form
            modal.classList.remove('active');
            addResourceForm.reset();

        } catch (error) {
            console.error('Error adding resource:', error);
            alert('Failed to add resource. Please try again.');
        } finally {
            submitBtn.innerHTML = 'Add Resource';
            submitBtn.disabled = false;
        }
    });

    // Initialize the page
    initializeResources();

    // Search functionality
    const searchInput = document.getElementById('resourceSearch');
    searchInput?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterResources(searchTerm);
    });

    function filterResources(searchTerm) {
        const filteredResources = resources.filter(resource => 
            resource.title.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm) ||
            resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );

        // Update all resource containers with filtered results
        const containers = ['featuredResources', 'recentResources', 'popularResources'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = filteredResources.map(renderResourceCard).join('');
            }
        });
    }
});