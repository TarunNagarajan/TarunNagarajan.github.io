/**
 * Projects Page Functionality
 * @author TarunNagarajan
 * @lastUpdated 2025-03-20 03:06:24
 */

class ProjectsManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.totalProjects = 0;
        this.currentView = 'grid';
        this.filters = {
            search: '',
            category: '',
            status: '',
            sortBy: 'recent'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProjects();
        this.setupViewToggle();
        this.initializeModals();
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.filters.search = searchInput.value;
                this.currentPage = 1;
                this.loadProjects();
            }, 300));
        }

        // Filter selects
        ['categoryFilter', 'statusFilter', 'sortBy'].forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => {
                    this.filters[filterId.replace('Filter', '').toLowerCase()] = filter.value;
                    this.currentPage = 1;
                    this.loadProjects();
                });
            }
        });

        // Create project button
        document.getElementById('createProjectBtn')?.addEventListener('click', 
            () => this.showModal('createProjectModal'));

        // Create project form
        document.getElementById('createProjectForm')?.addEventListener('submit', 
            (e) => this.handleCreateProject(e));
    }

    setupViewToggle() {
        const viewButtons = document.querySelectorAll('.view-btn');
        const projectsGrid = document.getElementById('projectsGrid');

        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                
                if (projectsGrid) {
                    projectsGrid.className = `projects-grid ${this.currentView}-view`;
                }
            });
        });
    }

    async loadProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        try {
            projectsGrid.innerHTML = '<div class="loading-spinner">Loading projects...</div>';
            
            const projects = await this.fetchProjects();
            this.totalProjects = projects.total;
            
            if (projects.items.length === 0) {
                projectsGrid.innerHTML = this.getEmptyStateHTML();
                return;
            }

            projectsGrid.innerHTML = projects.items
                .map(project => this.createProjectCard(project))
                .join('');

            this.updatePagination();
        } catch (error) {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = this.getErrorStateHTML();
        }
    }

    createProjectCard(project) {
        return `
            <article class="project-card" data-project-id="${project.id}">
                <div class="project-image">
                    <span class="project-category">${project.category}</span>
                    ${project.image ? `<img src="${project.image}" alt="${project.title}">` : ''}
                </div>
                <div class="project-content">
                    <div class="project-header">
                        <h3 class="project-title">${project.title}</h3>
                        <span class="project-status status-${project.status.toLowerCase()}">
                            ${project.status}
                        </span>
                    </div>
                    <p class="project-summary">${project.summary}</p>
                    <div class="project-meta">
                        <div class="project-team">
                            <div class="team-avatars">
                                ${this.createTeamAvatars(project.team)}
                            </div>
                            <span class="team-count">${project.team.length} members</span>
                        </div>
                        <div class="project-stats">
                            <span class="stat-item">
                                <i class="fas fa-comment"></i> ${project.commentsCount}
                            </span>
                            <span class="stat-item">
                                <i class="fas fa-star"></i> ${project.starsCount}
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    createTeamAvatars(team) {
        return team.slice(0, 3).map(member => `
            <img class="team-avatar" 
                 src="${member.avatar}" 
                 alt="${member.name}"
                 title="${member.name}"
                 onerror="this.src='assets/images/default-avatar.png'">
        `).join('') + (team.length > 3 ? 
            `<span class="team-avatar more-members">+${team.length - 3}</span>` : '');
    }

    updatePagination() {
        const pagination = document.getElementById('projectsPagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.totalProjects / this.itemsPerPage);
        const numbers = pagination.querySelector('.pagination-numbers');
        const prevBtn = pagination.querySelector('[data-page="prev"]');
        const nextBtn = pagination.querySelector('[data-page="next"]');

        // Update disabled state of prev/next buttons
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;

        // Generate page numbers
        numbers.innerHTML = this.generatePaginationNumbers(totalPages);

        // Add click handlers to page numbers
        numbers.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.dataset.page);
                this.loadProjects();
            });
        });

        // Add click handlers to prev/next buttons
        prevBtn.onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadProjects();
            }
        };

        nextBtn.onclick = () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.loadProjects();
            }
        };
    }

    generatePaginationNumbers(totalPages) {
        let numbers = [];
        const current = this.currentPage;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                numbers.push(i);
            }
        } else {
            numbers = [1];
            
            if (current > 3) {
                numbers.push('...');
            }
            
            for (let i = Math.max(2, current - 1); 
                 i <= Math.min(current + 1, totalPages - 1); i++) {
                numbers.push(i);
            }
            
            if (current < totalPages - 2) {
                numbers.push('...');
            }
            
            numbers.push(totalPages);
        }

        return numbers.map(num => {
            if (num === '...') {
                return '<span class="pagination-ellipsis">...</span>';
            }
            return `
                <button class="page-number ${num === current ? 'active' : ''}" 
                        data-page="${num}">
                    ${num}
                </button>
            `;
        }).join('');
    }

    async handleCreateProject(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        try {
            // Validate form data
            if (!this.validateProjectForm(formData)) {
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
            submitBtn.disabled = true;

            // Simulate API call
            await this.createProject(Object.fromEntries(formData));

            // Reset form and close modal
            form.reset();
            this.hideModal('createProjectModal');
            
            // Refresh projects list
            this.loadProjects();

            // Show success message
            this.showNotification('Project created successfully!', 'success');
        } catch (error) {
            console.error('Error creating project:', error);
            this.showNotification('Failed to create project. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateProjectForm(formData) {
        const requiredFields = ['title', 'summary', 'description', 'category', 'duration', 'teamSize'];
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                this.showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                return false;
            }
        }
        return true;
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showNotification(message, type = 'info') {
        // Implement notification system
        console.log(`${type.toUpperCase()}: ${message}`);
        // You could add a toast notification system here
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No projects found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
        `;
    }

    getErrorStateHTML() {
        return `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error loading projects</h3>
                <p>Please try refreshing the page or try again later.</p>
            </div>
        `;
    }

    // API Simulation Methods
    async fetchProjects() {
        // Simulate API call with filters and pagination
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    items: this.generateMockProjects(),
                    total: 50
                });
            }, 1000);
        });
    }

    async createProject(projectData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Created project:', projectData);
                resolve({ success: true });
            }, 1500);
        });
    }

    generateMockProjects() {
        // Generate mock project data
        return Array(this.itemsPerPage).fill(null).map((_, index) => ({
            id: index + 1 + (this.currentPage - 1) * this.itemsPerPage,
            title: `Research Project ${index + 1}`,
            summary: 'This is a mock research project summary.',
            category: 'Computer Science',
            status: ['Active', 'Planning', 'Completed', 'On Hold'][Math.floor(Math.random() * 4)],
            team: [
                { name: 'TarunNagarajan', avatar: 'assets/images/avatar1.jpg' },
                { name: 'Jane Doe', avatar: 'assets/images/avatar2.jpg' }
            ],
            commentsCount: Math.floor(Math.random() * 50),
            starsCount: Math.floor(Math.random() * 100)
        }));
    }
}

// Initialize projects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const projectsManager = new ProjectsManager();
});