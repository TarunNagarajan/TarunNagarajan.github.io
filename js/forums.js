document.addEventListener('DOMContentLoaded', function() {
    // Sample discussions data (replace with your actual data source)
    const allDiscussions = [
        {
            id: 1,
            title: 'Quantum Computing Applications in Machine Learning',
            author: 'TarunNagarajan',
            date: '2025-03-20T14:28:55Z',
            preview: 'Exploring the intersection of quantum computing and machine learning algorithms for enhanced data processing and pattern recognition.',
            tags: ['Quantum', 'ML', 'Research'],
            views: 156,
            replies: 23,
            likes: 45
        },
        {
            id: 2,
            title: 'Neural Networks in Climate Modeling',
            author: 'ClimateResearcher',
            date: '2025-03-20T14:25:30Z',
            preview: 'Investigating the application of deep learning networks in improving climate prediction models and weather forecasting accuracy.',
            tags: ['Climate', 'AI', 'Models'],
            views: 89,
            replies: 12,
            likes: 34
        },
        {
            id: 3,
            title: 'Advances in CRISPR Gene Editing',
            author: 'BioTechPro',
            date: '2025-03-20T14:20:15Z',
            preview: 'Discussion on recent breakthroughs in CRISPR technology and its implications for genetic research and medical treatments.',
            tags: ['Biology', 'Genetics', 'CRISPR'],
            views: 234,
            replies: 45,
            likes: 78
        }
        // Add more sample discussions as needed
    ];

    const discussionsList = document.getElementById('discussionsList');
    const scrollLoader = document.getElementById('scrollLoader');
    let currentPage = 1;
    let isLoading = false;
    const itemsPerPage = 10;
    let loadedDiscussions = new Set(); // Track loaded discussion IDs

    // Render a single discussion item
    function renderDiscussionItem(discussion) {
        const date = new Date(discussion.date);
        const formattedDate = date.toISOString().replace('T', ' ').slice(0, 19);
        
        return `
            <div class="discussion-item" data-id="${discussion.id}">
                <div class="discussion-header">
                    <h3 class="discussion-title">${discussion.title}</h3>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        ${formattedDate}
                    </div>
                </div>
                <div class="discussion-meta">
                    <div class="meta-item">
                        <i class="fas fa-user"></i>
                        ${discussion.author}
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-eye"></i>
                        ${discussion.views} views
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-comment"></i>
                        ${discussion.replies} replies
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-heart"></i>
                        ${discussion.likes} likes
                    </div>
                </div>
                <p class="discussion-preview">${discussion.preview}</p>
                <div class="discussion-footer">
                    <div class="discussion-tags">
                        ${discussion.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    <div class="discussion-actions">
                        <button class="btn btn-text" title="Bookmark">
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button class="btn btn-text" title="Share">
                            <i class="fas fa-share"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Load discussions with animation
    function loadDiscussions(page) {
        if (isLoading) return;
        
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Check if we have more discussions to load
        if (startIndex >= allDiscussions.length) {
            scrollLoader.classList.remove('active');
            return;
        }

        isLoading = true;
        scrollLoader.classList.add('active');

        // Simulate API call
        setTimeout(() => {
            const newDiscussions = allDiscussions
                .slice(startIndex, endIndex)
                .filter(discussion => !loadedDiscussions.has(discussion.id));

            if (newDiscussions.length === 0) {
                scrollLoader.classList.remove('active');
                isLoading = false;
                return;
            }

            const fragment = document.createDocumentFragment();
            
            newDiscussions.forEach(discussion => {
                if (!loadedDiscussions.has(discussion.id)) {
                    loadedDiscussions.add(discussion.id);
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = renderDiscussionItem(discussion);
                    fragment.appendChild(tempDiv.firstChild);
                }
            });

            discussionsList.appendChild(fragment);
            currentPage++;
            isLoading = false;
            scrollLoader.classList.remove('active');
        }, 800);
    }

    // Throttle scroll handler
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Infinite scroll handler
    const handleScroll = throttle(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 300 && !isLoading) {
            loadDiscussions(currentPage);
        }
    }, 250);

    // View toggle handler
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            discussionsList.dataset.view = btn.dataset.view;
        });
    });

    // Clear existing discussions and reset state
    function resetDiscussions() {
        discussionsList.innerHTML = '';
        loadedDiscussions.clear();
        currentPage = 1;
        isLoading = false;
    }

    // Initialize discussions
    function initializeDiscussions() {
        resetDiscussions();
        loadDiscussions(currentPage);
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial load
    initializeDiscussions();

    // Update time every second
    function updateDateTime() {
        const now = new Date();
        const formatted = now.toISOString().replace('T', ' ').slice(0, 19);
        document.querySelectorAll('#currentDateTime, #headerDateTime, #navDateTime').forEach(el => {
            if (el) el.textContent = formatted;
        });
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();
});