document.addEventListener('DOMContentLoaded', function() {
    // Sample publications data
    const publications = [
        {
            id: 1,
            title: "Quantum Neural Networks for Advanced Machine Learning",
            authors: ["TarunNagarajan", "Sarah Chen", "David Kumar"],
            abstract: "This paper presents a novel approach to implementing quantum computing principles in neural network architectures...",
            journal: "Nature Quantum Computing",
            year: 2025,
            citations: 145,
            type: "Research Article",
            category: "Computer Science",
            tags: ["Quantum Computing", "Machine Learning", "Neural Networks"],
            impact_factor: 8.2,
            doi: "10.1038/s41234-025-0123-4",
            date_published: "2025-02-15",
            views: 2890,
            downloads: 567
        },
        {
            id: 2,
            title: "CRISPR-Based Gene Editing: A Systematic Review",
            authors: ["Maria Rodriguez", "TarunNagarajan", "John Smith"],
            abstract: "A comprehensive review of recent advances in CRISPR gene editing technology...",
            journal: "Cell",
            year: 2025,
            citations: 89,
            type: "Review Article",
            category: "Biology",
            tags: ["CRISPR", "Gene Editing", "Biotechnology"],
            impact_factor: 9.1,
            doi: "10.1016/j.cell.2025.01.015",
            date_published: "2025-01-20",
            views: 1567,
            downloads: 342
        },
        {
            id: 3,
            title: "Climate Change Prediction Using Deep Learning",
            authors: ["TarunNagarajan", "Emily Brown"],
            abstract: "Novel deep learning approaches for accurate climate change prediction...",
            journal: "Nature Climate Change",
            year: 2025,
            citations: 56,
            type: "Research Article",
            category: "Environmental Science",
            tags: ["Climate Change", "Deep Learning", "AI"],
            impact_factor: 7.8,
            doi: "10.1038/s41558-025-0789-2",
            date_published: "2025-03-01",
            views: 987,
            downloads: 234
        }
        // Add more publications as needed
    ];

    // Track filter state
    let filterState = {
        category: '',
        type: '',
        year: '',
        tags: new Set(),
        searchQuery: ''
    };

    // Initialize publications display
    const publicationsContainer = document.querySelector('.publications-main');
    const searchInput = document.querySelector('#publicationSearch');
    const categoryFilter = document.querySelector('#categoryFilter');
    const typeFilter = document.querySelector('#typeFilter');
    const yearFilter = document.querySelector('#yearFilter');
    const tagsList = document.querySelector('#tagsFilter');

    // Generate filters
    function initializeFilters() {
        // Collect unique values
        const categories = new Set(publications.map(p => p.category));
        const types = new Set(publications.map(p => p.type));
        const years = new Set(publications.map(p => p.year));
        const allTags = new Set(publications.flatMap(p => p.tags));

        // Populate category filter
        categoryFilter.innerHTML = `
            <option value="">All Categories</option>
            ${[...categories].sort().map(category => 
                `<option value="${category}">${category}</option>`
            ).join('')}
        `;

        // Populate type filter
        typeFilter.innerHTML = `
            <option value="">All Types</option>
            ${[...types].sort().map(type => 
                `<option value="${type}">${type}</option>`
            ).join('')}
        `;

        // Populate year filter
        yearFilter.innerHTML = `
            <option value="">All Years</option>
            ${[...years].sort().reverse().map(year => 
                `<option value="${year}">${year}</option>`
            ).join('')}
        `;

        // Populate tags
        tagsList.innerHTML = [...allTags].sort().map(tag => `
            <div class="checkbox-label">
                <input type="checkbox" value="${tag}">
                <span>${tag}</span>
            </div>
        `).join('');
    }

    // Filter publications
    function filterPublications() {
        return publications.filter(pub => {
            // Category filter
            if (filterState.category && pub.category !== filterState.category) return false;
            
            // Type filter
            if (filterState.type && pub.type !== filterState.type) return false;
            
            // Year filter
            if (filterState.year && pub.year.toString() !== filterState.year) return false;
            
            // Tags filter
            if (filterState.tags.size > 0) {
                if (!pub.tags.some(tag => filterState.tags.has(tag))) return false;
            }
            
            // Search query
            if (filterState.searchQuery) {
                const query = filterState.searchQuery.toLowerCase();
                return pub.title.toLowerCase().includes(query) ||
                    pub.abstract.toLowerCase().includes(query) ||
                    pub.authors.some(author => author.toLowerCase().includes(query)) ||
                    pub.tags.some(tag => tag.toLowerCase().includes(query));
            }
            
            return true;
        });
    }

    // Render publication card
    function renderPublicationCard(pub) {
        return `
            <div class="publication-card" data-id="${pub.id}">
                <div class="publication-header">
                    <h3 class="publication-title">${pub.title}</h3>
                    <span class="publication-type">${pub.type}</span>
                </div>
                
                <div class="publication-authors">
                    ${pub.authors.map(author => `
                        <span class="author-tag">
                            ${author}
                        </span>
                    `).join('')}
                </div>
                
                <div class="publication-meta">
                    <span><i class="fas fa-book-open"></i> ${pub.journal}</span>
                    <span><i class="fas fa-calendar"></i> ${pub.date_published}</span>
                    <span><i class="fas fa-quote-right"></i> ${pub.citations} citations</span>
                    <span><i class="fas fa-chart-line"></i> IF: ${pub.impact_factor}</span>
                </div>
                
                <p class="publication-abstract">${pub.abstract}</p>
                
                <div class="publication-stats">
                    <span><i class="fas fa-eye"></i> ${pub.views} views</span>
                    <span><i class="fas fa-download"></i> ${pub.downloads} downloads</span>
                    <span><i class="fas fa-external-link-alt"></i> DOI: ${pub.doi}</span>
                </div>
                
                <div class="publication-tags">
                    ${pub.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('')}
                </div>
                
                <div class="publication-actions">
                    <button class="btn btn-primary" onclick="window.open('https://doi.org/${pub.doi}')">
                        Read Paper
                    </button>
                    <button class="btn btn-secondary" onclick="downloadPaper(${pub.id})">
                        Download PDF
                    </button>
                </div>
            </div>
        `;
    }

    // Update publications display
    function updatePublicationsDisplay() {
        const filteredPubs = filterPublications();
        
        // Update count
        document.querySelector('.publications-count').textContent = 
            `Showing ${filteredPubs.length} publications`;
        
        // Update display
        const pubHTML = filteredPubs.map(renderPublicationCard).join('');
        publicationsContainer.innerHTML = pubHTML || '<p>No publications found matching your criteria.</p>';
    }

    // Event Listeners
    searchInput?.addEventListener('input', (e) => {
        filterState.searchQuery = e.target.value;
        updatePublicationsDisplay();
    });

    categoryFilter?.addEventListener('change', (e) => {
        filterState.category = e.target.value;
        updatePublicationsDisplay();
    });

    typeFilter?.addEventListener('change', (e) => {
        filterState.type = e.target.value;
        updatePublicationsDisplay();
    });

    yearFilter?.addEventListener('change', (e) => {
        filterState.year = e.target.value;
        updatePublicationsDisplay();
    });

    tagsList?.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            if (e.target.checked) {
                filterState.tags.add(e.target.value);
            } else {
                filterState.tags.delete(e.target.value);
            }
            updatePublicationsDisplay();
        }
    });

    // Sort functionality
    document.querySelector('#sortSelect')?.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        const filteredPubs = filterPublications();
        
        switch(sortBy) {
            case 'date':
                filteredPubs.sort((a, b) => new Date(b.date_published) - new Date(a.date_published));
                break;
            case 'citations':
                filteredPubs.sort((a, b) => b.citations - a.citations);
                break;
            case 'impact':
                filteredPubs.sort((a, b) => b.impact_factor - a.impact_factor);
                break;
            case 'views':
                filteredPubs.sort((a, b) => b.views - a.views);
                break;
        }
        
        const pubHTML = filteredPubs.map(renderPublicationCard).join('');
        publicationsContainer.innerHTML = pubHTML;
    });

    // Initialize
    initializeFilters();
    updatePublicationsDisplay();
});